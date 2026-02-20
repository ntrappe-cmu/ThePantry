"""
Application Factory for ThePantry API

- Creates the Flask app
- Initializes extensions
- Registers blueprints
- Wires up service dependencies
"""
from typing import Type

from flask import Flask
from flask_cors import CORS

from config import Config, TestConfig
from extensions import db
from services.inventory_service import MockInventoryService
from services.reservation_service import ReservationService

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
    
    # Wire up service dependencies
    inventory_service = MockInventoryService()
    reservation_service = ReservationService(inventory_service)
    app.config["RESERVATION_SERVICE"] = reservation_service
    
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