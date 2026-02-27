"""Tests for hold/reservation endpoints — core business logic."""
from datetime import datetime, timezone, timedelta

from conftest import create_test_user, get_first_donation_id, create_test_hold
from models.hold import Hold, HoldStatus
from extensions import db


def expire_hold(hold_id):
    """Force a hold to be expired by setting expires_at to the past."""
    hold = db.session.get(Hold, hold_id)
    hold.expires_at = datetime.now(timezone.utc) - timedelta(hours=1)
    db.session.commit()


class TestCreateHold:

    def test_create_hold_success(self, client):
        """POST /api/v1/holds reserves a donation and returns hold details."""
        user_id, donation_id, hold_id = create_test_hold(client)

        resp = client.get(f"/api/v1/holds?userId={user_id}")
        hold = resp.get_json()[0]
        assert hold["status"] == "active"
        assert hold["donationId"] == donation_id

    def test_double_booking_prevented(self, client):
        """Claiming an already-held donation returns 409."""
        user0 = create_test_user(client)
        user1 = create_test_user(client, "user1@test.com")
        donation_id = get_first_donation_id(client)

        resp1 = client.post("/api/v1/holds", json={"userId": user0, "donationId": donation_id})
        assert resp1.status_code == 201

        resp2 = client.post("/api/v1/holds", json={"userId": user1, "donationId": donation_id})
        assert resp2.status_code == 409

    def test_hold_nonexistent_donation(self, client):
        """Holding a donation that doesn't exist returns 409 with error."""
        user_id = create_test_user(client)
        resp = client.post("/api/v1/holds", json={"userId": user_id, "donationId": "FAKE"})
        assert resp.status_code == 409
        assert "not found" in resp.get_json()["error"].lower()

    def test_missing_fields_returns_400(self, client):
        """POST /api/v1/holds without required fields returns 400."""
        resp = client.post("/api/v1/holds", json={"userId": 1})
        assert resp.status_code == 400


class TestListHolds:

    def test_list_user_holds(self, client):
        """GET /api/v1/holds?userId=... returns holds for that user."""
        user_id, donation_id, _ = create_test_hold(client)

        resp = client.get(f"/api/v1/holds?userId={user_id}")
        assert resp.status_code == 200
        holds = resp.get_json()
        assert len(holds) >= 1
        assert holds[0]["donationId"] == donation_id

    def test_list_holds_requires_user_id(self, client):
        """GET /api/v1/holds without userId returns 400."""
        resp = client.get("/api/v1/holds")
        assert resp.status_code == 400


class TestCancelHold:

    def test_cancel_active_hold(self, client):
        """DELETE /api/v1/holds/<id> cancels hold and returns donation to pool."""
        _, donation_id, hold_id = create_test_hold(client)

        cancel_resp = client.delete(f"/api/v1/holds/{hold_id}")
        assert cancel_resp.status_code == 200
        assert cancel_resp.get_json()["hold"]["status"] == "cancelled"
        assert cancel_resp.get_json()["hold"]["cancelledAt"] is not None

        # Donation should be available again
        donations = client.get("/api/v1/donations").get_json()
        returned_ids = [d["id"] for d in donations]
        assert donation_id in returned_ids

    def test_cancel_nonexistent_hold(self, client):
        """DELETE /api/v1/holds/9999 returns 404."""
        resp = client.delete("/api/v1/holds/9999")
        assert resp.status_code == 404

    def test_rebook_after_cancel(self, client):
        """After cancelling, another user can claim the same donation."""
        user0 = create_test_user(client)
        user1 = create_test_user(client, "user1@test.com")
        donation_id = get_first_donation_id(client)

        # User1 holds then cancels
        _, _, hold_id = create_test_hold(client, user_id=user0, donation_id=donation_id)
        client.delete(f"/api/v1/holds/{hold_id}")

        # User2 can now claim it
        resp = client.post("/api/v1/holds", json={"userId": user1, "donationId": donation_id})
        assert resp.status_code == 201


