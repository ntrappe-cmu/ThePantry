"""
Application Factory for ThePantry API

- Creates the Flask app
- Initializes extensions
- Registers blueprints
- Wires up service dependencies
"""
from flask import Flask
from flask_cors import CORS
from config import Config, TestConfig
from extensions import db
from typing import Type

def create_app(config_class: Type[Config] = Config) -> Flask:
    """
    Application factory
    
    Args:
        config_class: Configuration class to use. Defaults to Config (SQLite/MySQL)
                      Pass TestConfig for in-memory SQLite testing.
    Returns:
        Flask application
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health():
        return {"status": "ok"}
    
    # Create database tables
    with app.app_context():
        # Temporary import before relevant service blueprint setup
        from models import User, PickupHistory, Hold
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)