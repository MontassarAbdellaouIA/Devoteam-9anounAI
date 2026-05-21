"""
This script implements an Agentic RAG system to answer questions based on a
vector store of documents from the Central Bank of Tunisia (BCT).

It can be run directly from the command line or used as a module for a FastAPI application.

Usage (CLI):
    python agentic_rag.py "Your question in French or Arabic"

"""
import os
import re
import json
import argparse
import tempfile
from dotenv import load_dotenv
from typing import Tuple

# --- FIX: Load environment variables IMMEDIATELY ---
load_dotenv()

# --- AJOUT DU LOGGER CENTRALISÉ ---
from core_logger import logger

# LangChain and AI model imports
from langchain_community.vectorstores import FAISS
from langchain_google_vertexai import VertexAIEmbeddings, ChatVertexAI

# --- NEW IMPORTS FOR MODEL FACTORY ---
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI

from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_classic.agents import AgentExecutor
from langchain_classic.agents import create_tool_calling_agent

# Other imports
import vertexai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# --- Constants ---
# UPDATED: Pointing to the new Master Index containing all regulations
FAISS_INDEX_PATH = "FAISS_Index_Master_BCT"
EMBEDDING_MODEL = "text-embedding-004" # UPDATED: Aligning with the ingestion model

# --- Safe fallback values ---
DEFAULT_PROVIDER = os.getenv("LLM_PROVIDER", "vertex")
DEFAULT_LLM_MODEL = os.getenv("LLM_MODEL", "gemini-2.5-flash-lite")

# --- Global Variables ---
vector_store = None
agent_executor = None

# --- TRACEABILITY TRACKER ---
ACTIVE_LLM_INFO = {"provider": "unknown", "model": "unknown"}

def get_llm(provider: str = None, model_name: str = None):
    """
    Model Factory: Initializes and returns the specified LLM based on the provider.
    Supported providers: 'vertex', 'groq', 'openrouter', 'ollama' (local)
    """
    global ACTIVE_LLM_INFO
    
    # Use defaults if nothing is passed
    if provider is None:
        provider = DEFAULT_PROVIDER
    if model_name is None:
        model_name = DEFAULT_LLM_MODEL

    # Update the global tracker for traceability
    ACTIVE_LLM_INFO["provider"] = provider
    ACTIVE_LLM_INFO["model"] = model_name

    logger.info(f"Initializing LLM Factory with provider '{provider}' and model '{model_name}'...")

    try:
        if provider == "vertex":
            project_id = os.getenv("PROJECT_ID")
            return ChatVertexAI(model_name=model_name, project=project_id, temperature=0)

        elif provider == "groq":
            groq_api_key = os.getenv("GROQ_API_KEY")
            if not groq_api_key:
                raise ValueError("GROQ_API_KEY environment variable is missing.")
            return ChatGroq(groq_api_key=groq_api_key, model_name=model_name, temperature=0)

        elif provider == "openrouter":
            or_api_key = os.getenv("OPENROUTER_API_KEY")
            if not or_api_key:
                raise ValueError("OPENROUTER_API_KEY environment variable is missing.")
            return ChatOpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=or_api_key,
                model=model_name,
                temperature=0
            )

        elif provider in ["ollama", "local"]:
            return ChatOpenAI(
                base_url="http://localhost:11434/v1",
                api_key="ollama", 
                model=model_name,
                temperature=0
            )

        else:
            raise ValueError(f"Unsupported LLM provider: {provider}")

    except Exception as e:
        logger.error(f"Failed to initialize LLM provider '{provider}': {e}", exc_info=True)
        raise

def load_config_and_init_services():
    """
    Loads API keys, initializes Vertex AI (for embeddings), loads the FAISS vector store,
    and initializes the LLM via the Model Factory.
    """
    global vector_store

    load_dotenv()

    # --- Handle Google Credentials for Render/Local ---
    google_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
    if google_json:
        try:
            with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".json") as temp:
                temp.write(google_json)
                temp_path = temp.name

            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_path
            logger.info(f"Successfully loaded Google Credentials from env var to {temp_path}")
        except Exception as e:
            logger.error(f"Failed to process GOOGLE_CREDENTIALS_JSON: {e}", exc_info=True)

    # Load core credentials
    project_id = os.getenv("PROJECT_ID")
    location = os.getenv("LOCATION")

    if not all([project_id, location]):
        msg = "Missing required environment variables for Embeddings: PROJECT_ID, LOCATION"
        logger.error(msg)
        raise ValueError(msg)

    # Initialize Vertex AI SDK
    try:
        logger.info("Initializing Vertex AI SDK for Embeddings...")
        vertexai.init(project=project_id, location=location)
        embeddings = VertexAIEmbeddings(model_name=EMBEDDING_MODEL)
        logger.info("Vertex AI SDK initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Vertex AI: {e}", exc_info=True)
        raise

    # Load FAISS Vector Store
    try:
        logger.info(f"Loading FAISS index from '{FAISS_INDEX_PATH}'...")
        vector_store = FAISS.load_local(
            FAISS_INDEX_PATH,
            embeddings,
            allow_dangerous_deserialization=True
        )
        logger.info("FAISS index loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load FAISS index: {e}", exc_info=True)
        raise

    # Initialize LLM via the Model Factory
    llm = get_llm()
    logger.info("LLM initialized successfully.")
    return llm

