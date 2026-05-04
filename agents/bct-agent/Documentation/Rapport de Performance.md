# 📊 Rapport de Performance : Test d'Inférence Locale (On-Premise)

- Date du test : 30 Avril 2026

- Architecture : Agentic RAG (LangChain)

- Fournisseur LLM : Ollama (Local / On-Premise)

- Modèle testé : qwen3.5:9b (9 milliards de paramètres)

- Configuration matérielle : Machine de développement standard (CPU/GPU local)

## 1. Contexte de l'évaluation

Dans le cadre de l'exigence "Etape 0" visant à prouver la faisabilité d'un déploiement 100% On-Premise pour la BCT (zéro donnée vers l'extérieur), un test d'inférence a été réalisé avec le modèle open source qwen3.5:9b via le moteur local Ollama.

## 2. Analyse Chronologique des Logs

Une requête utilisateur complexe a été soumise à l'agent : "Combien d'argent puis-je prendre avec moi pour un voyage touristique cette année ? C'est ce qu'on appelle l'allocation touristique ?"

L'analyse des logs révèle le cycle de vie suivant :

    - T0 (10:08:45) : Réception de la requête par le backend FastAPI.

    - T1 (10:09:54) : Déclenchement de l'outil de recherche (retrieve).

        - Latence Étape 1 : ~1 minute et 9 secondes. (L'agent LLM réfléchit et décide d'appeler l'outil de recherche en générant un format JSON).

    - T2 (10:09:59) : Récupération réussie de 4 documents depuis la base vectorielle FAISS (k=4).

        - Latence Étape 2 : ~5 secondes. (Recherche vectorielle locale très rapide).

    - T3 (10:16:14) : Génération de la réponse finale par l'agent.

        - Latence Étape 3 : ~6 minutes et 15 secondes. (Le LLM lit les 4 documents extraits, synthétise le contexte et rédige la réponse finale).

⏳ Temps de traitement total : 7 minutes et 29 secondes.

## 3. Diagnostic Technique

Le temps de réponse (~7.5 minutes) est actuellement trop élevé pour une utilisation fluide en production. Ce phénomène s'explique par les facteurs suivants :

La charge matérielle (Hardware Bottleneck) : Un modèle de 9 milliards de paramètres (qwen3.5:9b) nécessite environ 6 à 8 Go de mémoire VRAM (Carte Graphique) pour fonctionner de manière fluide. S'il est exécuté principalement sur le CPU et la RAM standard de la machine de développement, la vitesse de traitement des "tokens" chute drastiquement.

L'architecture Agentique (Multi-Step) : Contrairement à un chatbot simple, un agent RAG fait deux appels au LLM :

    - Appel 1 : Comprendre la question et formuler la requête de recherche.

    - Appel 2 : Ingérer le contexte volumineux (les 4 documents) et rédiger la réponse.

Le coût du "Context Window" : Lire 4 chunks de textes réglementaires représente un grand volume de tokens d'entrée, ce qui sature la mémoire locale lors de l'inférence.

## 4. Plan d'Action & Recommandations

Pour atteindre des temps de réponse acceptables (inférieurs à 15 secondes) en mode On-Premise, les actions suivantes sont recommandées :

    - Action 1 : Dimensionnement Serveur (Production)

        Le déploiement local chez le client (BCT) nécessitera un serveur équipé d'un GPU dédié à l'IA (ex: NVIDIA RTX 4090 24GB, ou A100) pour garantir une inférence instantanée.

    - Action 2 : Optimisation des Modèles (Développement)

        Basculer les tests locaux vers des modèles "Small Language Models" (SLM) moins lourds mais performants, tels que gemma4:e4b (4 milliards) ou qwen2.5:1.5b.
