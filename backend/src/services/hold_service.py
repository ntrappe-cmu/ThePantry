"""
Hold Service

Creates, checks, and releases temporary holds on donations.
Enforces the 2-hour reservation timeout. Responsible for ensuring
no double-booking (each donation claimed by at most one recipient).
"""

from datetime import datetime, timezone

from extensions import db
from models.hold import Hold, HoldStatus


class HoldService:

    @staticmethod
    def create_hold(user_id: int, donation_id: str) -> Hold | None:
        """
        Create a new hold on a donation for a user.

        Checks all existing "active" holds for this donation. If any are
        genuinely active (not time-expired), the request is rejected.
        Stale holds are lazily marked as expired.

        Args:
            user_id: ID of the user placing the hold.
            donation_id: ID of the donation to reserve.

        Returns:
            The new Hold on success, or None if the donation is already held.
        """
        existing = Hold.query.filter_by(
            donation_id=donation_id, status=HoldStatus.ACTIVE
        ).all()
        changed = False

        for h in existing:
            if h.is_active:
                return None  # Donation already claimed
            else:
                h.status = HoldStatus.EXPIRED
                changed = True

        if changed:
            db.session.commit()

        hold = Hold(user_id=user_id, donation_id=donation_id)
        db.session.add(hold)
        db.session.commit()
        return hold

    @staticmethod
    def get_hold_by_id(hold_id: int) -> Hold | None:
        """
        Retrieve a single hold by ID.

        Args:
            hold_id: Primary key of the hold.

        Returns:
            The Hold if found, or None.
        """
        return db.session.get(Hold, hold_id)

    @staticmethod
    def get_active_holds_for_user(user_id: int) -> list[Hold]:
        """
        Get all active (non-expired, non-cancelled) holds for a user.

        Lazily expires any stale holds encountered.

        Args:
            user_id: ID of the user.

        Returns:
            List of genuinely active Hold objects.
        """
        holds = Hold.query.filter_by(
            user_id=user_id, status=HoldStatus.ACTIVE
        ).all()
        active = []
        changed = False

        for h in holds:
            if h.is_active:
                active.append(h)
            else:
                h.status = HoldStatus.EXPIRED
                changed = True

        if changed:
            db.session.commit()
        return active

    @staticmethod
    def get_all_holds_for_user(user_id: int) -> list[Hold]:
        """
        Get all holds (any status) for a user, newest first.

        Args:
            user_id: ID of the user.

        Returns:
            List of Hold objects ordered by created_at descending.
        """
        return Hold.query.filter_by(user_id=user_id).order_by(
            Hold.created_at.desc()
        ).all()

    @staticmethod
    def cancel_hold(hold_id: int) -> Hold | None:
        """
        Cancel an active hold, returning the donation to the available pool.

        Args:
            hold_id: Primary key of the hold to cancel.

        Returns:
            The updated Hold on success, or None if not found/not active.
        """
        hold = db.session.get(Hold, hold_id)
        if not hold or not hold.is_active:
            return None

        hold.status = HoldStatus.CANCELLED
        hold.cancelled_at = datetime.now(timezone.utc)
        db.session.commit()
        return hold

    @staticmethod
    def complete_hold(hold_id: int) -> Hold | None:
        """
        Mark a hold as completed (pickup confirmed).

        Args:
            hold_id: Primary key of the hold to complete.

        Returns:
            The updated Hold on success, or None if not found/not active.
        """
        hold = db.session.get(Hold, hold_id)
        if not hold or not hold.is_active:
            return None

        hold.status = HoldStatus.COMPLETED
        hold.completed_at = datetime.now(timezone.utc)
        db.session.commit()
        return hold

    @staticmethod
    def get_held_donation_ids() -> set[str]:
        """
        Return donation IDs that are currently unavailable.

        Includes actively held donations and completed pickups.
        Lazily expires any stale holds encountered.

        Returns:
            Set of donation ID strings that should not be available.
        """
        holds = Hold.query.filter(
            Hold.status.in_([HoldStatus.ACTIVE, HoldStatus.COMPLETED])
        ).all()
        unavailable_ids = set()
        changed = False

        for h in holds:
            if h.status == HoldStatus.COMPLETED:
                unavailable_ids.add(h.donation_id)
            elif h.is_active:
                unavailable_ids.add(h.donation_id)
            else:
                h.status = HoldStatus.EXPIRED
                changed = True

        if changed:
            db.session.commit()
        return unavailable_ids