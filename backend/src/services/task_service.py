from sqlmodel import Session, select
from typing import List, Optional
from src.models.task import Task, TaskCreate, TaskUpdate, TaskStatus
from src.services.activity_service import ActivityService
from src.models.user import User
from fastapi import HTTPException, status
import uuid
from datetime import datetime

class TaskService:
    @staticmethod
    def create_task(session: Session, user_id: uuid.UUID, task_create: TaskCreate) -> Task:
        """Create a new task for a user."""
        db_task = Task(
            **task_create.dict(),
            user_id=user_id
        )

        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        # Log activity
        ActivityService.log_activity(
            session=session,
            user_id=user_id,
            action="CREATED_TASK",
            entity_title=db_task.title,
            entity_id=db_task.id
        )

        return db_task

    @staticmethod
    def get_task_by_id(session: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
        """Get a task by ID for a specific user."""
        return session.exec(
            select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        ).first()

    @staticmethod
    def get_tasks_by_user(
        session: Session,
        user_id: uuid.UUID,
        status_filter: Optional[TaskStatus] = None,
        priority_filter: Optional[str] = None,
        category_filter: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[Task]:
        """Get all tasks for a specific user with optional filters."""
        query = select(Task).where(Task.user_id == user_id)

        if status_filter:
            query = query.where(Task.status == status_filter)
        if priority_filter:
            query = query.where(Task.priority == priority_filter)
        if category_filter:
            query = query.where(Task.category == category_filter)

        query = query.offset(skip).limit(limit).order_by(Task.created_at.desc())

        return session.exec(query).all()

    @staticmethod
    def update_task(
        session: Session,
        task_id: uuid.UUID,
        user_id: uuid.UUID,
        task_update: TaskUpdate
    ) -> Optional[Task]:
        """Update a task for a specific user."""
        db_task = session.exec(
            select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        ).first()

        if not db_task:
            return None

        # Update fields if they are provided
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)

        # Update the updated_at timestamp
        db_task.updated_at = datetime.utcnow()

        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        # Log activity
        ActivityService.log_activity(
            session=session,
            user_id=user_id,
            action="UPDATED_TASK",
            entity_title=db_task.title,
            entity_id=db_task.id,
            details="Updated task details"
        )

        return db_task

    @staticmethod
    def delete_task(session: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Delete a task for a specific user."""
        db_task = session.exec(
            select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        ).first()

        if not db_task:
            return False

        session.delete(db_task)
        session.commit()

        # Log activity (title available from local var)
        ActivityService.log_activity(
            session=session,
            user_id=user_id,
            action="DELETED_TASK",
            entity_title=db_task.title,
            entity_id=task_id
        )

        return True

    @staticmethod
    def complete_task(session: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
        """Mark a task as completed."""
        db_task = session.exec(
            select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        ).first()

        if not db_task:
            return None

        db_task.status = TaskStatus.DONE
        db_task.completed_at = datetime.utcnow()
        db_task.updated_at = datetime.utcnow()

        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        # Log activity
        ActivityService.log_activity(
            session=session,
            user_id=user_id,
            action="COMPLETED_TASK",
            entity_title=db_task.title,
            entity_id=db_task.id
        )

        return db_task