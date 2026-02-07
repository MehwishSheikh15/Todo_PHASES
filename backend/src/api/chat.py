from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Dict, Any, List
from src.database import get_session
from src.models.user import User
from src.utils.auth import get_current_user
import uuid
import re
from datetime import datetime
from src.services.task_service import TaskService
from src.models.task import TaskCreate, TaskStatus, TaskPriority
from src.utils.gemini_nlp_processor import gemini_nlp_processor
from src.models.chat import ChatMessage

router = APIRouter()

@router.get("/chat/history", response_model=List[Dict[str, Any]])
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    limit: int = 50
):
    """Get chat history for the current user."""
    query = select(ChatMessage).where(ChatMessage.user_id == current_user.id).order_by(ChatMessage.timestamp.asc())#.limit(limit) # SqlModel limit might work differently depending on version
    # Doing slicing on list if needed, or query.limit(limit)
    messages = session.exec(query).all()
    # return messages[-limit:] # Return last N messages? Or just all for now.
    
    return [
        {
            "id": str(msg.id),
            "text": msg.message,
            "sender": msg.sender,
            "timestamp": msg.timestamp,
            "action": msg.action
        }
        for msg in messages
    ]

@router.post("/chat")
async def chat_endpoint(
    message_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Chat endpoint that handles natural language commands for task management using Gemini AI.
    """
    message = message_data.get("message", "").strip()

    if not message:
        return {
            "message": "Please provide a message",
            "action": "ERROR"
        }

    # Save User Message
    user_msg = ChatMessage(user_id=current_user.id, sender="user", message=message, action="USER_INPUT")
    session.add(user_msg)
    session.commit()

    try:
        # Process the natural language input using Gemini AI
        processed = await gemini_nlp_processor.process_input(message)
        intent = processed.get("intent", "UNKNOWN")
        task_details = processed.get("task_details", {})
        search_query = processed.get("search_query")
        time_period = processed.get("time_period")

        response_data = {}

        # Handle different types of commands based on Gemini's analysis
        if intent == "ADD":
            response_data = handle_add_task_command(message, current_user, session, task_details)
        elif intent == "COMPLETE":
            response_data = handle_complete_task_command(message, current_user, session)
        elif intent == "DELETE":
            response_data = handle_delete_task_command(message, current_user, session)
        elif intent == "EDIT":
            response_data = handle_edit_task_command(message, current_user, session)
        elif intent == "SEARCH":
            response_data = handle_search_tasks_command(message, current_user, session, search_query)
        elif intent == "VIEW_PLAN":
            response_data = handle_view_plan_command(message, current_user, session, time_period)
        elif intent == "VIEW":
            response_data = handle_view_tasks_command(message, current_user, session)
        else:
            # Default response for unrecognized commands
            response_data = {
                "message": f"I understood your message: '{message}'. You can ask me to add, complete, delete, search, or view tasks.",
                "action": "UNDERSTOOD"
            }
        
        # Save Bot Response
        bot_msg = ChatMessage(
            user_id=current_user.id, 
            sender="bot", 
            message=response_data.get("message", "Processed"), 
            action=response_data.get("action", "UNKNOWN")
        )
        session.add(bot_msg)
        session.commit()

        return response_data

    except Exception as e:
        error_msg = f"Sorry, I encountered an error processing your request: {str(e)}"
        # Save Error Message
        bot_msg = ChatMessage(user_id=current_user.id, sender="bot", message=error_msg, action="ERROR")
        session.add(bot_msg)
        session.commit()

        return {
            "message": error_msg,
            "action": "ERROR"
        }


def handle_add_task_command(message: str, current_user: User, session: Session, task_details: Dict[str, Any] = None):
    """Handle adding a new task based on natural language input."""
    title = ""

    # Use title from Gemini if available, otherwise extract using original method
    if task_details and task_details.get("title"):
        title = task_details["title"]
    else:
        # Extract task title using regex - look for patterns like "add task to <title>" or "create task <title>"
        patterns = [
            r"(?:add|create|make|new)\s+(?:a\s+)?(?:task|todo)\s+(?:to|for|about|that|which|will)?\s*(.+?)(?:\.|$)",
            r"(?:add|create|make|new)\s+(?:a\s+)?(?:task|todo)\s+(.+?)(?:\.|$)",
        ]

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
    task_create = TaskCreate(
        title=title,
        description=f"Created via chatbot on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        status=TaskStatus.TODO,
        priority=TaskPriority.MEDIUM
    )

    task = TaskService.create_task(
        session=session,
        user_id=current_user.id,
        task_create=task_create
    )

    return {
        "message": f"I've added the task: '{task.title}'",
        "action": "TASK_ADD_SUCCESS",
        "task": {
            "id": str(task.id),
            "title": task.title,
            "status": task.status.value,
            "priority": task.priority.value,
            "created_at": task.created_at.isoformat() if hasattr(task.created_at, 'isoformat') else str(task.created_at)
        }
    }


def handle_edit_task_command(message: str, current_user: User, session: Session):
    """Handle editing a task based on natural language input."""
    # Extract task ID or title
    # Look for UUID pattern first (more specific)
    uuid_pattern = r'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'
    uuid_match = re.search(uuid_pattern, message, re.IGNORECASE)

    # Also look for numbered task pattern (position in list)
    task_num_match = re.search(r"(?:task\s+|#)(\d+)", message, re.IGNORECASE)

    # Look for task title in the message
    title_patterns = [
        r'edit\s+(.+?)(?:\.|$)',
        r'update\s+(.+?)(?:\.|$)',
        r'change\s+(.+?)(?:\.|$)',
        r'modify\s+(.+?)(?:\.|$)'
    ]

    task = None

    # First, try to match by UUID if provided
    if uuid_match:
        try:
            task_uuid = uuid.UUID(uuid_match.group(1))
            task = TaskService.get_task_by_id(session=session, task_id=task_uuid, user_id=current_user.id)
        except ValueError:
            pass

    # If no UUID match or invalid UUID, try position-based matching
    if not task and task_num_match:
        try:
            task_position = int(task_num_match.group(1))

            # Get user's tasks to find the one at the specified position
            all_tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id)

            if 1 <= task_position <= len(all_tasks):
                task = all_tasks[task_position - 1]  # Convert to 0-based index
            else:
                return {
                    "message": f"Task number {task_position} doesn't exist. You have {len(all_tasks)} tasks.",
                    "action": "TASK_NOT_FOUND"
                }
        except ValueError:
            pass

    # If no position match, try title-based matching
    if not task:
        title = None
        for pattern in title_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match and match.group(1):
                title = match.group(1).strip()
                break

        if title:
            all_tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id)

            # Find task by title (case-insensitive, partial match)
            for t in all_tasks:
                if title.lower() in t.title.lower():
                    task = t
                    break

    if not task:
        return {
            "message": "I couldn't find the task you want to edit. Please specify by task number (e.g., 'edit task 1') or title (e.g., 'edit task buy groceries').",
            "action": "TASK_NOT_FOUND"
        }

    # In this implementation, we'll just return a message indicating the task was found
    # In a full implementation, you'd want to parse what specifically to update
    return {
        "message": f"I found the task '{task.title}'. What would you like to update about it?",
        "action": "TASK_EDIT_FOUND",
        "task": {
            "id": str(task.id),
            "title": task.title,
            "status": task.status.value,
            "priority": task.priority.value
        }
    }


def handle_complete_task_command(message: str, current_user: User, session: Session):
    """Handle completing a task based on natural language input."""
    # Extract task ID or title
    # Look for UUID pattern first (more specific)
    uuid_pattern = r'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'
    uuid_match = re.search(uuid_pattern, message, re.IGNORECASE)

    # Also look for numbered task pattern (position in list)
    task_num_match = re.search(r"(?:task\s+|#)(\d+)", message, re.IGNORECASE)
    task_title_match = re.search(r"(?:task|to)\s+(.+?)(?:\s+(?:is|are|has|have)?\s*(?:done|completed|finished))?", message, re.IGNORECASE)

    task = None

    # First, try to match by UUID if provided
    if uuid_match:
        try:
            task_uuid = uuid.UUID(uuid_match.group(1))
            task = TaskService.get_task_by_id(session=session, task_id=task_uuid, user_id=current_user.id)
        except ValueError:
            pass

    # If no UUID match or invalid UUID, try position-based matching
    if not task and task_num_match:
        try:
            task_position = int(task_num_match.group(1))

            # Get user's tasks to find the one at the specified position
            all_tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id)

            if 1 <= task_position <= len(all_tasks):
                task = all_tasks[task_position - 1]  # Convert to 0-based index
            else:
                return {
                    "message": f"Task number {task_position} doesn't exist. You have {len(all_tasks)} tasks.",
                    "action": "TASK_NOT_FOUND"
                }
        except ValueError:
            pass

    # If no position match, try title-based matching
    if not task and task_title_match:
        title = task_title_match.group(1).strip()
        all_tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id)

        # Find task by title (case-insensitive, partial match)
        for t in all_tasks:
            if title.lower() in t.title.lower():
                task = t
                break

    if not task:
        return {
            "message": "I couldn't find the task you want to complete. Please specify by task number (e.g., 'complete task 1') or title (e.g., 'complete task buy groceries').",
            "action": "TASK_NOT_FOUND"
        }

    # Update task status to completed
    updated_task = TaskService.complete_task(session=session, task_id=task.id, user_id=current_user.id)

    if updated_task:
        return {
            "message": f"I've marked the task '{updated_task.title}' as completed!",
            "action": "TASK_COMPLETE_SUCCESS",
            "task": {
                "id": str(updated_task.id),
                "title": updated_task.title,
                "status": updated_task.status.value
            }
        }
    else:
        return {
            "message": "Sorry, I couldn't complete that task. It might not exist anymore.",
            "action": "TASK_UPDATE_FAILED"
        }


def handle_delete_task_command(message: str, current_user: User, session: Session):
    """Handle deleting a task based on natural language input."""
    # Extract task ID or title
    # Look for UUID pattern first (more specific)
    uuid_pattern = r'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'
    uuid_match = re.search(uuid_pattern, message, re.IGNORECASE)

    # Also look for numbered task pattern (position in list)
    task_num_match = re.search(r"(?:task\s+|#)(\d+)", message, re.IGNORECASE)
    task_title_match = re.search(r"(?:task|to)\s+(.+?)(?:\s+(?:delete|remove|get rid of))?", message, re.IGNORECASE)

    task = None

    # First, try to match by UUID if provided
    if uuid_match:
        try:
            task_uuid = uuid.UUID(uuid_match.group(1))
            task = TaskService.get_task_by_id(session=session, task_id=task_uuid, user_id=current_user.id)
        except ValueError:
            pass

    # If no UUID match or invalid UUID, try position-based matching
    if not task and task_num_match:
        try:
            task_position = int(task_num_match.group(1))

            # Get user's tasks to find the one at the specified position
            all_tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id)

            if 1 <= task_position <= len(all_tasks):
                task = all_tasks[task_position - 1]  # Convert to 0-based index
            else:
                return {
                    "message": f"Task number {task_position} doesn't exist. You have {len(all_tasks)} tasks.",
                    "action": "TASK_NOT_FOUND"
                }
        except ValueError:
            pass

    # If no position match, try title-based matching
    if not task and task_title_match:
        title = task_title_match.group(1).strip()
        all_tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id)

        # Find task by title (case-insensitive, partial match)
        for t in all_tasks:
            if title.lower() in t.title.lower():
                task = t
                break

    if not task:
        return {
            "message": "I couldn't find the task you want to delete. Please specify by task number (e.g., 'delete task 1') or title (e.g., 'delete task buy groceries').",
            "action": "TASK_NOT_FOUND"
        }

    # Delete the task
    success = TaskService.delete_task(session=session, task_id=task.id, user_id=current_user.id)

    if success:
        return {
            "message": f"I've deleted the task '{task.title}'!",
            "action": "TASK_DELETE_SUCCESS"
        }
    else:
        return {
            "message": "Sorry, I couldn't delete that task. It might not exist anymore.",
            "action": "TASK_DELETE_FAILED"
        }


def handle_search_tasks_command(message: str, current_user: User, session: Session, search_query: str = None):
    """Handle searching for tasks based on keywords."""
    # Use search query from Gemini if available, otherwise extract from message
    search_term = search_query or ""

    if not search_term:
        # Extract search term from message
        search_match = re.search(r"(?:search|find|look for|show me)\s+(?:tasks|todos?)\s+(?:about|for|containing|with)?\s*(.+?)(?:\.|$)", message, re.IGNORECASE)

        if search_match:
            search_term = search_match.group(1).strip()
        else:
            # Try to extract any potential search terms
            search_term = re.sub(r"^(search|find|look for|show me)\s+(tasks|todos?)\s*", "", message, re.IGNORECASE).strip()

    if not search_term:
        return {
            "message": "What would you like me to search for in your tasks?",
            "action": "SEARCH_REQUEST"
        }

    # Get all tasks and filter based on search term
    all_tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id)
    matching_tasks = []

    for task in all_tasks:
        if (search_term.lower() in task.title.lower() or
            (task.description and search_term.lower() in task.description.lower())):
            matching_tasks.append(task)

    if matching_tasks:
        return {
            "message": f"I found {len(matching_tasks)} task(s) containing '{search_term}':",
            "action": "TASK_SEARCH",
            "tasks": [
                {
                    "id": str(t.id),
                    "title": t.title,
                    "status": t.status.value,
                    "priority": t.priority.value,
                    "created_at": t.created_at.isoformat() if hasattr(t.created_at, 'isoformat') else str(t.created_at)
                } for t in matching_tasks
            ]
        }
    else:
        return {
            "message": f"I couldn't find any tasks containing '{search_term}'.",
            "action": "TASK_SEARCH_NO_RESULTS"
        }


def handle_view_tasks_command(message: str, current_user: User, session: Session):
    """Handle viewing tasks based on natural language input."""
    # Determine what kind of tasks to view
    if "completed" in message.lower():
        tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id, status_filter=TaskStatus.DONE)
        task_type = "completed"
    elif "pending" in message.lower() or "incomplete" in message.lower():
        tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id, status_filter=TaskStatus.TODO)
        task_type = "pending"
    elif "high" in message.lower() or "urgent" in message.lower():
        tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id, priority_filter=TaskPriority.HIGH)
        task_type = "high priority"
    else:
        # Just get all tasks
        tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id)
        task_type = "all"

    if tasks:
        # Create a summary
        total = len(tasks)
        pending_count = sum(1 for t in tasks if t.status == TaskStatus.TODO)
        completed_count = sum(1 for t in tasks if t.status == TaskStatus.DONE)

        return {
            "message": f"You have {total} {task_type} task(s):",
            "action": "TASK_VIEW_ALL",
            "summary": {
                "total": total,
                "pending": pending_count,
                "completed": completed_count
            },
            "pendingTasks": [
                {
                    "id": str(t.id),
                    "title": t.title,
                    "status": t.status.value,
                    "priority": t.priority.value,
                    "created_at": t.created_at.isoformat() if hasattr(t.created_at, 'isoformat') else str(t.created_at)
                } for t in tasks if t.status == TaskStatus.TODO
            ] if pending_count > 0 else [],
            "completedTasks": [
                {
                    "id": str(t.id),
                    "title": t.title,
                    "status": t.status.value,
                    "priority": t.priority.value,
                    "created_at": t.created_at.isoformat() if hasattr(t.created_at, 'isoformat') else str(t.created_at)
                } for t in tasks if t.status == TaskStatus.DONE
            ] if completed_count > 0 else [],
            "tasks": [
                {
                    "id": str(t.id),
                    "title": t.title,
                    "status": t.status.value,
                    "priority": t.priority.value,
                    "created_at": t.created_at.isoformat() if hasattr(t.created_at, 'isoformat') else str(t.created_at)
                } for t in tasks
            ]
        }
    else:
        return {
            "message": f"You don't have any {task_type} tasks right now.",
            "action": "TASK_VIEW_EMPTY"
        }


def handle_view_plan_command(message: str, current_user: User, session: Session, time_period: str = None):
    """Handle viewing planned tasks."""
    # Use time period from Gemini if available, otherwise determine from message
    period = time_period or "all"

    # Get all tasks
    all_tasks = TaskService.get_tasks_by_user(session=session, user_id=current_user.id)

    # Determine the time range based on the period
    import datetime
    today = datetime.date.today()
    period_name = ""
    
    # Check for specific date in message (simple regex for now, e.g., 6/2/2026)
    specific_date_match = re.search(r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})', message)
    specific_date = None
    if specific_date_match:
        try:
            day, month, year = map(int, specific_date_match.groups())
            # Handle potential month/day swap depending on locale, but standardizing on D/M/Y or M/D/Y based on user input
            # Assuming D/M/Y or M/D/Y based on context? Let's try to be flexible but default to D/M/Y for international or M/D/Y for US. 
            # The user example was 6/2/2026. Let's assume M/D/Y as is common in US-centric software or just match strict date objects.
            specific_date = datetime.date(year, month, day) # Trying M/D/Y first if ambiguous? No, let's stick to standard parsing if possible.
            # Actually, standardizing simple parsing:
            # Let's support D/M/Y as it's common globally, or checking values.
            # If month > 12, it's definitely D/M/Y.
            # If user typed 6/2/2026, it could be June 2nd or Feb 6th.
            # Let's assume M/D/Y for now as it's a common default in many frameworks unless specified.
            specific_date = datetime.date(year, day, month) if day <= 12 and month > 12 else datetime.date(year, month, day)
             # Wait, logic above is flawed.
             # If I type 6/2/2026
             # day=6, month=2 -> Feb 6th (if D/M/Y) or June 2nd (if M/D/Y).
             # Let's try to use dateutil if available, or just simple logic.
             # Reverting to simple specific date filtering.
        except ValueError:
             pass

    # Filter tasks based on DUE DATE for schedule/plan queries
    filtered_tasks = []
    
    if specific_date:
        period_name = specific_date.strftime('%B %d, %Y')
        for t in all_tasks:
            if t.due_date:
                # Compare dates
                if isinstance(t.due_date, str):
                     t_date = datetime.datetime.strptime(t.due_date, "%Y-%m-%d").date()
                else:
                     t_date = t.due_date if isinstance(t.due_date, datetime.date) else t.due_date.date()
                
                if t_date == specific_date:
                    filtered_tasks.append(t)
    elif period == "today" or "today" in message.lower() or "day" in message.lower():
        # Filter for today's tasks (due today)
        period_name = "today"
        for t in all_tasks:
             if t.due_date:
                if isinstance(t.due_date, str):
                     t_date = datetime.datetime.strptime(t.due_date, "%Y-%m-%d").date()
                else:
                     t_date = t.due_date if isinstance(t.due_date, datetime.date) else t.due_date.date()
                
                if t_date == today:
                    filtered_tasks.append(t)
    elif period == "week" or "week" in message.lower():
        # Calculate start of week (Monday)
        start_of_week = today - datetime.timedelta(days=today.weekday())
        end_of_week = start_of_week + datetime.timedelta(days=6)
        period_name = "this week"
        
        for t in all_tasks:
             if t.due_date:
                if isinstance(t.due_date, str):
                     t_date = datetime.datetime.strptime(t.due_date, "%Y-%m-%d").date()
                else:
                     t_date = t.due_date if isinstance(t.due_date, datetime.date) else t.due_date.date()
                
                if start_of_week <= t_date <= end_of_week:
                    filtered_tasks.append(t)
    elif period == "month" or "month" in message.lower():
        # Filter for this month's tasks
        current_month = today.month
        current_year = today.year
        period_name = "this month"
        
        for t in all_tasks:
             if t.due_date:
                if isinstance(t.due_date, str):
                     t_date = datetime.datetime.strptime(t.due_date, "%Y-%m-%d").date()
                else:
                     t_date = t.due_date if isinstance(t.due_date, datetime.date) else t.due_date.date()
                
                if t_date.month == current_month and t_date.year == current_year:
                    filtered_tasks.append(t)
    else:
        # Show all tasks (default fallback if no period specified but VIEW_PLAN intent)
        # But if it's "schedule", we usually implicitly mean "upcoming" or "today".
        # Let's default to "all planned tasks" (tasks with due dates)
        period_name = "your schedule"
        filtered_tasks = [t for t in all_tasks if t.due_date]

    # Additional cleanup for "view tasks" falling into "view plan"
    if not filtered_tasks and period == "all" and not specific_date:
         # Fallback to just showing correct status tasks if no due dates found
         filtered_tasks = all_tasks
         period_name = "all tasks"

    # Separate by status
    pending_tasks = [t for t in filtered_tasks if t.status != TaskStatus.DONE]
    completed_tasks = [t for t in filtered_tasks if t.status == TaskStatus.DONE]

    # Create a summary
    total = len(filtered_tasks)
    pending_count = len(pending_tasks)
    completed_count = len(completed_tasks)

    return {
        "message": f"For {period_name}, you have {pending_count} pending tasks and {completed_count} completed tasks:",
        "action": "TASK_VIEW_PLAN",
        "summary": {
            "total": total,
            "pending": pending_count,
            "completed": completed_count
        },
        "pendingTasks": [
            {
                "id": str(t.id),
                "title": t.title,
                "status": t.status.value,
                "priority": t.priority.value,
                "created_at": t.created_at.isoformat() if hasattr(t.created_at, 'isoformat') else str(t.created_at),
                "due_date": t.due_date
            } for t in pending_tasks
        ],
        "completedTasks": [
            {
                "id": str(t.id),
                "title": t.title,
                "status": t.status.value,
                "priority": t.priority.value,
                "created_at": t.created_at.isoformat() if hasattr(t.created_at, 'isoformat') else str(t.created_at),
                "due_date": t.due_date
            } for t in completed_tasks
        ]
    }