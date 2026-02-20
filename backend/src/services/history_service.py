"""
History Service

Stores and retrieves chronological record of a user's completed
food pickups.
"""
from extensions import db
from models.pickup_history import PickupHistory


class HistoryService:

    @staticmethod
    def record_pickup(
        user_id: int,
        donation_id: str,
        food_description: str | None = None,
        donor_contact: str | None = None,
        pickup_location: str | None = None,
    ) -> PickupHistory:
        """
        Record a completed pickup in the user's history.
        """
        record = PickupHistory(
            user_id=user_id,
            donation_id=donation_id,
            food_description=food_description,
            donor_contact=donor_contact,
            pickup_location=pickup_location,
        )
        db.session.add(record)
        db.session.commit()
        return record

    @staticmethod
    def get_history_for_user(user_id: int) -> list[PickupHistory]:
        """Retrieve all completed pickups for a user, newest first."""
        return (
            PickupHistory.query
            .filter_by(user_id=user_id)
            .order_by(PickupHistory.completed_at.desc())
            .all()
        )