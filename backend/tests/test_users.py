"""Tests for user registration and lookup endpoints."""


class TestUserEndpoints:

    def test_create_user(self, client):
        """POST /api/v1/users with new email returns 201 and created=True."""
        resp = client.post("/api/v1/users", json={
            "email": "alice@example.com",
            "name": "Alice",
        })
        assert resp.status_code == 201
        data = resp.get_json()
        assert data["created"] is True
        assert data["user"]["email"] == "alice@example.com"

    def test_get_existing_user(self, client):
        """POST /api/v1/users with existing email returns 200 and created=False."""
        client.post("/api/v1/users", json={"email": "bob@example.com", "name": "Bob"})
        resp = client.post("/api/v1/users", json={"email": "bob@example.com", "name": "Bob"})
        assert resp.status_code == 200
        assert resp.get_json()["created"] is False

    def test_create_user_missing_fields(self, client):
        """POST /api/v1/users without required fields returns 400."""
        resp = client.post("/api/v1/users", json={"email": "test@example.com"})
        assert resp.status_code == 400

    def test_lookup_user_by_email(self, client):
        """GET /api/v1/users/lookup?email=... finds an existing user."""
        client.post("/api/v1/users", json={"email": "carol@example.com", "name": "Carol"})
        resp = client.get("/api/v1/users/lookup?email=carol@example.com")
        assert resp.status_code == 200
        assert resp.get_json()["name"] == "Carol"

    def test_lookup_nonexistent_user(self, client):
        """GET /api/v1/users/lookup for unknown email returns 404."""
        resp = client.get("/api/v1/users/lookup?email=nobody@example.com")
        assert resp.status_code == 404

    def test_lookup_missing_email_param(self, client):
        """GET /api/v1/users/lookup without email param returns 400."""
        resp = client.get("/api/v1/users/lookup")
        assert resp.status_code == 400