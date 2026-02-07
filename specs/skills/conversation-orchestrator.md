# Skill Specification: Conversation Orchestration

**Version**: 1.0.0
**Created**: 2026-01-15
**Category**: AI Integration & Orchestration
**Phase Coverage**: III, IV, V

---

## Purpose

Orchestrates multi-turn conversations between users and AI agents, managing context, state, and skill invocations. Enables natural language interaction with the Todo platform while maintaining security, observability, and constitutional compliance.

**Core Mission**: Build intelligent conversation flows that understand user intent, invoke appropriate skills, and provide natural, helpful responses.

---

## Inputs

### Required Inputs

```typescript
interface ConversationOrchestrationInput {
  user_message: string;                 // Natural language input from user
  conversation_history: Message[];      // Previous messages and context
  available_skills: Skill[];            // Skills the agent can invoke
  user_context: {
    user_id: string;
    permissions: string[];
    preferences: Record<string, any>;
  };
  conversation_goal?: string;           // "task-creation", "query", "update", "help"
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface Skill {
  name: string;
  description: string;
  parameters: Record<string, any>;
  required_permissions?: string[];
}
```

### Example Input

```json
{
  "user_message": "Create a high-priority task to review the API documentation by Friday",
  "conversation_history": [],
  "available_skills": [
    {
      "name": "api-generator",
      "description": "Generate FastAPI code from specifications",
      "parameters": {
        "spec_file": "string",
        "entities": "array"
      }
    },
    {
      "name": "database-schema",
      "description": "Generate database schemas and migrations",
      "parameters": {
        "entities": "array"
      }
    }
  ],
  "user_context": {
    "user_id": "user-123",
    "permissions": ["create_task", "update_task"],
    "preferences": {
      "default_priority": "medium",
      "timezone": "America/New_York"
    }
  },
  "conversation_goal": "task-creation"
}
```

---

## Outputs

### Primary Outputs

```typescript
interface ConversationOrchestrationOutput {
  agent_response: string;               // Natural language response to user
  skill_invocations: SkillInvocation[]; // Skills called during conversation
  conversation_state: {
    last_action: string;
    context: Record<string, any>;
    awaiting_clarification: boolean;
  };
  suggested_actions: string[];          // Next steps for user
  confidence_score: number;             // Agent's confidence (0-1)
}

interface SkillInvocation {
  skill: string;
  action: string;
  inputs: Record<string, any>;
  result: {
    success: boolean;
    data?: any;
    error?: string;
  };
  latency_ms: number;
}
```

---

## Rules

### Conversation Management Rules (Non-Negotiable)

1. **MUST maintain conversation context across turns**
   - Store conversation history
   - Track user preferences
   - Remember previous actions
   - Maintain session state

2. **MUST validate user intent before skill invocation**
   - Parse natural language input
   - Extract entities and parameters
   - Confirm understanding with user
   - Handle ambiguous requests

3. **MUST ask clarifying questions for ambiguous requests**
   - Identify missing information
   - Present options to user
   - Avoid making assumptions
   - Confirm before destructive actions

4. **MUST handle skill failures gracefully with fallback responses**
   - Catch and log errors
   - Provide helpful error messages
   - Suggest recovery actions
   - Offer alternative approaches

5. **MUST respect user permissions** (no unauthorized actions)
   - Validate permissions before skill invocation
   - Return 403 for unauthorized actions
   - Log permission violations
   - Suggest requesting access

### Safety Rules

6. **MUST log all conversations with correlation IDs**
   - User messages and agent responses
   - Skill invocations and results
   - Errors and exceptions
   - Performance metrics

7. **MUST support multi-step workflows**
   - Chain multiple skill invocations
   - Maintain state between steps
   - Handle partial failures
   - Support rollback/undo

8. **MUST provide progress updates for long-running operations**
   - Show spinner or progress bar
   - Estimate time remaining
   - Allow cancellation
   - Notify on completion

9. **MUST support conversation branching** (multiple paths)
   - Handle "what if" questions
   - Support alternative scenarios
   - Allow backtracking
   - Maintain conversation tree

