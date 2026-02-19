"""
Hold Model

Represents a temporary reservation on a food donation. 
Status can be: active, completed, expired, or cancelled.
2-hour reservation timeout.
"""
from datetime import datetime, timezone, timedelta

from extensions import db

# Hold duration in hours
HOLD_DURATION_HOURS = 2

class Hold(db.Model):
    """
    SQLAlchemy model representing a temporary hold on a food donation item.

    A Hold is created when a recipient reserves a food item, giving them a
    2-hour window to complete pickup before the reservation expires.
    Holds prevent double-booking by locking a food item to a single user for
    the duration of the hold.

    Attributes:
        id (int): Primary key, auto-incremented.
        user_id (int): Foreign key referencing the User who placed the hold.
        food_id (str): Identifier of the food item being held.
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
    food_id = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable = False, default="active")  # active, completed, expired, cancelled
    created_at = db.Column(db.DateTime, nullable = False, default=lambda: datetime.now(timezone.utc))
    expires_at = db.Column(db.DateTime, nullable=False)
    
    # Relationships
    user = db.relationship("User", back_populates="holds")
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.expires_at:
            now = datetime.now(timezone.utc)
            self.created_at = now
            self.expires_at = now + timedelta(hours=HOLD_DURATION_HOURS)
    
    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "foodId": self.food_id,
            "status": self.status,
            "createdAt": self.created_at.isoformat(),
            "expiresAt": self.expires_at.isoformat(),
        }