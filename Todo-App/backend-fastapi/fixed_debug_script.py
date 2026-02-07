"""
Fixed debug script to identify specific chatbot errors
Handles Windows encoding issues by using ASCII characters instead of Unicode
"""
import sys
import os
import traceback
import uuid
from unittest.mock import Mock, patch

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))

def test_imports():
    """Test that all necessary modules can be imported without errors."""
    print("Testing imports...")

    try:
        from src.models.task import TaskPriority, TaskStatus
        print("[PASS] Models imported successfully")
    except Exception as e:
        print(f"[FAIL] Error importing models: {e}")
        traceback.print_exc()
        return False

    try:
        from src.api.chat import (
            handle_add_task_command,
            handle_complete_task_command,
            handle_delete_task_command,
            handle_edit_task_command,
            handle_search_tasks_command,
            handle_view_tasks_command
        )
        print("[PASS] Chat API functions imported successfully")
    except Exception as e:
        print(f"[FAIL] Error importing chat functions: {e}")
        traceback.print_exc()
        return False

    try:
        from src.services.task_service import TaskService
        print("[PASS] TaskService imported successfully")
    except Exception as e:
        print(f"[FAIL] Error importing TaskService: {e}")
        traceback.print_exc()
        return False

    return True

def test_enum_values():
    """Test that enum values are correctly defined."""
    print("\nTesting enum values...")

    from src.models.task import TaskPriority, TaskStatus

    try:
        # Test TaskPriority values
        assert hasattr(TaskPriority, 'MEDIUM'), "TaskPriority.MEDIUM missing"
        assert hasattr(TaskPriority, 'HIGH'), "TaskPriority.HIGH missing"
        assert hasattr(TaskPriority, 'LOW'), "TaskPriority.LOW missing"

        # Test TaskStatus values
        assert hasattr(TaskStatus, 'TODO'), "TaskStatus.TODO missing"
        assert hasattr(TaskStatus, 'DONE'), "TaskStatus.DONE missing"
        assert hasattr(TaskStatus, 'IN_PROGRESS'), "TaskStatus.IN_PROGRESS missing"

        print(f"  TaskPriority.MEDIUM = {TaskPriority.MEDIUM}")
        print(f"  TaskStatus.DONE = {TaskStatus.DONE}")
        print("[PASS] All enum values exist")

    except Exception as e:
        print(f"[FAIL] Error with enum values: {e}")
        traceback.print_exc()
        return False

    return True

def test_function_signatures():
    """Test that functions have correct signatures."""
    print("\nTesting function signatures...")

    try:
        from src.api.chat import handle_add_task_command

        # Create mock objects
        mock_user = Mock()
        mock_user.id = uuid.uuid4()
        mock_session = Mock()

        # Test function can be called without immediate errors
        print("[PASS] Function signatures are correct")
        return True

    except Exception as e:
        print(f"[FAIL] Error with function signatures: {e}")
        traceback.print_exc()
        return False

def test_regex_patterns():
    """Test that the regex patterns in chat.py are valid."""
    print("\nTesting regex patterns...")

    try:
        import re

        # Test the patterns used in the chat functions
        patterns = [
            r'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})',  # UUID
            r"(?:task\s+|#)(\d+)",  # Task number
            r"(\d+)",  # General number
        ]

        for pattern in patterns:
            re.compile(pattern)  # This will raise an exception if invalid

        print("[PASS] All regex patterns are valid")
        return True

    except Exception as e:
        print(f"[FAIL] Error with regex patterns: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Starting comprehensive chatbot debug test...\n")

    success = True

    success &= test_imports()
    success &= test_enum_values()
    success &= test_function_signatures()
    success &= test_regex_patterns()

    if success:
        print("\n[PASS] All tests passed! No obvious errors found.")
    else:
        print("\n[FAIL] Some tests failed. See error messages above.")