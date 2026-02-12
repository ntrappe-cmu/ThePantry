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
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///food_rescue.db")
    
    
class TestConfig(Config):
    """
    Testing configuration
    
    Uses in-memory SQLite
    """
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"