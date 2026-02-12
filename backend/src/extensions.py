"""
Shared extension instances.

SQLAlchemy is initialized here and imported by models and services.
This avoids circular imports between app.py and model files.
"""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()