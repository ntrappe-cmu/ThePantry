"""
User Service

Handles user registration and lookup. Currently, no
authentication, so users are identified by name/email only.
"""
from extensions import db
from models.user import User

class UserService:
    
    @staticmethod
    def create_user(email: str, name: str) -> User:
        """
        Register a new user.

        Raises IntegrityError if a user with the given email already exists
        (enforced by the unique constraint on User.email). Prefer
        get_or_create_user for safe upsert behavior.

        Args:
            email: Unique email address for the new user.
            name: Display name for the new user.

        Returns:
            The newly created User.
        """
        user = User(email=email, name=name)
        db.session.add(user)
        db.session.commit()
        return user
    
    @staticmethod
    def get_user_by_id(user_id: int) -> User | None:
        """
        Look up a user by primary key.

        Args:
            user_id: Primary key of the user.

        Returns:
            The User if found, or None.
        """
        return db.session.get(User, user_id)

    @staticmethod
    def get_user_by_email(email: str) -> User | None:
        """
        Look up a user by email address.

        Args:
            email: Email address to search for.

        Returns:
            The User if found, or None.
        """
        return User.query.filter_by(email=email).first()

    @staticmethod
    def get_or_create_user(email: str, name: str) -> tuple[User, bool]:
        """
        Look up a user by email; create if not found.

        Args:
            email: Email address to search for or register with.
            name: Display name (used only if creating a new user).

        Returns:
            Tuple of (user, created) where created is True if newly registered.
        """
        user = User.query.filter_by(email=email).first()
        if user:
            return user, False
        user = User(email=email, name=name)
        db.session.add(user)
        db.session.commit()
        return user, True