from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Dict
from datetime import timedelta
from src.database import get_session
from src.models.user import User, UserCreate, UserRead
from src.services.user_service import UserService
from src.utils.auth import create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.security import OAuth2PasswordRequestForm
from src.utils.password import verify_password
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

@router.post("/register", response_model=UserRead)
def register(user_create: UserCreate, session: Session = Depends(get_session)):
    """Register a new user."""
    try:
        db_user = UserService.create_user(session, user_create)

        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(db_user.id), "email": db_user.email},
            expires_delta=access_token_expires
        )

        # Return user info with token
        return db_user
    except HTTPException as e:
        raise e
    except Exception as e:
        if "integrity constraint" in str(e).lower() or "unique constraint" in str(e).lower():
             raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    """Authenticate user and return access token."""
    print(f"[DEBUG] Login attempt for email: {form_data.username}")
    
    user = UserService.authenticate_user(
        session=session,
        email=form_data.username,
        password=form_data.password
    )

    if not user:
        print(f"[DEBUG] Authentication failed for {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    print(f"[DEBUG] Authentication successful for {form_data.username}")
    
    # Update last login time
    user.last_login_at = user.updated_at
    session.add(user)
    session.commit()

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "display_name": user.display_name
        }
    }


@router.post("/logout")
def logout():
    """Logout user (client-side token invalidation)."""
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user