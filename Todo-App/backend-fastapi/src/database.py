from sqlmodel import create_engine, Session, SQLModel
from contextlib import contextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment variables - default to SQLite
# Use absolute path for SQLite to ensure consistency across environments
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
default_db = f"sqlite:///{os.path.join(BASE_DIR, 'todo_app.db')}"
DATABASE_URL = os.getenv("DATABASE_URL", default_db)

print(f"[DATABASE] Using database at: {DATABASE_URL}")

# Create engine - use SQLite settings
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    echo=False  # Set to False to reduce log noise, keep True for SQL debugging
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