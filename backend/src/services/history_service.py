"""
History Service

Stores and retrieves chronological record of a user's completed
donation pickups.
"""
from extensions import db
from models.pickup_history import PickupHistory


class HistoryService:

    @staticmethod
    def record_pickup(
        user_id: int,
        donation_id: str,
        donation_description: str | None = None,
        donor_contact: str | None = None,
        pickup_location: str | None = None,
    ) -> PickupHistory:
        """
        Record a completed pickup in the user's history.

        Called by ReservationService after a hold is confirmed as picked up.

        Args:
            user_id: ID of the user who completed the pickup.
            donation_id: ID of the donation that was picked up.
            donation_description: Human-readable description of the food item.
            donor_contact: Contact info for the donor (phone, email, etc.).
            pickup_location: Address or location where pickup occurred.

        Returns:
            The newly created PickupHistory record.
        """
        record = PickupHistory(
            user_id=user_id,
            donation_id=donation_id,
            donation_description=donation_description,
            donor_contact=donor_contact,
            pickup_location=pickup_location,
        )
        db.session.add(record)
        db.session.commit()
        return record

    @staticmethod
    def get_history_for_user(user_id: int) -> list[PickupHistory]:
        """
        Retrieve all completed pickups for a user, newest first.

        Args:
            user_id: ID of the user.

        Returns:
            List of PickupHistory records ordered by completed_at descending.
        """
        return (
            PickupHistory.query
            .filter_by(user_id=user_id)
            .order_by(PickupHistory.completed_at.desc())
            .all()
        )