@tool
def retrieve(query: str) -> Tuple[str, tuple]:
    """
    Searches and retrieves relevant excerpts from the regulatory documents
    of the Central Bank of Tunisia to answer a question.
    Use this function to find information on circulars,
    banking regulations, and foreign exchange regulations.
    """
    global vector_store
    if vector_store is None:
        logger.warning("Retrieve tool called but Vector store is not initialized.")
        return "Vector store not initialized.", tuple()

    logger.info(f"--- Searching knowledge base with query: '{query}' ---")
    
    # 1. BROAD SEMANTIC FETCH (Sans pénalité MMR)
    # On récupère un large spectre de documents très similaires (ex: k=20) 
    # pour être certain de capturer TOUTES les versions temporelles d'une même loi.
    raw_retrieved_docs = vector_store.similarity_search(query, k=20)

    # 2. FONCTION DE TRI TEMPOREL
    def extract_year(doc_obj):
        date_str = doc_obj.metadata.get("date", "0")
        filename_str = doc_obj.metadata.get("filename", "")
        # Cherche une année dans la date ou le nom du fichier
        years = re.findall(r'(20\d{2}|19\d{2})', f"{date_str} {filename_str}")
        return int(years[0]) if years else 0

    # 3. RE-RANKING CHRONOLOGIQUE STRICT
    # On trie les 20 documents du plus récent (2026) au plus ancien
    raw_retrieved_docs.sort(key=extract_year, reverse=True)

    # 4. TRONCATURE (Temporal Truncation)
    # On ne garde que les 10 documents les plus récents parmi les plus pertinents
    best_chronological_docs = raw_retrieved_docs[:10]

    unique_sources = set()
    serialized_content = []

    for doc in best_chronological_docs:
        metadata_str = json.dumps(doc.metadata, ensure_ascii=False)
        serialized_content.append(f"Source: {metadata_str}\nContent: {doc.page_content}")
        if 'source' in doc.metadata:
            unique_sources.add(doc.metadata['source'])

    logger.info(f"⏳ Temporal Re-ranking: Sent {len(best_chronological_docs)} newest chunks to the agent.")
    return "\n\n".join(serialized_content), tuple(unique_sources)



