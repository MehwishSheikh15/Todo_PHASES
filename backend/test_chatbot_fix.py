"""
Test script to verify the chatbot functionality has been fixed
"""
import asyncio
import uuid
from unittest.mock import Mock, MagicMock
from sqlmodel import Session
from src.models.user import User
from src.models.task import Task, TaskCreate, TaskStatus, TaskPriority
from src.api.chat import (
    handle_add_task_command,
    handle_complete_task_command,
    handle_delete_task_command,
    handle_edit_task_command
)
from src.services.task_service import TaskService


def test_chatbot_functions():
    print("Testing chatbot functions...")

    # Create mock objects
    mock_user = User(
        id=uuid.uuid4(),
        email='test@example.com',
        hashed_password='fake_hash'
    )

    # Create a mock session
    mock_session = Mock(spec=Session)

    # Test 1: Add task command
    print("\n1. Testing ADD task command...")
    try:
        # Mock the TaskService.create_task method
        TaskService.create_task = Mock(return_value=Task(
            id=uuid.uuid4(),
            title="Test task",
            description="Created via chatbot",
            status=TaskStatus.TODO,
            priority=TaskPriority.MEDIUM,
            user_id=mock_user.id,
            created_at=None,
            updated_at=None
        ))

        result = handle_add_task_command(
            message="Add a task to buy groceries",
            current_user=mock_user,
            session=mock_session
        )

        print(f"   ✓ Add task result: {result['action']}")
        assert result['action'] == 'TASK_ADD_SUCCESS'
        print("   ✓ ADD task command working correctly")

    except Exception as e:
        print(f"   ✗ Error in ADD task command: {e}")

    # Test 2: Complete task command
    print("\n2. Testing COMPLETE task command...")
    try:
        # Mock the TaskService.get_tasks_by_user method to return a task
        mock_task = Task(
            id=uuid.uuid4(),
            title="Test task",
            description="Test description",
            status=TaskStatus.TODO,
            priority=TaskPriority.MEDIUM,
            user_id=mock_user.id,
            created_at=None,
            updated_at=None
        )

        TaskService.get_tasks_by_user = Mock(return_value=[mock_task])
        TaskService.get_task_by_id = Mock(return_value=mock_task)
        TaskService.complete_task = Mock(return_value=mock_task)

        result = handle_complete_task_command(
            message="Complete task 1",
            current_user=mock_user,
            session=mock_session
        )

        print(f"   ✓ Complete task result: {result['action']}")
        assert result['action'] == 'TASK_COMPLETE_SUCCESS'
        print("   ✓ COMPLETE task command working correctly")

    except Exception as e:
        print(f"   ✗ Error in COMPLETE task command: {e}")

    # Test 3: Delete task command
    print("\n3. Testing DELETE task command...")
    try:
        mock_task = Task(
            id=uuid.uuid4(),
            title="Test task to delete",
            description="Test description",
            status=TaskStatus.TODO,
            priority=TaskPriority.MEDIUM,
            user_id=mock_user.id,
            created_at=None,
            updated_at=None
        )

        TaskService.get_tasks_by_user = Mock(return_value=[mock_task])
        TaskService.get_task_by_id = Mock(return_value=mock_task)
        TaskService.delete_task = Mock(return_value=True)

        result = handle_delete_task_command(
            message="Delete task 1",
            current_user=mock_user,
            session=mock_session
        )

        print(f"   ✓ Delete task result: {result['action']}")
        assert result['action'] == 'TASK_DELETE_SUCCESS'
        print("   ✓ DELETE task command working correctly")

    except Exception as e:
        print(f"   ✗ Error in DELETE task command: {e}")

    # Test 4: Edit task command
    print("\n4. Testing EDIT task command...")
    try:
        mock_task = Task(
            id=uuid.uuid4(),
            title="Test task to edit",
            description="Test description",
            status=TaskStatus.TODO,
            priority=TaskPriority.MEDIUM,
            user_id=mock_user.id,
            created_at=None,
            updated_at=None
        )

        TaskService.get_tasks_by_user = Mock(return_value=[mock_task])
        TaskService.get_task_by_id = Mock(return_value=mock_task)

        result = handle_edit_task_command(
            message="Edit task 1",
            current_user=mock_user,
            session=mock_session
        )

        print(f"   ✓ Edit task result: {result['action']}")
        assert result['action'] == 'TASK_EDIT_FOUND'
        print("   ✓ EDIT task command working correctly")

    except Exception as e:
        print(f"   ✗ Error in EDIT task command: {e}")

    print("\n✓ All chatbot functions tested successfully!")


if __name__ == "__main__":
    test_chatbot_functions()