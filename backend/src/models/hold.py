"""
Hold Model

Represents a temporary reservation on a donation. 
Status can be: active, completed, expired, or cancelled.
2-hour reservation timeout.
"""
from datetime import datetime, timezone, timedelta

from extensions import db

# Hold duration in hours
HOLD_DURATION_HOURS = 2

class Hold(db.Model):
    """
    SQLAlchemy model representing a temporary hold on a donation item.

    A Hold is created when a recipient reserves a donation item, giving them a
    2-hour window to complete pickup before the reservation expires.
    Holds prevent double-booking by locking a donation item to a single user for
    the duration of the hold.

    Attributes:
        id (int): Primary key, auto-incremented.
        user_id (int): Foreign key referencing the User who placed the hold.
        donation_id (str): Identifier of the donation being held.
        status (str): Current state of the hold. One of:
            - "active"    – Hold is in effect; item is reserved.
            - "completed" – Pickup was completed successfully.
            - "expired"   – Hold window elapsed without pickup.
            - "cancelled" – Hold was manually cancelled.
        created_at (datetime): UTC timestamp of when the hold was created.
        expires_at (datetime): UTC timestamp of when the hold expires
            (``created_at`` + 2 hours by default).
        user (User): Relationship back to the owning User.
    """
    __tablename__ = "holds"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    donation_id = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable = False, default="active")  # active, completed, expired, cancelled
    created_at = db.Column(db.DateTime, nullable = False, default=lambda: datetime.now(timezone.utc))
    expires_at = db.Column(db.DateTime, nullable=False)
    
    # Relationships
    user = db.relationship("User", back_populates="holds")
    
    def __init__(self, **kwargs):
        """Initialize a Hold, auto-setting created_at and expires_at if not provided.

        Args:
            **kwargs: Column values. If expires_at is omitted, it defaults
                      to created_at + HOLD_DURATION_HOURS.
        """
        super().__init__(**kwargs)
        if not self.expires_at:
            now = datetime.now(timezone.utc)
            self.created_at = now
            self.expires_at = now + timedelta(hours=HOLD_DURATION_HOURS)
            
    @property
    def is_active(self):
        """
        Check if hold is still active (not expired, cancelled, or completed).
            
        Returns:
            True if status is "active" and current time is before expires_at.
        """
        if self.status != "active":
            return False
        return datetime.now(timezone.utc) < self.expires_at.replace(tzinfo=timezone.utc)
    
    def to_dict(self):
        """
        Serialize hold to a JSON-compatible dictionary.

        Returns:
            out: Dict with keys: id, userId, donationId, status, createdAt, expiresAt.
        """
        return {
            "id": self.id,
            "userId": self.user_id,
            "donationId": self.donation_id,
            "status": self.status,
            "createdAt": self.created_at.isoformat(),
            "expiresAt": self.expires_at.isoformat(),
        }