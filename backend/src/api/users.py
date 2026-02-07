from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Any
from src.database import get_session
from src.models.user import User, UserRead, UserUpdate
from src.utils.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=UserRead)
async def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update current user profile.
    """
    user_data = user_update.dict(exclude_unset=True)
    
    # Handle password update separately if needed, but for now assuming just profile fields
    # If password is in there, it should be hashed. omitting password logic for now to keep it simple as profile page doesn't send password usually
    if "password" in user_data:
        # TODO: Hash password if provided
        del user_data["password"] 
        
    for key, value in user_data.items():
        setattr(current_user, key, value)
        
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user
