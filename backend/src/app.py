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
from sqlalchemy import inspect, text

from config import Config
from extensions import db
from routes import donation_bp, user_bp, history_bp, hold_bp
from services import MockInventoryService
from services import ReservationService


def _ensure_hold_columns_for_sqlite() -> None:
    """Backfill newly added Hold columns for existing SQLite databases."""
    engine = db.engine
    if engine.dialect.name != "sqlite":
        return

    inspector = inspect(engine)
    table_names = inspector.get_table_names()
    if "holds" not in table_names:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("holds")}
    statements = []

    if "completed_at" not in existing_columns:
        statements.append("ALTER TABLE holds ADD COLUMN completed_at DATETIME")
    if "cancelled_at" not in existing_columns:
        statements.append("ALTER TABLE holds ADD COLUMN cancelled_at DATETIME")

    for statement in statements:
        db.session.execute(text(statement))

    if statements:
        db.session.commit()

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
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}},
    )
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
        _ensure_hold_columns_for_sqlite()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)