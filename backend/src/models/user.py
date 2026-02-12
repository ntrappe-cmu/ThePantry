"""
User Model

Represents a registered food recipient who can browse donations,
place holds, and track pickup history. 
"""
from datetime import datetime, timezone

from extensions import db

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    email = db.Column(db.String(255), unique = True, nullable = False)
    name = db.Column(db.String(255), nullable = False)
    created_at = db.Column(db.DateTime, nullable = False, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    holds = db.relationship("Hold", back_populates="user", lazy="dynamic")
    pickups = db.relationship("PickupHistory", back_populates="user", lazy="dynamic")
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "createdAt": self.created_at.isoformat(),
        }