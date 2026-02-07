"""
Password Reset Utility for Deployed Database

This script helps reset user passwords in the deployed environment.
Run this on Hugging Face Spaces to create/update users with known passwords.
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from src.database import get_session, create_db_and_tables
from src.models.user import User, UserCreate
from src.services.user_service import UserService
from src.utils.password import hash_password
from sqlmodel import Session, select

def reset_user_password(email: str, new_password: str):
    """Reset a user's password."""
    # Create tables if they don't exist
    create_db_and_tables()
    
    # Get a session
    session_gen = get_session()
    session = next(session_gen)
    
    try:
        # Find user
        user = session.exec(select(User).where(User.email == email)).first()
        
        if not user:
            print(f"❌ User {email} not found. Creating new user...")
            # Create new user
            user_create = UserCreate(
                email=email,
                password=new_password,
                display_name=email.split('@')[0].title()
            )
            user = UserService.create_user(session, user_create)
            print(f"✅ Created user: {email}")
        else:
            # Update password
            user.password_hash = hash_password(new_password)
            session.add(user)
            session.commit()
            session.refresh(user)
            print(f"✅ Password updated for: {email}")
        
        print(f"   Email: {email}")
        print(f"   Password: {new_password}")
        print(f"   User ID: {user.id}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Password Reset Utility")
    print("=" * 60)
    
    # Reset passwords for common test users
    test_users = [
        ("john@gmail.com", "password123"),
        ("maaz@gmail.com", "password123"),
        ("test@example.com", "password123"),
        ("hira@gmail.com", "password123"),
    ]
    
    for email, password in test_users:
        reset_user_password(email, password)
        print()
    
    print("=" * 60)
    print("✅ Password reset complete!")
    print("You can now login with any of the above credentials.")
    print("=" * 60)
