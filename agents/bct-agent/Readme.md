# 🏛️ BCT AI Regulatory Assistant

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-MVP_Active-success.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

> **A secure, intelligent, and bilingual (French/Arabic) conversational agent designed exclusively for the Banque Centrale de Tunisie (BCT).**

## 📖 Project Overview

The **BCT AI Regulatory Assistant** is a core module of the Devoteam-9anounAI Agent Market. It transforms how compliance officers, legal experts, and business leaders interact with complex financial regulations. 

Powered by an **Agentic Retrieval-Augmented Generation (RAG)** architecture, it synthesizes answers directly from official BCT circulars and regulatory texts, providing instant, highly accurate, and fully cited responses.

**Core Philosophy: Expert, not Creative.** This AI is hermetically sealed. It cannot browse the public internet and is strictly instructed to generate answers *only* using the provided BCT context, effectively eliminating LLM hallucinations.

---

## ✨ Key Features

- **Natural Language Querying:** Ask complex regulatory questions in French or Arabic.
- **Strictly Sourced Answers:** Every generated claim includes a precise citation (e.g., *Source: Circulaire 2024-05, Article 14*).
- **Zero Hallucination Guarantee:** Information boundaries are locked to the internal vector database.
- **Bilingual Interface:** Seamlessly handles right-to-left (Arabic) and left-to-right (French) queries and document parsing.
- **Enterprise Security:** Designed for On-Premise deployment ensuring data sovereignty.

---

## 🏗️ Architecture & Technology Stack

This specific agent relies on a decoupled architecture designed for high performance and strict security, completely isolated from other agents in the monorepo.

### 💻 Frontend (`/frontend`)
- **Framework:** Next.js / React
- **Language:** TypeScript
- **Styling:** Tailwind CSS / Glassmorphism UI

### ⚙️ Backend & AI Orchestration (`/backend`)
- **Framework:** Python, FastAPI
- **AI/LLM Framework:** LangChain, Agent ReAct Architecture
- **LLM Provider:** Google Gemini (via Vertex AI API) - *Optimized with Gemini 2.5 Flash.*
- **Database:** Secure Vector Database (FAISS)

---

## 🛠️ Local Development & Installation

Since this agent is part of a monorepo, ensure you have cloned the main `Devoteam-9anounAI` repository first.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- [uv](https://github.com/astral-sh/uv) (Extremely fast Python package installer)
- Google Cloud Platform (GCP) Account with Vertex AI enabled.

### 1. Navigate to the Agent Directory
From the root of the monorepo, navigate to the BCT agent folder:
```bash
cd agents/bct-agent
```

### 2. Backend Setup 
```bash
cd backend
# Create a virtual environment using uv
uv venv
# Activate the virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
# Install dependencies instantly with uv
uv pip install -r requirements.txt
```
### 3. Frontend Setup
Open a new terminal window, navigate to the frontend folder, and install dependencies:

```bash
cd agents/bct-agent/frontend
npm install
```
### 4. Environment Variables
Create a .env file in the backend directory. Never commit this file.

```bash
GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/vertex-ai-service-account.json"
GCP_PROJECT_ID="your-gcp-project-id"
GCP_LOCATION="europe-west1"
```
### 5. Run the Application
Start the Backend (Terminal 1):

```bash
cd agents/bct-agent/backend
uvicorn main:app --reload --port 8000
```

Start the Frontend (Terminal 2):

```bash
cd agents/bct-agent/frontend
npm run dev
```
*The application will be available at `http://localhost:3000`.*

---

## 🔒 Confidentiality & Compliance
This software processes public regulatory data but is built to comply with Tunisian data sovereignty laws. **No citizen banking data or Personally Identifiable Information (PII) is processed by the external LLM.**

---
*Developed by Devoteam - April 2026*