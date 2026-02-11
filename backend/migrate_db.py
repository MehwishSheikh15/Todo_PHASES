import sys
import os

# Add the current directory to sys.path so we can import src
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import sqlite3
from src.database import DATABASE_URL, engine
from sqlmodel import SQLModel

if DATABASE_URL.startswith("sqlite:///"):
    sqlite_file_name = DATABASE_URL.replace("sqlite:///", "")
else:
    sqlite_file_name = "todo_app.db" # Fallback

def migrate():
    print(f"Migrating database: {sqlite_file_name}")
    
    # 1. Add columns to 'users' table
    try:
        with sqlite3.connect(sqlite_file_name) as conn:
            cursor = conn.cursor()
            
            # Check if columns exist
            cursor.execute("PRAGMA table_info(users)")
            columns = [info[1] for info in cursor.fetchall()]
            
            if "bio" not in columns:
                print("Adding 'bio' column to users table...")
                cursor.execute("ALTER TABLE users ADD COLUMN bio TEXT")
                
            if "location" not in columns:
                print("Adding 'location' column to users table...")
                cursor.execute("ALTER TABLE users ADD COLUMN location TEXT")
                
            conn.commit()
            print("Users table schema updated.")
            
    except Exception as e:
        print(f"Error updating users table: {e}")

    # 2. Create new tables (ChatMessage, ActivityLog)
    # SQLModel.metadata.create_all check for existence and creates content
    print("Creating new tables if they don't exist...")
    # Import models so they are registered in metadata
    from src.models import user, task, chat, activity
    SQLModel.metadata.create_all(engine)
    print("New tables created.")

if __name__ == "__main__":
    migrate()
