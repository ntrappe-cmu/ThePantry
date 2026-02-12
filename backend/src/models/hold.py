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