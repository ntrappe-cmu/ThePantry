import pytest
from app import app
# NOTE: Run tests from the backend directory (cd backend && pytest)

@pytest.fixture
def client():
    # Use app.test_client() to create a test client instance
    with app.test_client() as client:
        yield client

def test_get_data(client):
    """Test the /api/data endpoint."""
    response = client.get('/api/message')
    assert response.status_code == 200
    assert response.json == {"message": "Hello from Flask API!"}