"""
User Model

Represents a registered donation recipient who can browse donations,
place holds, and track pickup history. 
"""
from datetime import datetime, timezone

from extensions import db

class User(db.Model):    
    """
    SQLAlchemy model representing a registered donation recipient.

    A User is the central actor in the system - they browse
    available donations, place Holds to reserve items, and accumulate
    PickupHistory records as they complete pickups. Each User is uniquely
    identified by their email address.

    Attributes:
        id (int): Primary key, auto-incremented.
        email (str): Unique email address used to identify the user.
        name (str): Display name of the user.
        created_at (datetime): UTC timestamp of when the account was created.
        holds (DynamicMapped[Hold]): Lazy dynamic relationship to all Holds
            placed by this user, including active, expired, and cancelled.
        pickups (DynamicMapped[PickupHistory]): Lazy dynamic relationship to
            all completed pickup records associated with this user.
    """
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    email = db.Column(db.String(255), unique = True, nullable = False)
    name = db.Column(db.String(255), nullable = False)
    created_at = db.Column(db.DateTime, nullable = False, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    holds = db.relationship("Hold", back_populates="user", lazy="dynamic")
    pickups = db.relationship("PickupHistory", back_populates="user", lazy="dynamic")
    
    def to_dict(self) -> dict:
        """
        Serialize user to a JSON-compatible dictionary.

        Returns:
            out: Dict with keys: id, email, name, createdAt
        """
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "createdAt": self.created_at.isoformat(),
        }