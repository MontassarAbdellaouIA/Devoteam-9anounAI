import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

# Importez l'application FastAPI depuis votre script principal
# Assurez-vous que votre fichier s'appelle bien agentic_rag.py
from agentic_rag import app 

client = TestClient(app)

def test_query_endpoint_success():
    """Test que l'API renvoie bien une réponse 200 avec le bon format."""
    
    # On simule la fonction get_rag_response pour ne pas appeler le vrai LLM
    mock_response = {
        "answer": "Ceci est une réponse simulée basée sur la BCT.",
        "sources": ["Circulaire 2024-05", "Code des changes"]
    }
    
    with patch('agentic_rag.get_rag_response', return_value=mock_response):
        response = client.post(
            "/query",
            json={"question": "Quelle est la limite de paiement ?"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["data"]["answer"] == mock_response["answer"]
        assert len(data["data"]["sources"]) == 2

def test_query_endpoint_error():
    """Test la gestion des erreurs du RAG."""
    
    mock_error = {"error": "Vector store not initialized."}
    
    with patch('agentic_rag.get_rag_response', return_value=mock_error):
        response = client.post(
            "/query",
            json={"question": "Test erreur ?"}
        )
        
        assert response.status_code == 200 # L'API renvoie 200 mais le status interne est error
        data = response.json()
        assert data["status"] == "error"
        assert "Vector store not initialized" in data["details"]