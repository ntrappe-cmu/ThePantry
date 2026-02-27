"""
Application Configuration

Centralizes all configuration settings.
"""
import os

class Config:
    """
    Base Configuration
    
    Switch between SQLite (Default) and MySQL (Production) via URI
    """
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///the_pantry.db")
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
    
class TestConfig(Config):
    """
    Testing configuration
    
    Uses in-memory SQLite
    """
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"