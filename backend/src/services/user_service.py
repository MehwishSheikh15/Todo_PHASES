from sqlmodel import Session, select
from typing import Optional
from src.models.user import User, UserCreate, UserUpdate
from src.utils.password import hash_password, verify_password
from fastapi import HTTPException, status
import uuid

class UserService:
    @staticmethod
    def create_user(session: Session, user_create: UserCreate) -> User:
        """Create a new user."""
        # Check if user already exists
        existing_user = session.exec(
            select(User).where(User.email == user_create.email)
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        # Hash the password
        password_hash = hash_password(user_create.password)

        # Create new user
        db_user = User(
            email=user_create.email,
            display_name=user_create.display_name,
            password_hash=password_hash
        )

        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        return db_user

    @staticmethod
    def get_user_by_id(session: Session, user_id: uuid.UUID) -> Optional[User]:
        """Get a user by ID."""
        return session.get(User, user_id)

    @staticmethod
    def get_user_by_email(session: Session, email: str) -> Optional[User]:
        """Get a user by email."""
        return session.exec(select(User).where(User.email == email)).first()

    @staticmethod
    def update_user(session: Session, user_id: uuid.UUID, user_update: UserUpdate) -> Optional[User]:
        """Update a user."""
        db_user = session.get(User, user_id)

        if not db_user:
            return None

        # Update fields if they are provided
        if user_update.email is not None:
            db_user.email = user_update.email
        if user_update.display_name is not None:
            db_user.display_name = user_update.display_name
        if user_update.password is not None:
            db_user.password_hash = hash_password(user_update.password)
        if user_update.is_active is not None:
            db_user.is_active = user_update.is_active

        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        return db_user

    @staticmethod
    def delete_user(session: Session, user_id: uuid.UUID) -> bool:
        """Delete a user."""
        db_user = session.get(User, user_id)

        if not db_user:
            return False

        session.delete(db_user)
        session.commit()

        return True

    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
        """Authenticate a user."""
        user = UserService.get_user_by_email(session, email)

        if not user or not verify_password(password, user.password_hash):
            return None

        return user