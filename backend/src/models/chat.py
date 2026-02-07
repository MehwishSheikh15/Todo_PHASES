from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from typing import Optional

class ChatMessage(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    sender: str  # "user" or "bot"
    message: str
    action: Optional[str] = None # e.g., "TASK_ADD", "TASK_SEARCH"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
