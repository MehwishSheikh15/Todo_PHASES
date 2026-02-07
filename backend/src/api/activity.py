from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List, Any, Dict
from src.database import get_session
from src.models.user import User
from src.utils.auth import get_current_user
from src.models.activity import ActivityLog

router = APIRouter()

@router.get("/activity", response_model=List[Dict[str, Any]])
async def get_activity_log(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    limit: int = 50
):
    """Get activity log for the current user."""
    query = select(ActivityLog).where(ActivityLog.user_id == current_user.id).order_by(ActivityLog.timestamp.desc())#.limit(limit)
    activities = session.exec(query).all()
    
    return [
        {
            "id": str(act.id),
            "action": act.action,
            "entity_type": act.entity_type,
            "entity_title": act.entity_title,
            "details": act.details,
            "timestamp": act.timestamp,
        }
        for act in activities
    ]
