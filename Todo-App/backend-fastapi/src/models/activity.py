from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from typing import Optional

class ActivityLog(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    action: str  # e.g., "CREATE_TASK", "DELETE_TASK", "COMPLETE_TASK"
    entity_type: str = "TASK"
    entity_id: Optional[UUID] = None
    entity_title: Optional[str] = None
    details: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