def create_agent(llm):
    """Creates the RAG agent and executor with strict query generation constraints."""
    global agent_executor

    prompt = ChatPromptTemplate.from_messages([
        ("system", """ You are an expert bilingual (French/Arabic) assistant specializing in the regulations of the Central Bank of Tunisia (BCT).

Your mission is to provide accurate, factual, and sourced answers based EXCLUSIVELY on the official documents provided to you through the available tools.

Your instructions are:

1. **Analyze the question**: Carefully read the user's question to understand their regulatory information needs, even if it is indirect or a clarification request.

2. **MANDATORY tool usage & QUERY RULES**: For each question, you must use the `retrieve` tool to search for relevant information in the knowledge base.
   - ⚠️ **CRITICAL SEARCH RULE**: You must NEVER strip out explicit years (e.g., 2026, 2025, 2024), specific article numbers, or unique proper nouns mentioned by the user when formulating the `query` string for the tool.
   - If the user asks about "Hajj 2026", your tool input query MUST explicitly include the token "2026" and "Hajj". Stripping the year or numbers will cause total retrieval failure due to the massive volume of historical data.

3. **Synthesize and Formulate**: Once the documents are retrieved, analyze their content and formulate a clear and concise answer in French or Arabic depending on the user's language.

4. **Cite sources**: Always cite your sources precisely in your response. For example: 
   - "Selon la circulaire n°2025-08, article 4..." 
   - "Conformément au Recueil des Règlements de Change, page 112..."
   - Cite systématiquement TOUS les documents, numéros de circulaires et articles pertinents qui ont servi à formuler ta réponse. S'il y a plusieurs sources concordantes, cite-les toutes.

5. **Adaptive Effort**: 
   - If the exact answer is not explicitly present, try to clarify using the closest related regulatory concepts from the retrieved documents.  
   - Provide useful context or interpretation (e.g., explaining what "année civile" generally means in the context of BCT regulations).  
   - If the document base is silent, state this clearly but guide the user towards what *is* defined in the regulations.

6. **User Engagement**: Structure responses to keep the user interested. After giving the main answer, you may suggest exploring related regulatory points that might help them.

7. **Language Rule**:  
   - If the question is in French (or any other language except Arabic), the response MUST be entirely in French.  
   - If the question is in Arabic, the response MUST be entirely in Arabic.  

8. **Tone**: Always maintain a professional, clear, and formal tone, appropriate for a banking and regulatory context, while remaining user-friendly and engaging.
"""),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    tools = [retrieve]
    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        return_intermediate_steps=True
    )
    logger.info("RAG agent created successfully with strict query validation rules.")
    
    
def get_rag_response(query: str) -> dict:
    """Invokes the RAG agent and processes the response."""
    global agent_executor, ACTIVE_LLM_INFO
    if agent_executor is None:
        logger.error("Attempted to get RAG response but Agent is not initialized.")
        return {"error": "Agent not initialized."}

    try:
        logger.debug(f"Invoking Agent Executor with query: {query}")

        logger.info(f"🤖 TRACEABILITY -> Generating response using Provider: '{ACTIVE_LLM_INFO['provider']}' | Model: '{ACTIVE_LLM_INFO['model']}'")

        response = agent_executor.invoke({"input": query})

        output_text = response.get("output", "No output generated.")
        source_urls = []

        intermediate_steps = response.get("intermediate_steps", [])
        if intermediate_steps:
            # The tool output is the second element of the tuple in the first step
            tool_output = intermediate_steps[0][1]
            # The source URLs are the second element of the tool's output tuple
            source_urls = list(tool_output[1])

        logger.info("RAG response generated successfully.")
        return {"answer": output_text, "sources": source_urls}

    except Exception as e:
        logger.error(f"An error occurred during agent invocation: {e}", exc_info=True)
        return {"error": str(e)}

# --- FastAPI Application ---
app = FastAPI(
    title="BCT Agentic RAG API",
    description="API for querying regulations of the Central Bank of Tunisia.",
    version="1.0.0"
)

# --- Add CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

@app.on_event("startup")
async def startup_event():
    """Initializes all necessary services on application startup."""
    logger.info("Application startup: Initializing services...")
    llm = load_config_and_init_services()
    create_agent(llm)
    logger.info("Services initialized. Application is ready.")

@app.post("/query")
async def query_agent(request: QueryRequest):
    """Endpoint to receive a query and return the agent's response."""
    logger.info(f"Received API query: {request.question}")
    response = get_rag_response(request.question)
    if "error" in response:
        logger.warning(f"API query resulted in an error: {response['error']}")
        return {"status": "error", "details": response["error"]}
    return {"status": "success", "data": response}

def main_cli():
    """Main function for command-line execution."""
    parser = argparse.ArgumentParser(description="Query the BCT RAG agent from the command line.")
    parser.add_argument("query", type=str, help="The question to ask the agent.")
    parser.add_argument("--provider", type=str, default=DEFAULT_PROVIDER, help="LLM Provider (vertex, groq, openrouter, ollama)")
    parser.add_argument("--model", type=str, default=DEFAULT_LLM_MODEL, help="Model name (e.g., gemini-2.0-flash, llama-3.1-8b-instant)")
    args = parser.parse_args()

    # Initialize services and agent for CLI mode
    logger.info(f"Starting in CLI mode (Provider: {args.provider}, Model: {args.model})...")

    # Initialize global resources (FAISS/Embeddings)
    load_config_and_init_services()

    # Override LLM factory explicitly for CLI arguments
    llm = get_llm(provider=args.provider, model_name=args.model)
    create_agent(llm)

    print("\n--- Querying Agent ---")
    result = get_rag_response(args.query)
    print("\n--- Agent Response ---")
    if "error" in result:
        print(f"Error: {result['error']}")
    else:
        print(f"Answer:\n{result['answer']}")
        print(f"\nSources:\n" + "\n".join(f"- {s}" for s in result['sources']))
    print("----------------------")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and not sys.argv[1].startswith("--"):
        main_cli()
    else:
        print("Starting FastAPI server...")
        print("Usage: uvicorn agentic_rag:app --reload")