10. **MUST include undo/cancel capabilities for destructive actions**
    - Confirm before delete/update
    - Provide undo option
    - Time-limited undo window
    - Log all destructive actions

### Security Rules

11. **MUST sanitize user inputs to prevent injection attacks**
    - Validate all inputs
    - Escape special characters
    - Use parameterized queries
    - Prevent prompt injection

12. **MUST support conversation export** (for debugging/training)
    - Export conversation history
    - Include metadata
    - Anonymize sensitive data
    - Support JSON/CSV formats

---

## Reusability

### Scope
- All conversational interfaces across Phases III-V
- Any AI agent requiring natural language interaction
- Any application with conversational UI

### Portability
- Orchestration patterns work with any LLM (Claude, GPT, etc.)
- Framework-agnostic conversation management
- Can be adapted for voice assistants

### Composability
- Integrates all other skills into conversational workflows
- Can chain multiple skills in single conversation
- Supports nested conversations

### Extensibility
- New skills can be added dynamically
- Custom conversation flows can be defined
- Supports multiple languages (i18n)

---

## Example Execution

### Input
```json
{
  "user_message": "Create a high-priority task to review the API documentation by Friday",
  "conversation_history": [],
  "available_skills": ["api-generator", "database-schema"],
  "user_context": {
    "user_id": "user-123",
    "permissions": ["create_task"],
    "preferences": {
      "timezone": "America/New_York"
    }
  }
}
```

### Processing Steps

1. **Parse User Intent**
```python
intent = {
    "action": "create_task",
    "entities": {
        "title": "Review the API documentation",
        "priority": "high",
        "due_date": "2026-01-19"  # Next Friday
    },
    "confidence": 0.95
}
```

2. **Validate Permissions**
```python
if "create_task" not in user_context["permissions"]:
    return {
        "agent_response": "I don't have permission to create tasks for you. Please contact your administrator.",
        "confidence_score": 1.0
    }
```

3. **Confirm with User**
```python
confirmation_message = """
I'll create a high-priority task for you:
- Title: Review the API documentation
- Priority: High
- Due date: Friday, January 19, 2026

Should I proceed?
"""
```

4. **Invoke Skill**
```python
skill_result = await invoke_skill(
    skill_name="api-generator",
    action="create_task",
    parameters={
        "user_id": "user-123",
        "title": "Review the API documentation",
        "priority": "high",
        "due_date": "2026-01-19",
        "status": "todo"
    },
    auth_token=user_jwt_token
)
```

5. **Handle Result**
```python
if skill_result["success"]:
    task_id = skill_result["data"]["id"]

    response = f"""
    ✅ Task created successfully!

    I've added "Review the API documentation" to your task list with high priority.
    It's due on Friday, January 19, 2026.

    Would you like me to:
    - Add more details to this task?
    - Set a reminder?
    - Create another task?
    """

    conversation_state = {
        "last_action": "create_task",
        "last_task_id": task_id,
        "context": {
            "recent_tasks": [task_id]
        },
        "awaiting_clarification": False
    }

    suggested_actions = [
        "Add description",
        "Set reminder",
        "Create another task"
    ]

else:
    response = f"""
    ❌ I couldn't create the task due to an error: {skill_result["error"]}

    Would you like me to try again?
    """
```

### Output

```json
{
  "agent_response": "✅ Task created successfully!\n\nI've added \"Review the API documentation\" to your task list with high priority.\nIt's due on Friday, January 19, 2026.\n\nWould you like me to:\n- Add more details to this task?\n- Set a reminder?\n- Create another task?",
  "skill_invocations": [
    {
      "skill": "api-generator",
      "action": "create_task",
      "inputs": {
        "user_id": "user-123",
        "title": "Review the API documentation",
        "priority": "high",
        "due_date": "2026-01-19"
      },
      "result": {
        "success": true,
        "data": {
          "id": "task-456",
          "status": "created"
        }
      },
      "latency_ms": 145
    }
  ],
  "conversation_state": {
    "last_action": "create_task",
    "last_task_id": "task-456",
    "context": {
      "recent_tasks": ["task-456"]
    },
    "awaiting_clarification": false
  },
  "suggested_actions": [
    "Add description",
    "Set reminder",
    "Create another task"
  ],
  "confidence_score": 0.95
}
```

