"""Tests for pickup history endpoints."""
from conftest import create_test_user, setup_completed_pickup


class TestHistoryEndpoints:

    def test_empty_history(self, client):
        """New user with no pickups has an empty history list."""
        user_id = create_test_user(client)

        resp = client.get(f"/api/v1/history?userId={user_id}")
        assert resp.status_code == 200
        assert resp.get_json() == []

    def test_history_after_pickup(self, client):
        """Completed pickup appears in history with donation details."""
        user_id = setup_completed_pickup(client)

        resp = client.get(f"/api/v1/history?userId={user_id}")
        assert resp.status_code == 200
        records = resp.get_json()
        assert len(records) == 1
        assert "donationDescription" in records[0]
        assert "donorContact" in records[0]
        assert "completedAt" in records[0]

    def test_history_requires_user_id(self, client):
        """GET /api/v1/history without userId returns 400."""
        resp = client.get("/api/v1/history")
        assert resp.status_code == 400

    def test_history_is_newest_first(self, client):
        """Multiple pickups are returned in reverse chronological order."""
        user_id = create_test_user(client)

        # Complete two pickups on different donations
        donations = client.get("/api/v1/donations").get_json()
        for d in donations[:2]:
            hold_resp = client.post("/api/v1/holds", json={
                "userId": user_id, "donationId": d["id"]
            })
            hold_id = hold_resp.get_json()["hold"]["id"]
            client.post(f"/api/v1/holds/{hold_id}/pickup")

        resp = client.get(f"/api/v1/history?userId={user_id}")
        records = resp.get_json()
        assert len(records) == 2
        # Most recent first
        assert records[0]["completedAt"] >= records[1]["completedAt"]