"""
Mock chat API to serve as fallback when Node.js backend is not available
"""

import json
import re
from datetime import datetime
from typing import Dict, Any, List

# In-memory storage for tasks (in production, you'd use a proper database)
tasks_storage: List[Dict[str, Any]] = []

def handle_add_task_command(message: str) -> Dict[str, Any]:
    """Handle adding a new task based on natural language input."""
    # Extract task title using regex - look for patterns like "add task to <title>" or "create task <title>"
    patterns = [
        r"(?:add|create|make|new)\s+(?:a\s+)?(?:task|todo)\s+(?:to|for|about|that|which|will)?\s*(.+?)(?:\.|$)",
        r"(?:add|create|make|new)\s+(?:a\s+)?(?:task|todo)\s+(.+?)(?:\.|$)",
    ]

    title = None
    for pattern in patterns:
        match = re.search(pattern, message.lower())
        if match:
            title = match.group(1).strip()
            break

    # If we couldn't extract the title from the patterns, just use the entire message minus the command
    if not title:
        # Remove common command words to get the title
        title = re.sub(r"^(add|create|make|new)\s+(a\s+)?(task|todo)\s+", "", message, flags=re.IGNORECASE).strip()

        # If it's still too vague, ask for clarification
        if len(title) < 2:
            return {
                "message": "Could you please specify what task you'd like to add?",
                "action": "ADD_TASK_REQUEST"
            }

    # Create the task
    task_id = str(len(tasks_storage) + 1)
    new_task = {
        "id": task_id,
        "title": title,
        "description": f"Created via chatbot on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "status": "pending",
        "priority": "medium",
        "created_at": datetime.now().isoformat()
    }

    tasks_storage.append(new_task)

    return {
        "message": f"I've added the task: '{new_task['title']}'",
        "action": "TASK_ADD_SUCCESS",
        "task": {
            "id": new_task["id"],
            "title": new_task["title"],
            "status": new_task["status"],
            "priority": new_task["priority"],
            "created_at": new_task["created_at"]
        }
    }

def handle_get_tasks_command() -> Dict[str, Any]:
    """Return all tasks."""
    pending_tasks = [t for t in tasks_storage if t["status"] == "pending"]
    completed_tasks = [t for t in tasks_storage if t["status"] == "completed"]

    return {
        "message": f"You have {len(tasks_storage)} tasks total:",
        "action": "TASK_VIEW_ALL",
        "summary": {
            "total": len(tasks_storage),
            "pending": len(pending_tasks),
            "completed": len(completed_tasks)
        },
        "pendingTasks": [
            {
                "id": t["id"],
                "title": t["title"],
                "status": t["status"],
                "priority": t["priority"],
                "created_at": t["created_at"]
            } for t in pending_tasks
        ],
        "completedTasks": [
            {
                "id": t["id"],
                "title": t["title"],
                "status": t["status"],
                "priority": t["priority"],
                "created_at": t["created_at"]
            } for t in completed_tasks
        ],
        "tasks": [
            {
                "id": t["id"],
                "title": t["title"],
                "status": t["status"],
                "priority": t["priority"],
                "created_at": t["created_at"]
            } for t in tasks_storage
        ]
    }

def process_chat_message(message: str) -> Dict[str, Any]:
    """Process a chat message and return appropriate response."""
    message_lower = message.lower().strip()

    # Handle different types of commands
    if any(word in message_lower for word in ["add", "create", "new"]):
        return handle_add_task_command(message)
    elif any(word in message_lower for word in ["show", "list", "view", "get", "all"]):
        return handle_get_tasks_command()
    else:
        return {
            "message": f"I understood your message: '{message}'. Currently, I can help you add tasks. Try saying 'Add a task to buy groceries'.",
            "action": "UNDERSTOOD"
        }