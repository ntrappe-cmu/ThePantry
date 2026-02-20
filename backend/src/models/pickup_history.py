"""
PickupHistory Model

Permanent record of successfully completed donation pickups.
"""
from datetime import datetime, timezone

from extensions import db

class PickupHistory(db.Model):
    """
    SQLAlchemy model representing a completed donation pickup event.

    Created when a Hold transitions to ``"completed"`` status, capturing a
    permanent, immutable audit record of the transaction. Unlike a Hold, a
    PickupHistory record is never modified after creation.

    Attributes:
        id (int): Primary key, auto-incremented.
        user_id (int): Foreign key referencing the User who completed the pickup.
        donation_id (str): Identifier of the donation_id that was picked up.
        donation_description (str, optional): Human-readable description of the donation item.
        donor_contact (str, optional): Contact information for the donor.
        pickup_location (str, optional): Address or description of the pickup location.
        completed_at (datetime): UTC timestamp of when the pickup was completed.
        user (User): Relationship back to the owning User.
    """
    __tablename__ = "pickup_history"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    donation_id = db.Column(db.String(100), nullable=False)
    donation_description = db.Column(db.String(500), nullable=True)
    donor_contact = db.Column(db.String(255), nullable=True)
    pickup_location = db.Column(db.String(500), nullable=True)
    completed_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    user = db.relationship("User", back_populates="pickups")

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "donationId": self.donation_id,
            "donationDescription": self.donation_description,
            "donorContact": self.donor_contact,
            "pickupLocation": self.pickup_location,
            "completedAt": self.completed_at.isoformat(),
        }