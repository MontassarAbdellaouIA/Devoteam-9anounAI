"""
This script processes documents from a specified directory, chunks them,
generates embeddings, and stores them in a vector database (FAISS or Supabase).

Usage:
    python Ingest_in_db.py --source_dir path/to/your/data --db_type faiss
    python Ingest_in_db.py --source_dir path/to/your/data --db_type supabase
"""

import os
import argparse
import logging
from dotenv import load_dotenv

# LangChain and AI model imports
from langchain.schema import Document
from langchain.vectorstores import FAISS
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_google_vertexai import VertexAIEmbeddings

# Document processing imports (docling)
from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
from docling.datamodel.base_models import InputFormat
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.pipeline.standard_pdf_pipeline import StandardPdfPipeline
from docling.chunking import HybridChunker

# Other imports
from transformers import AutoTokenizer
from huggingface_hub import login
import vertexai
from supabase.client import Client, create_client

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Constants ---
MAX_TOKENS = 1000
FAISS_INDEX_PATH = "FAISS_index"
TOKENIZER_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct"
EMBEDDING_MODEL = "gemini-embedding-001" # Example model, adjust as needed

def load_api_keys():
    """Loads API keys from a .env file and environment variables."""
    load_dotenv()
    
    hf_token = os.getenv("HF_TOKEN")
    project_id = os.getenv("PROJECT_ID")
    location = os.getenv("LOCATION")
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

    if not all([hf_token, project_id, location]):
        raise ValueError("Missing required environment variables: HF_TOKEN, PROJECT_ID, LOCATION")
        
    return {
        "hf_token": hf_token,
        "project_id": project_id,
        "location": location,
        "supabase_url": supabase_url,
        "supabase_key": supabase_key
    }

def initialize_services(config):
    """Initializes external services like Hugging Face, Vertex AI, and Supabase."""
    try:
        login(token=config["hf_token"])
        logging.info("Successfully logged into Hugging Face.")
    except Exception as e:
        logging.error(f"Hugging Face login failed: {e}")
        raise

    try:
        vertexai.init(project=config["project_id"], location=config["location"])
        logging.info("Vertex AI SDK initialized.")
    except Exception as e:
        logging.error(f"Failed to initialize Vertex AI SDK: {e}")
        raise
        
    supabase_client = None
    if config.get("supabase_url") and config.get("supabase_key"):
        try:
            supabase_client = create_client(config["supabase_url"], config["supabase_key"])
            logging.info("Supabase client created successfully.")
        except Exception as e:
            logging.error(f"Failed to create Supabase client: {e}")
    else:
        logging.warning("Supabase URL or key not found. Supabase functionality will be disabled.")
        
    return supabase_client

def process_and_chunk_documents(data_source_dir: str):
    """
    Processes all PDF files in a directory, chunks them, and returns them
    as LangChain Document objects.
    """
    # 1. Initialize Document Converter
    converter = DocumentConverter(
        format_options={
            InputFormat.PDF: PdfFormatOption(
                pipeline_cls=StandardPdfPipeline, backend=PyPdfiumDocumentBackend
            )
        },
    )

    # 2. Initialize Chunker
    try:
        tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_MODEL)
    except Exception as e:
        logging.error(f"Failed to load tokenizer model '{TOKENIZER_MODEL}': {e}")
        raise
        
    chunker = HybridChunker(
        tokenizer=tokenizer,
        max_tokens=MAX_TOKENS,
        merge_peers=True,
    )

    # 3. Process files
    all_chunks = []
    if not os.path.isdir(data_source_dir):
        logging.error(f"Source directory not found: {data_source_dir}")
        return []

    logging.info(f"Starting document processing from directory: {data_source_dir}")
    for filename in os.listdir(data_source_dir):
        file_path = os.path.join(data_source_dir, filename)
        if os.path.isfile(file_path) and filename.lower().endswith('.pdf'):
            try:
                logging.info(f"Processing file: {filename}")
                result = converter.convert(file_path)
                if result.document:
                    chunk_iter = chunker.chunk(dl_doc=result.document)
                    all_chunks.extend(list(chunk_iter))
                else:
                    logging.warning(f"Conversion of {filename} resulted in an empty document.")
            except Exception as e:
                logging.error(f"Failed to process {filename}: {e}")

    # 4. Format for LangChain
    langchain_documents = [
        Document(
            page_content=chunk.text,
            metadata={
                "filename": chunk.meta.origin.filename.removesuffix(".pdf"),
                "page_numbers": sorted(list(set(prov.page_no for item in chunk.meta.doc_items for prov in item.prov))) or None,
                "title": chunk.meta.headings[0] if chunk.meta.headings else None,
                # Example source, consider making this dynamic
                "source": f"file://{chunk.meta.origin.filename}",
            }
        )
        for chunk in all_chunks
    ]
    
    logging.info(f"Total documents created: {len(langchain_documents)}")
    return langchain_documents

def store_in_faiss(documents: list[Document], embeddings, index_path: str):
    """Creates and saves a FAISS vector store."""
    if not documents:
        logging.warning("No documents to store in FAISS.")
        return
    try:
        logging.info("Creating FAISS vector store...")
        vector_store = FAISS.from_documents(documents, embedding=embeddings)
        vector_store.save_local(index_path)
        logging.info(f"Documents stored successfully in FAISS at '{index_path}'.")
    except Exception as e:
        logging.error(f"Failed to store documents in FAISS: {e}")
        raise

def store_in_supabase(documents: list[Document], embeddings, client: Client):
    """Stores documents in a Supabase vector store."""
    if not documents:
        logging.warning("No documents to store in Supabase.")
        return
    if not client:
        logging.error("Supabase client is not initialized. Cannot store documents.")
        return
        
    try:
        logging.info("Storing documents in Supabase...")
        SupabaseVectorStore.from_documents(
            documents,
            embeddings,
            client=client,
            table_name="documents",
            query_name="match_documents",
            chunk_size=100, # Adjust chunk size as needed
        )
        logging.info("Documents stored successfully in Supabase.")
    except Exception as e:
        logging.error(f"Failed to store documents in Supabase: {e}")
        raise

def main():
    """Main function to orchestrate the ingestion process."""
    parser = argparse.ArgumentParser(description="Process documents and store them in a vector DB.")
    parser.add_argument("--source_dir", type=str, required=True, help="Directory containing the source documents.")
    parser.add_argument("--db_type", type=str, choices=['faiss', 'supabase'], required=True, help="The vector database to use ('faiss' or 'supabase').")
    args = parser.parse_args()

    try:
        # Load configuration and initialize services
        config = load_api_keys()
        supabase_client = initialize_services(config)
        
        # Initialize embedding model
        embeddings = VertexAIEmbeddings(model_name=EMBEDDING_MODEL)

        # Process and chunk documents
        documents = process_and_chunk_documents(args.source_dir)

        if not documents:
            logging.info("No documents were processed. Exiting.")
            return

        # Store in the selected vector database
        if args.db_type == 'faiss':
            store_in_faiss(documents, embeddings, FAISS_INDEX_PATH)
        elif args.db_type == 'supabase':
            store_in_supabase(documents, embeddings, supabase_client)
            
    except Exception as e:
        logging.critical(f"An unhandled error occurred: {e}")

if __name__ == "__main__":
    main()
