from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers - using sys.path to ensure proper import
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from src.api.auth import router as auth_router
from src.api.tasks import router as tasks_router
from src.api.chat import router as chat_router
from src.api.frontend_routes import router as frontend_routes_router
from src.api.activity import router as activity_router
from src.api.users import router as users_router
from src.database import create_db_and_tables

app = FastAPI(title="Todo API", version="1.0.0")
print("BACKEND RELOADED - ROUTE ORDER FIXED")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"VALIDATION ERROR: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.get("/")
async def root():
    return {
        "message": "Todo API is running",
        "status": "healthy",
        "endpoints": {
            "auth": "/api/auth",
            "tasks": "/api/frontend/tasks",
            "health": "/health"
        }
    }

@app.on_event("startup")
def on_startup():
    """Create database tables on startup."""
    create_db_and_tables()
    
    # Diagnostic: Print user count
    from src.database import get_session
    from src.models.user import User
    from src.models.task import Task
    from sqlmodel import select, func
    
    session = next(get_session())
    user_count = session.exec(select(func.count(User.id))).one()
    task_count = session.exec(select(func.count(Task.id))).one()
    print(f"[STARTUP] Total users in database: {user_count}")
    print(f"[STARTUP] Total tasks in database: {task_count}")
    session.close()

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(frontend_routes_router, prefix="/api/frontend", tags=["frontend-tasks"])  # New frontend-compatible API: must be before generic tasks router
app.include_router(tasks_router, prefix="/api", tags=["tasks"])  # Original API with user_id in path
app.include_router(activity_router, prefix="/api", tags=["activity"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(chat_router, prefix="/api", tags=["chat"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2026-01-19T22:59:00Z", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))