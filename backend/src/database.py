from sqlmodel import create_engine, Session, SQLModel
from contextlib import contextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment variables - default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create engine - use SQLite settings
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    echo=True  # Enable SQL logging for debugging
)

def get_session():
    """Get a database session."""
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """Create database tables."""
    # Import models here to avoid circular imports
    from src.models.user import User
    from src.models.task import Task
    from src.models.chat import ChatMessage
    from src.models.activity import ActivityLog

    # Create all tables
    SQLModel.metadata.create_all(engine)