---

## Advanced Scenarios

### Multi-Turn Conversation

**Turn 1**:
```
User: "Show me my high-priority tasks"
Agent: "You have 3 high-priority tasks:
1. Review API documentation (due Friday)
2. Fix authentication bug (due today)
3. Update database schema (due next week)

Would you like details on any of these?"
```

**Turn 2**:
```
User: "Tell me more about the authentication bug"
Agent: "The authentication bug task:
- Priority: High
- Status: In Progress
- Due: Today (January 15, 2026)
- Created: 3 days ago

Would you like to:
- Mark it as complete?
- Update the due date?
- Add notes?"
```

**Turn 3**:
```
User: "Mark it as complete"
Agent: "✅ Great! I've marked 'Fix authentication bug' as complete.

You now have 2 high-priority tasks remaining. Keep up the good work!"
```

### Error Handling

**Scenario**: Skill invocation fails
```
User: "Create a task to deploy the app"
Agent: [Attempts to invoke create_task skill]
Skill: [Returns 500 error]

Agent: "I'm having trouble creating that task right now. The system seems to be experiencing issues.

Would you like me to:
- Try again in a moment?
- Save this as a draft for later?
- Help you with something else?"
```

### Ambiguity Resolution

**Scenario**: Unclear user intent
```
User: "Update the task"
Agent: "I'd be happy to help update a task! I see you have several tasks. Which one would you like to update?

1. Review API documentation
2. Update database schema
3. Deploy the app

Or you can tell me the task name."
```

### Permission Denied

**Scenario**: User lacks permission
```
User: "Delete all tasks"
Agent: "I don't have permission to delete tasks on your behalf. This action requires the 'delete_task' permission.

Would you like me to:
- Contact your administrator to request access?
- Show you which tasks you can manage?
- Help you with something else?"
```

---

## Implementation Example

