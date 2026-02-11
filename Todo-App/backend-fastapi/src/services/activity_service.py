from sqlmodel import Session
from uuid import UUID
from src.models.activity import ActivityLog

class ActivityService:
    @staticmethod
    def log_activity(
        session: Session,
        user_id: UUID,
        action: str,
        entity_title: str = None,
        entity_id: UUID = None,
        details: str = None
    ) -> ActivityLog:
        activity = ActivityLog(
            user_id=user_id,
            action=action,
            entity_id=entity_id,
            entity_title=entity_title,
            details=details
        )
        session.add(activity)
        session.commit()
        session.refresh(activity)
        return activity
