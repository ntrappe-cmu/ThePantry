"""
Shared test fixtures.

Uses TestConfig (in-memory SQLite) so tests are fast, isolated,
and don't affect the dev database.
"""
import pytest
from app import create_app
from config import TestConfig
from extensions import db as _db


@pytest.fixture(scope="session")
def app():
    """Create the Flask app with test configuration."""
    app = create_app(TestConfig)
    yield app


@pytest.fixture(scope="function")
def db(app):
    """Provide a clean database for each test function."""
    with app.app_context():
        _db.create_all()
        yield _db
        _db.session.rollback()
        _db.drop_all()


@pytest.fixture(scope="function")
def client(app, db):
    """Flask test client with a fresh database."""
    with app.test_client() as client:
        yield client