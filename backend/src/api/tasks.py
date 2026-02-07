from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import List, Optional
from src.database import get_session
from src.models.task import Task, TaskCreate, TaskUpdate, TaskRead, TaskStatus, TaskPriority
from src.models.user import User
from src.services.task_service import TaskService
from src.utils.auth import get_current_user
import uuid

router = APIRouter()

@router.get("/{user_id}/tasks", response_model=List[TaskRead])
def get_tasks(
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    status_filter: Optional[TaskStatus] = Query(None, alias="status"),
    priority_filter: Optional[TaskPriority] = Query(None, alias="priority"),
    category_filter: Optional[str] = Query(None, alias="category"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100)
):
    """Get all tasks for a specific user with optional filters."""
    # Ensure the user can only access their own tasks
    if str(current_user.id) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this resource"
        )

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


@router.post("/{user_id}/tasks", response_model=TaskRead)
def create_task(
    user_id: uuid.UUID,
    task_create: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new task for the authenticated user."""
    # Ensure the user can only create tasks for themselves
    if str(current_user.id) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this resource"
        )

    task = TaskService.create_task(
        session=session,
        user_id=current_user.id,
        task_create=task_create
    )

    return task


@router.get("/{user_id}/tasks/{id}", response_model=TaskRead)
def get_task(
    user_id: uuid.UUID,
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific task by ID."""
    # Ensure the user can only access their own tasks
    if str(current_user.id) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this resource"
        )

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


@router.put("/{user_id}/tasks/{id}", response_model=TaskRead)
def update_task(
    user_id: uuid.UUID,
    id: uuid.UUID,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update a specific task."""
    # Ensure the user can only update their own tasks
    if str(current_user.id) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this resource"
        )

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


@router.delete("/{user_id}/tasks/{id}")
def delete_task(
    user_id: uuid.UUID,
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a specific task."""
    # Ensure the user can only delete their own tasks
    if str(current_user.id) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this resource"
        )

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


@router.patch("/{user_id}/tasks/{id}/complete", response_model=TaskRead)
def complete_task(
    user_id: uuid.UUID,
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Mark a task as completed."""
    # Ensure the user can only complete their own tasks
    if str(current_user.id) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this resource"
        )

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