# 📚  Documentation des APIs (BCT AI Regulatory Assistant)

Dans le cadre du passage au stade MVP, l'application adopte une architecture découplée (Frontend Next.js / Backend FastAPI). Cette section documente les interfaces de communication entre le client, le serveur interne, et les services d'Intelligence Artificielle.


## 1. Documentation Interactive (Swagger UI)

Le backend étant développé avec FastAPI, la documentation interactive complète (OpenAPI) est générée automatiquement.
Une fois le backend lancé, elle est accessible via :

- Swagger UI : http://localhost:8000/docs

- ReDoc : http://localhost:8000/redoc

## 2. Endpoints du Backend (FastAPI)

Le serveur FastAPI expose les services de RAG (Retrieval-Augmented Generation) au réseau interne.

### POST /query

Point d'entrée principal pour interroger l'Agent IA. Il prend la question de l'utilisateur, interroge la base vectorielle FAISS, et fait appel à Gemini pour générer la réponse.

- URL : /query
- Méthode : POST
- Headers : Content-Type: application/json


Body (Request) :
```bash
{
  "question": "Y a-t-il une limite annuelle pour les paiements en ligne à l'étranger ?"
}
```

Réponse (Succès - 200 OK) :
```bash
{
  "status": "success",
  "data": {
    "answer": "Oui, il existe des limites annuelles pour les paiements en ligne à l'étranger, notamment via la Carte Technologique Internationale (CTI)...",
    "sources": [
      "Circulaire aux intermédiaires agréés n°2025-05",
      "Recueil des Règlements de Change, SECTION II"
    ]
  }
}
```

Réponse (Erreur - 400/500) :
```bash
{
  "status": "error",
  "details": "Agent not initialized. / Missing required environment variables."
}
```

## 3. Routes API du Frontend (Next.js)
Pour des raisons de sécurité (masquage des tokens, gestion des sessions/authentification), le frontend Next.js expose ses propres routes API qui agissent comme des proxys sécurisés vers le Backend FastAPI ou vers la base de données.


### POST /api/query

Gère les requêtes du chat utilisateur. Cette route appelle le /query du backend FastAPI et formate la réponse pour les composants React.

- Payload envoyé par queryAssistant :

```bash
{
  "question": "string",
  "history": [] 
}
```

### POST /api/feedback

Permet de collecter les retours des utilisateurs (pouce en l'air / pouce vers le bas) pour améliorer le modèle et tracer la qualité des réponses (Logging & Persistance).

Payload envoyé par sendFeedback :
```bash
{
  "messageId": "msg_123456789",
  "feedback": "positive" // ou "negative"
}
```

## 4. Intégration des APIs Externes (Google Vertex AI)

Le backend ne s'appuie sur le réseau externe public que pour l'appel aux modèles de fondation Google via le SDK Vertex AI.

- Modèle d'Embedding : gemini-embedding-001
    
    - Rôle : Convertit les requêtes textuelles de l'utilisateur en vecteurs mathématiques pour la recherche de similarité dans la base FAISS.

- Modèle LLM (Génération) : gemini-2.0-flash
    
    - Rôle : Modèle d'orchestration (Agent ReAct) et de synthèse des réponses.

    - Sécurité : Appelé avec l'authentification GOOGLE_APPLICATION_CREDENTIALS. Le flux est chiffré de bout en bout (TLS) et les données envoyées ne sont pas utilisées pour ré-entraîner les modèles publics de Google (conformément aux politiques de confidentialité Entreprise de Google Cloud).
