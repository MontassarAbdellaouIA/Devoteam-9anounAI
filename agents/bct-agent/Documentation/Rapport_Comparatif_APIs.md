# 📊 Rapport d'Évaluation : Comparatif des APIs LLM (Vertex AI, Groq, OpenRouter)

    Date : 30 Avril 2026

    Projet : BCT AI Regulatory Assistant
    
    Objectif : Évaluer la stabilité, la latence et les contraintes des différents fournisseurs d'IA via l'architecture "Model Factory".

## Synthèse Exécutive

Grâce à l'implémentation d'une "Model Factory" dans notre backend agentic_rag.py, nous avons pu tester à la volée trois fournisseurs d'API différents sans modifier la logique applicative. L'analyse des logs du 29 au 30 Avril révèle des différences majeures en termes de latence, de gestion des limites de tokens (Rate Limits), et de compatibilité avec les agents "Tool Calling".

## 1. Google Vertex AI (gemini-2.0-flash) - La Référence (Baseline)

C'est l'architecture d'origine de l'application, utilisant l'infrastructure Enterprise de Google Cloud.

    Exemple de cycle (Logs de 17:31) :

        - Réception de la requête : 17:31:10

        - Exécution de l'outil (k=7) : 17:31:20 à 17:31:25

        - Génération finale : 17:31:28

        - Latence moyenne observée : ~15 à 18 secondes (pour des questions complexes).

    Analyse : * Avantages : Extrêmement stable. Aucune erreur de "Rate Limit" ou de "Tool Calling" n'a été détectée, même avec de gros volumes de contexte (k=20).

    Conclusion : Solution la plus fiable pour la mise en production (MVP) si le déploiement reste sur le Cloud.

## 2. Groq (llama-3.3-70b & llama-4-scout) - L'Ultra-Vélocité sous Contraintes

Groq utilise des puces spécialisées (LPU) promettant des vitesses d'inférence inégalées pour les modèles Open Source (famille Meta Llama).

    Exemple de cycle réussi (Logs de 14:15) :

        - Réception de la requête : 14:15:59

        - Génération finale : 14:16:06

        - Latence moyenne observée : ~7 secondes (Impressionnant !).

    Analyse des Erreurs (Insights critiques) :

        1. Erreur de surcharge de Tokens (Erreur 413) à 14:20 : * Log : Rate Limit: 12000, Requested 20889.

            Cause : Le niveau gratuit de Groq limite les requêtes à 12K Tokens par minute (TPM). L'extraction de 20 documents (k=20) via FAISS génère un payload de ~20.8K tokens, causant un crash immédiat. Action corrective menée : Réduction du paramètre k à 5 ou 7.

        2. Erreur d'incompatibilité Agentique à 14:22 :

            Log : Failed to call a function. Please adjust your prompt. avec le modèle llama-4-scout-17b.

            Cause : Tous les modèles ne supportent pas le format strict du JSON "Function Calling" imposé par LangChain.

            Conclusion : Groq est incroyablement rapide, mais son utilisation nécessite une gestion experte de la taille du contexte (optimisation du Retriever) et l'utilisation stricte de modèles officiellement "Tool-Calling compatibles" (ex: llama-3.1-8b ou llama-3.3-70b).

## 3. OpenRouter (qwen-2.5-72b-instruct) - L'Agrégateur Flexible

OpenRouter permet d'interroger n'importe quel modèle (ici le performant modèle Qwen pour l'Arabe/Français) via une seule API, offrant des endpoints "gratuits" pour les tests.

    Exemple de cycle (Logs de 17:50) :

        - Réception de la requête : 17:50:43

        - Exécution de l'outil (k=7) : 17:50:46

        - Génération finale : 17:51:21

        - Latence moyenne observée : ~35 à 40 secondes.

    Conclusion : Une excellente plateforme pour comparer la qualité de réponse de dizaines de modèles en phase de développement (Benchmark métier). Cependant, pour garantir la disponibilité de l'application, il est impératif d'utiliser les endpoints payants d'OpenRouter (retrait du suffixe :free).

## 🎯 Recommandations Stratégiques (Next Steps)

Standardisation du contexte (Le paramètre 'k') : Le test avec Groq prouve qu'envoyer trop de documents (k=10) est inefficace et coûteux. La configuration standard de l'application est désormais fixée à k=4 ou k=5, ce qui permet de passer sous les radars des limites API de tous les fournisseurs tout en gardant une précision maximale.

Gestion des erreurs et Résilience : Le système de Logging a prouvé son efficacité. Il sera nécessaire d'implémenter un système de Fallback (ex: Si l'API Groq renvoie une erreur 429, basculer automatiquement sur l'API Vertex en arrière-plan) pour le MVP.

Poursuite du Benchmark (Etape 0) : Nous avons validé la mécanique de Switch (Changement de modèles). L'étape suivante consiste à passer le script d'évaluation de 50 Questions (Ragas) sur Vertex et Groq pour valider non plus la technique, mais l'exactitude juridique des réponses.