class TestConfirmPickup:

    def test_confirm_pickup(self, client):
        """POST /api/v1/holds/<id>/pickup completes hold and records history."""
        user_id, donation_id, hold_id = create_test_hold(client)

        pickup_resp = client.post(f"/api/v1/holds/{hold_id}/pickup")
        assert pickup_resp.status_code == 200
        assert pickup_resp.get_json()["success"] is True

        hold_resp = client.get(f"/api/v1/holds?userId={user_id}")
        completed_hold = next(h for h in hold_resp.get_json() if h["id"] == hold_id)
        assert completed_hold["completedAt"] is not None

        # Should appear in history
        history_resp = client.get(f"/api/v1/history?userId={user_id}")
        records = history_resp.get_json()
        assert len(records) == 1
        assert records[0]["donationId"] == donation_id

    def test_confirm_pickup_nonexistent_hold(self, client):
        """POST /api/v1/holds/9999/pickup returns 404."""
        resp = client.post("/api/v1/holds/9999/pickup")
        assert resp.status_code == 404

    def test_donation_unavailable_after_pickup(self, client):
        """Picked-up donation does not reappear in available list."""
        _, donation_id, hold_id = create_test_hold(client)
        client.post(f"/api/v1/holds/{hold_id}/pickup")

        donations = client.get("/api/v1/donations").get_json()
        returned_ids = [d["id"] for d in donations]
        assert donation_id not in returned_ids

    def test_cannot_confirm_cancelled_hold(self, client):
        """Confirming pickup on a cancelled hold returns 404."""
        _, _, hold_id = create_test_hold(client, email="cancel@test.com")
        client.delete(f"/api/v1/holds/{hold_id}")

        resp = client.post(f"/api/v1/holds/{hold_id}/pickup")
        assert resp.status_code == 404


class TestHoldExpiration:
    """Tests for the 2-hour hold expiration behavior."""

    def test_expired_hold_excluded_from_active_list(self, client):
        """Expired holds do not appear when listing active holds."""
        user_id, _, hold_id = create_test_hold(client)
        expire_hold(hold_id)

        resp = client.get(f"/api/v1/holds?userId={user_id}&active=true")
        assert resp.status_code == 200
        assert resp.get_json() == []

    def test_expired_hold_lazily_marked_in_db(self, client):
        """Querying active holds flips stale holds to expired status."""
        user_id, _, hold_id = create_test_hold(client)
        expire_hold(hold_id)

        # Trigger lazy expiration by querying active holds
        client.get(f"/api/v1/holds?userId={user_id}&active=true")

        # Verify status was persisted
        hold = db.session.get(Hold, hold_id)
        assert hold.status == HoldStatus.EXPIRED

    def test_cannot_cancel_expired_hold(self, client):
        """Cancelling an expired hold returns 404."""
        _, _, hold_id = create_test_hold(client)
        expire_hold(hold_id)

        resp = client.delete(f"/api/v1/holds/{hold_id}")
        assert resp.status_code == 404

    def test_cannot_pickup_expired_hold(self, client):
        """Confirming pickup on an expired hold returns 404."""
        _, _, hold_id = create_test_hold(client)
        expire_hold(hold_id)

        resp = client.post(f"/api/v1/holds/{hold_id}/pickup")
        assert resp.status_code == 404

    def test_expired_hold_no_history_recorded(self, client):
        """Failed pickup on expired hold does not create a history record."""
        user_id, _, hold_id = create_test_hold(client)
        expire_hold(hold_id)

        client.post(f"/api/v1/holds/{hold_id}/pickup")

        resp = client.get(f"/api/v1/history?userId={user_id}")
        assert resp.get_json() == []

    def test_donation_available_after_expiration(self, client):
        """Expired hold releases the donation back to the available pool."""
        _, donation_id, hold_id = create_test_hold(client)
        expire_hold(hold_id)

        donations = client.get("/api/v1/donations").get_json()
        returned_ids = [d["id"] for d in donations]
        assert donation_id in returned_ids

    def test_rebook_after_expiration(self, client):
        """Another user can claim a donation after the previous hold expires."""
        user0 = create_test_user(client)
        user1 = create_test_user(client, "user1@test.com")
        donation_id = get_first_donation_id(client)

        _, _, hold_id = create_test_hold(client, user_id=user0, donation_id=donation_id)
        expire_hold(hold_id)

        resp = client.post("/api/v1/holds", json={"userId": user1, "donationId": donation_id})
        assert resp.status_code == 201