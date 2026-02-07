from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import List, Optional
from src.database import get_session
from src.models.task import TaskRead, TaskStatus, TaskPriority, TaskCreate, TaskUpdate
from src.models.user import User
from src.services.task_service import TaskService
from src.utils.auth import get_current_user
import uuid

router = APIRouter()

@router.get("/tasks", response_model=List[TaskRead])
def get_tasks_frontend(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    status_filter: Optional[TaskStatus] = Query(None, alias="status"),
    priority_filter: Optional[TaskPriority] = Query(None, alias="priority"),
    category_filter: Optional[str] = Query(None, alias="category"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100)
):
    """Get all tasks for the authenticated user with optional filters."""
    tasks = TaskService.get_tasks_by_user(
        session=session,
        user_id=current_user.id,
        status_filter=status_filter,
        priority_filter=priority_filter,
        category_filter=category_filter,
        skip=skip,
        limit=limit
    )

    return tasks


@router.post("/tasks", response_model=TaskRead)
def create_task_frontend(
    task_create: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new task for the authenticated user."""
    task = TaskService.create_task(
        session=session,
        user_id=current_user.id,
        task_create=task_create
    )

    return task


@router.get("/tasks/{id}", response_model=TaskRead)
def get_task_frontend(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific task by ID."""
    task = TaskService.get_task_by_id(
        session=session,
        task_id=id,
        user_id=current_user.id
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put("/tasks/{id}", response_model=TaskRead)
def update_task_frontend(
    id: uuid.UUID,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update a specific task."""
    task = TaskService.update_task(
        session=session,
        task_id=id,
        user_id=current_user.id,
        task_update=task_update
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.delete("/tasks/{id}")
def delete_task_frontend(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a specific task."""
    success = TaskService.delete_task(
        session=session,
        task_id=id,
        user_id=current_user.id
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {"message": "Task deleted successfully"}


@router.patch("/tasks/{id}/complete", response_model=TaskRead)
def complete_task_frontend(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Mark a task as completed."""
    task = TaskService.complete_task(
        session=session,
        task_id=id,
        user_id=current_user.id
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task