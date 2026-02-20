"""
Shared test fixtures and helpers.

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


# ── Shared helpers ──────────────────────────────────────────────

def create_test_user(client, email="test@example.com", name="Test"):
    """Create a user via the API and return their ID."""
    resp = client.post("/api/v1/users", json={"email": email, "name": name})
    return resp.get_json()["user"]["id"]


def get_first_donation_id(client):
    """Return the ID of the first donation in the mock inventory."""
    resp = client.get("/api/v1/donations")
    return resp.get_json()[0]["id"]


def create_test_hold(client, user_id=None, donation_id=None, email="hold@test.com"):
    """Create a user (if needed), hold a donation, return (user_id, donation_id, hold_id)."""
    if user_id is None:
        user_id = create_test_user(client, email)
    if donation_id is None:
        donation_id = get_first_donation_id(client)

    resp = client.post("/api/v1/holds", json={
        "userId": user_id, "donationId": donation_id
    })
    hold_id = resp.get_json()["hold"]["id"]
    return user_id, donation_id, hold_id


def setup_completed_pickup(client, email="pickup@test.com", name="Pickup"):
    """Create user, hold donation, confirm pickup. Returns (user_id, donation_id)."""
    user_id = create_test_user(client, email, name)
    donation_id = get_first_donation_id(client)

    hold_resp = client.post("/api/v1/holds", json={
        "userId": user_id, "donationId": donation_id
    })
    hold_id = hold_resp.get_json()["hold"]["id"]
    client.post(f"/api/v1/holds/{hold_id}/pickup")
    return user_id, donation_id