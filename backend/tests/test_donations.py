"""Tests for donation listing endpoints."""


class TestDonationEndpoints:

    def test_list_donations(self, client):
        """GET /api/v1/donations returns a non-empty list of mock donations."""
        resp = client.get("/api/v1/donations")
        assert resp.status_code == 200
        data = resp.get_json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_donations_have_required_fields(self, client):
        """Each donation object contains all fields needed by the frontend."""
        resp = client.get("/api/v1/donations")
        donation = resp.get_json()[0]
        required = ["id", "description", "donationType", "donorName", "donorContact", "address"]
        for field in required:
            assert field in donation, f"Missing field: {field}"

    def test_held_donations_excluded_by_default(self, client):
        """Default listing omits donations with an active hold."""
        user_resp = client.post("/api/v1/users", json={"email": "a@test.com", "name": "A"})
        user_id = user_resp.get_json()["user"]["id"]

        donations = client.get("/api/v1/donations").get_json()
        donation_id = donations[0]["id"]
        original_count = len(donations)

        client.post("/api/v1/holds", json={"userId": user_id, "donationId": donation_id})

        resp = client.get("/api/v1/donations")
        assert len(resp.get_json()) == original_count - 1

    def test_show_all_includes_held_with_flag(self, client):
        """showAll=true includes held donations with isHeld=True."""
        user_resp = client.post("/api/v1/users", json={"email": "b@test.com", "name": "B"})
        user_id = user_resp.get_json()["user"]["id"]

        donations = client.get("/api/v1/donations").get_json()
        donation_id = donations[0]["id"]

        client.post("/api/v1/holds", json={"userId": user_id, "donationId": donation_id})

        resp = client.get("/api/v1/donations?showAll=true")
        data = resp.get_json()
        held = [d for d in data if d["id"] == donation_id]
        assert len(held) == 1
        assert held[0]["isHeld"] is True

    def test_show_all_marks_available_as_not_held(self, client):
        """showAll=true marks unclaimed donations with isHeld=False."""
        resp = client.get("/api/v1/donations?showAll=true")
        data = resp.get_json()
        # With no holds placed, every donation should be available
        for d in data:
            assert d["isHeld"] is False

    def test_donation_unavailable_after_pickup(self, client):
        """A picked-up donation does not reappear in the available list."""
        user_resp = client.post("/api/v1/users", json={"email": "c@test.com", "name": "C"})
        user_id = user_resp.get_json()["user"]["id"]

        donations = client.get("/api/v1/donations").get_json()
        donation_id = donations[0]["id"]
        original_count = len(donations)

        # Hold then confirm pickup
        hold_resp = client.post("/api/v1/holds", json={"userId": user_id, "donationId": donation_id})
        hold_id = hold_resp.get_json()["hold"]["id"]
        client.post(f"/api/v1/holds/{hold_id}/pickup")

        # Should still be missing from available list (food is gone)
        resp = client.get("/api/v1/donations")
        assert len(resp.get_json()) == original_count - 1
        returned_ids = [d["id"] for d in resp.get_json()]
        assert donation_id not in returned_ids