```python
# ai/src/orchestrator.py
from typing import Dict, Any, List
import logging
from datetime import datetime

from .intent_parser import parse_intent
from .skill_invoker import invoke_skill
from .context_manager import ConversationContext

logger = logging.getLogger(__name__)

class ConversationOrchestrator:
    """
    Orchestrates multi-turn conversations with skill invocations.
    """

    def __init__(self, llm_client, available_skills):
        self.llm = llm_client
        self.skills = available_skills
        self.context_manager = ConversationContext()

    async def process_message(
        self,
        user_message: str,
        user_context: Dict[str, Any],
        conversation_id: str
    ) -> Dict[str, Any]:
        """
        Process a user message and return agent response.
        """
        correlation_id = f"conv-{conversation_id}-{datetime.utcnow().timestamp()}"

        logger.info(
            f"Processing message",
            extra={
                "correlation_id": correlation_id,
                "user_id": user_context["user_id"],
                "message_length": len(user_message)
            }
        )

        # Load conversation history
        history = await self.context_manager.get_history(conversation_id)

        # Parse user intent
        intent = await parse_intent(
            message=user_message,
            history=history,
            user_context=user_context
        )

        logger.info(
            f"Intent parsed: {intent['action']}",
            extra={
                "correlation_id": correlation_id,
                "confidence": intent["confidence"]
            }
        )

        # Check if clarification needed
        if intent["confidence"] < 0.8:
            return await self._request_clarification(intent, correlation_id)

        # Validate permissions
        if not self._has_permission(intent["action"], user_context):
            return self._permission_denied_response(intent["action"])

        # Invoke skill
        skill_invocations = []
        try:
            result = await invoke_skill(
                skill_name=intent["skill"],
                action=intent["action"],
                parameters=intent["parameters"],
                user_context=user_context
            )

            skill_invocations.append({
                "skill": intent["skill"],
                "action": intent["action"],
                "inputs": intent["parameters"],
                "result": result,
                "latency_ms": result.get("latency_ms", 0)
            })

            # Generate response
            response = await self._generate_response(
                intent=intent,
                result=result,
                user_context=user_context
            )

        except Exception as e:
            logger.exception(
                f"Skill invocation failed: {str(e)}",
                extra={"correlation_id": correlation_id}
            )
            response = self._error_response(str(e))

        # Update conversation state
        await self.context_manager.update_state(
            conversation_id=conversation_id,
            user_message=user_message,
            agent_response=response["agent_response"],
            skill_invocations=skill_invocations
        )

        return response

    async def _request_clarification(
        self,
        intent: Dict[str, Any],
        correlation_id: str
    ) -> Dict[str, Any]:
        """Request clarification from user."""
        return {
            "agent_response": f"I want to help you with {intent['action']}, but I need some clarification. Could you provide more details?",
            "skill_invocations": [],
            "conversation_state": {
                "awaiting_clarification": True,
                "pending_intent": intent
            },
            "suggested_actions": [],
            "confidence_score": intent["confidence"]
        }

    def _has_permission(
        self,
        action: str,
        user_context: Dict[str, Any]
    ) -> bool:
        """Check if user has permission for action."""
        return action in user_context.get("permissions", [])

    def _permission_denied_response(self, action: str) -> Dict[str, Any]:
        """Generate permission denied response."""
        return {
            "agent_response": f"I don't have permission to {action} on your behalf. Please contact your administrator.",
            "skill_invocations": [],
            "conversation_state": {},
            "suggested_actions": ["Contact administrator", "Try something else"],
            "confidence_score": 1.0
        }

    def _error_response(self, error: str) -> Dict[str, Any]:
        """Generate error response."""
        return {
            "agent_response": f"I encountered an error: {error}\n\nWould you like me to try again?",
            "skill_invocations": [],
            "conversation_state": {},
            "suggested_actions": ["Retry", "Try something else"],
            "confidence_score": 0.5
        }

    async def _generate_response(
        self,
        intent: Dict[str, Any],
        result: Dict[str, Any],
        user_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate natural language response from skill result."""
        # Use LLM to generate natural response
        prompt = f"""
        User wanted to: {intent['action']}
        Skill result: {result}

        Generate a helpful, natural language response.
        """

        response_text = await self.llm.generate(prompt)

        return {
            "agent_response": response_text,
            "skill_invocations": [],
            "conversation_state": {
                "last_action": intent["action"],
                "context": result.get("context", {})
            },
            "suggested_actions": self._suggest_next_actions(intent, result),
            "confidence_score": intent["confidence"]
        }

    def _suggest_next_actions(
        self,
        intent: Dict[str, Any],
        result: Dict[str, Any]
    ) -> List[str]:
        """Suggest next actions based on current action."""
        if intent["action"] == "create_task":
            return ["Add description", "Set reminder", "Create another task"]
        elif intent["action"] == "complete_task":
            return ["View remaining tasks", "Create new task"]
        else:
            return []
```

**Output Summary**:
- ✅ Complete conversation orchestration logic
- ✅ Intent parsing and validation
- ✅ Permission checking
- ✅ Skill invocation with error handling
- ✅ Natural language response generation
- ✅ Conversation state management
- ✅ Clarification requests
- ✅ Suggested actions
- ✅ Comprehensive logging

---

## Integration with Other Skills

### Orchestrates
- All 7 other skills can be invoked by orchestrator
- Chains multiple skills in workflows
- Manages skill dependencies

### Depends On
- **MCP Tool Builder**: Uses MCP tools for skill invocation
- **Authentication & Security**: Validates user permissions

---

## Performance Characteristics

- **Response Time**: < 500ms (p95)
- **Skill Invocation**: < 1s per skill
- **Context Loading**: < 50ms
- **Intent Parsing**: < 200ms
- **LLM Generation**: 1-3s

---

## Version History

- **1.0.0** (2026-01-15): Initial skill specification
