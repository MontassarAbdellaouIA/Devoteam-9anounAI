import logging
import os
from logging.handlers import RotatingFileHandler

def setup_logger():
    # Crée le dossier logs s'il n'existe pas
    os.makedirs("logs", exist_ok=True)
    
    # Création du logger principal pour le RAG
    logger = logging.getLogger("BCT_RAG_Assistant")
    logger.setLevel(logging.DEBUG) # On capte tout en interne

    # Format officiel et standardisé
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - [%(module)s] - %(message)s')

    # 1. Handler pour la CONSOLE (Terminal) -> Affiche INFO, WARNING, ERROR
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)

    # 2. Handler pour le FICHIER UNIQUE -> Enregistre dans logs/rag_assistant.log
    # Rotation : max 5 MB par fichier, on garde les 3 plus récents
    file_handler = RotatingFileHandler(
        "logs/rag_assistant.log", maxBytes=5*1024*1024, backupCount=3, encoding="utf-8"
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)

    # Ajout des handlers (évite les doublons lors des reloads Uvicorn)
    if not logger.handlers:
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)

    return logger

# On instancie le logger une seule fois
logger = setup_logger()