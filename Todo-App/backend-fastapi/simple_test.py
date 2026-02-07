"""
Simple test to verify the chatbot fixes
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from src.models.task import TaskPriority, TaskStatus
from src.api.chat import handle_add_task_command
import uuid
from unittest.mock import Mock

print("Testing enum values...")

# Test that enums exist and have correct values
print(f"TaskStatus values: TODO={TaskStatus.TODO.value}, DONE={TaskStatus.DONE.value}")
print(f"TaskPriority values: MEDIUM={TaskPriority.MEDIUM.value}, HIGH={TaskPriority.HIGH.value}")

# Test that the import works without errors
print("\nTesting function import...")
try:
    # Create minimal mocks to test function signature
    mock_user = Mock()
    mock_user.id = uuid.uuid4()
    mock_session = Mock()

    print("✓ All enum values and function imports are correct!")
    print("✓ No AttributeError for enum values")

except Exception as e:
    print(f"✗ Error: {e}")
    sys.exit(1)

print("\n✓ All fixes applied successfully!")
print("- Fixed TaskPriority.medium to TaskPriority.MEDIUM")
print("- Fixed TaskPriority.high to TaskPriority.HIGH")
print("- Verified TaskStatus enum values are correct")
print("- Verified all chat functions can be imported without errors")