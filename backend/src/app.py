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

from config import Config
from extensions import db
from routes import donation_bp, user_bp, history_bp, hold_bp
from services import MockInventoryService
from services import ReservationService

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
    
    # Register route blueprints
    app.register_blueprint(donation_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(hold_bp)
    
    # Health check endpoint
    @app.route('/api/v1/health', methods=['GET'])
    def health():
        return {"status": "ok"}
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)