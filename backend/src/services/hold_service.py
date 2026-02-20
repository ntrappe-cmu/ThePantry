"""
Hold Service

Creates, checks, and releases temporary holds on donations.
Enforces the 2-hour reservation timeout. Responsible for ensuring
no double-booking (each donation claimed by at most one recipient).
"""
from datetime import datetime, timezone

from extensions import db
from models.hold import Hold


class HoldService:

    @staticmethod
    def create_hold(user_id: int, donation_id: str) -> Hold | None:
        """
        Create a new hold on a donation for a user.

        Returns the new Hold, or None if the donation is already held
        by an active reservation.
        """
        existing = Hold.query.filter_by(donation_id=donation_id, status="active").filter(
            Hold.expires_at > datetime.now(timezone.utc)
        ).first()

        if existing:
            return None  # Donation already claimed

        hold = Hold(user_id=user_id, donation_id=donation_id)
        db.session.add(hold)
        db.session.commit()
        return hold

    @staticmethod
    def get_hold_by_id(hold_id: int) -> Hold | None:
        """Retrieve a single hold by ID."""
        return db.session.get(Hold, hold_id)

    @staticmethod
    def get_active_holds_for_user(user_id: int) -> list[Hold]:
        """Get all active (non-expired, non-cancelled) holds for a user."""
        return Hold.query.filter_by(user_id=user_id, status="active").filter(
            Hold.expires_at > datetime.now(timezone.utc)
        ).all()

    @staticmethod
    def get_all_holds_for_user(user_id: int) -> list[Hold]:
        """Get all holds (any status) for a user."""
        return Hold.query.filter_by(user_id=user_id).order_by(Hold.created_at.desc()).all()

    @staticmethod
    def cancel_hold(hold_id: int) -> Hold | None:
        """
        Cancel an active hold, returning the donation to the available pool.

        Returns the updated Hold, or None if hold not found or not active.
        """
        hold = db.session.get(Hold, hold_id)
        if not hold or hold.status != "active":
            return None
        if hold.expires_at <= datetime.now(timezone.utc):
            return None

        hold.status = "cancelled"
        db.session.commit()
        return hold

    @staticmethod
    def complete_hold(hold_id: int) -> Hold | None:
        """
        Mark a hold as completed (pickup confirmed).

        Returns the updated Hold, or None if hold not found or not active.
        """
        hold = db.session.get(Hold, hold_id)
        if not hold or hold.status != "active":
            return None
        if hold.expires_at <= datetime.now(timezone.utc):
            return None

        hold.status = "completed"
        db.session.commit()
        return hold

    @staticmethod
    def get_held_donation_ids() -> set[str]:
        """
        Return donation IDs that are unavailable (actively held OR already picked up).
        Completed pickups remain unavailable since the food is gone.
        """
        now = datetime.now(timezone.utc)

        # Completed holds — food is gone permanently
        completed = Hold.query.filter_by(status="completed").all()

        # Active holds that haven't expired yet
        active = Hold.query.filter_by(status="active").filter(
            Hold.expires_at > now
        ).all()

        unavailable_ids = set()
        for h in completed:
            unavailable_ids.add(h.donation_id)
        for h in active:
            unavailable_ids.add(h.donation_id)

        return unavailable_ids