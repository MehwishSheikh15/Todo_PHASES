# Feature Specification: Task CRUD Operations

**Feature ID**: `001-phase-ii-full-stack-tasks`
**Version**: 1.0.0
**Created**: 2026-01-15
**Status**: Specification
**Priority**: P0 (Critical - Core Feature)
**Constitutional Compliance**: ✅ Verified

---

## Purpose

Provide comprehensive task management capabilities including create, read, update, delete, and list operations with filtering, sorting, and search. This is the core feature of the Phase II Todo application, enabling users to manage their personal task lists with rich metadata (priority, status, due dates, descriptions).

**Core Mission**: Enable efficient task management with intuitive operations, robust filtering, and complete user isolation while maintaining constitutional compliance for security, performance, and accessibility.

---

## Constitutional Alignment

| Principle | Implementation |
|-----------|----------------|
| **I. Spec > Code** | Complete specification before implementation |
| **II. Architecture > Implementation** | ADR for task data model, filtering strategy, pagination approach |
| **III. Security by Default** | All queries filtered by user_id, JWT required on all endpoints |
| **IV. Stateless Services** | No server-side state, all filtering via query parameters |
| **V. User Isolation Guaranteed** | Every query includes WHERE user_id = $1, no cross-user access |
| **VI. Cloud-Native First** | Stateless design, horizontal scaling, database connection pooling |
| **VII. Reusable Intelligence** | Task module reusable across features and phases |
| **VIII. Observability Ready** | Structured logging, correlation IDs, performance metrics |
| **IX. UI is Product Feature** | Premium task UI, drag-and-drop, keyboard shortcuts, accessibility |

---

## User Stories

### US-TASK-001: Create Task (P0)
**As a** logged-in user
**I want to** create a new task with title, description, priority, and due date
**So that** I can track my work and responsibilities

**Acceptance Criteria**:
- ✅ User provides task title (required, 1-200 characters)
- ✅ User provides description (optional, max 2000 characters)
- ✅ User selects priority (low, medium, high - default: medium)
- ✅ User sets due date (optional, ISO 8601 format)
- ✅ Task created with status "todo" by default
- ✅ Task assigned to current user (user_id from JWT)
- ✅ Task ID (UUID) generated automatically
- ✅ Timestamps (created_at, updated_at) set automatically
- ✅ Task returned in response with 201 Created
- ✅ User redirected to task list or task detail view

**Edge Cases**:
- Empty title → 400 Bad Request with validation error
- Title > 200 characters → 400 Bad Request
- Description > 2000 characters → 400 Bad Request
- Invalid priority value → 400 Bad Request with valid options
- Invalid due date format → 400 Bad Request with format guidance
- Due date in past → Warning but allowed (user may be logging past tasks)
- Database unavailable → 503 Service Unavailable
- Missing JWT → 401 Unauthorized

**Non-Functional Requirements**:
- **Performance**: Task creation completes in < 200ms (p95)
- **Security**: user_id extracted from JWT, never from request body
- **Observability**: Log task creation with correlation ID
- **Accessibility**: Form keyboard navigable, clear labels

---

### US-TASK-002: View Task List (P0)
**As a** logged-in user
**I want to** view all my tasks with filtering and sorting options
**So that** I can see what needs to be done

**Acceptance Criteria**:
- ✅ User sees all their tasks (filtered by user_id)
- ✅ Tasks displayed with: title, status, priority, due date, created date
- ✅ Default sort: due date ascending (soonest first), then created_at descending
- ✅ Filter by status: todo, in_progress, done (multi-select)
- ✅ Filter by priority: low, medium, high (multi-select)
- ✅ Search by title or description (case-insensitive)
- ✅ Pagination: 20 tasks per page (configurable)
- ✅ Total count returned in response
- ✅ Empty state shown when no tasks match filters

**Edge Cases**:
- No tasks exist → Empty state with "Create your first task" CTA
- All tasks filtered out → Empty state with "No tasks match filters"
- Invalid filter values → 400 Bad Request
- Invalid sort field → 400 Bad Request with valid options
- Page number out of range → Return empty array
- Database unavailable → 503 Service Unavailable
- Missing JWT → 401 Unauthorized

**Non-Functional Requirements**:
- **Performance**: List query completes in < 100ms (p95) for 1000 tasks
- **Performance**: Database indexes on user_id, status, priority, due_date
- **Security**: Only return tasks belonging to authenticated user
- **Observability**: Log query parameters and result count
- **Accessibility**: Task list keyboard navigable, screen reader compatible

---

### US-TASK-003: View Single Task (P0)
**As a** logged-in user
**I want to** view detailed information about a specific task
**So that** I can see all task details and metadata

**Acceptance Criteria**:
- ✅ User provides task ID (UUID)
- ✅ Task retrieved from database
- ✅ Verify task belongs to authenticated user (user_id match)
- ✅ Return full task details: id, title, description, status, priority, due_date, created_at, updated_at
- ✅ Return 200 OK with task data

**Edge Cases**:
- Task ID not found → 404 Not Found
- Task belongs to different user → 404 Not Found (not 403, to prevent enumeration)
- Invalid UUID format → 400 Bad Request
- Database unavailable → 503 Service Unavailable
- Missing JWT → 401 Unauthorized

**Non-Functional Requirements**:
- **Performance**: Single task query completes in < 50ms (p95)
- **Security**: Always verify user_id matches authenticated user
- **Observability**: Log task access with correlation ID

---

### US-TASK-004: Update Task (P0)
**As a** logged-in user
**I want to** update any field of my task
**So that** I can keep my task information current

**Acceptance Criteria**:
- ✅ User provides task ID and fields to update
- ✅ Verify task belongs to authenticated user
- ✅ Update only provided fields (partial update)
- ✅ Validate updated fields (same rules as create)
- ✅ Update updated_at timestamp automatically
- ✅ Return updated task with 200 OK
- ✅ Support updating: title, description, status, priority, due_date

**Edge Cases**:
- Task ID not found → 404 Not Found
- Task belongs to different user → 404 Not Found
- No fields provided → 400 Bad Request
- Invalid field values → 400 Bad Request with validation errors
- Concurrent updates → Last write wins (optimistic concurrency in Phase III)
- Database unavailable → 503 Service Unavailable
- Missing JWT → 401 Unauthorized

**Non-Functional Requirements**:
- **Performance**: Task update completes in < 150ms (p95)
- **Security**: Always verify user_id matches authenticated user
- **Observability**: Log task updates with before/after values
- **Accessibility**: Update form keyboard navigable

---

### US-TASK-005: Delete Task (P1)
**As a** logged-in user
**I want to** delete a task I no longer need
**So that** I can keep my task list clean

**Acceptance Criteria**:
- ✅ User provides task ID
- ✅ Verify task belongs to authenticated user
- ✅ Delete task from database (hard delete in Phase II)
- ✅ Return 204 No Content on success
- ✅ Confirmation dialog shown in UI before deletion

**Edge Cases**:
- Task ID not found → 404 Not Found
- Task belongs to different user → 404 Not Found
- Task already deleted → 404 Not Found (idempotent)
- Database unavailable → 503 Service Unavailable
- Missing JWT → 401 Unauthorized

**Non-Functional Requirements**:
- **Performance**: Task deletion completes in < 100ms (p95)
- **Security**: Always verify user_id matches authenticated user
- **Observability**: Log task deletions with task details
- **Accessibility**: Confirmation dialog keyboard accessible

---

### US-TASK-006: Bulk Update Status (P1)
**As a** logged-in user
**I want to** update the status of multiple tasks at once
**So that** I can efficiently manage my workflow

**Acceptance Criteria**:
- ✅ User provides array of task IDs and new status
- ✅ Verify all tasks belong to authenticated user
- ✅ Update status for all valid tasks
- ✅ Return count of updated tasks
- ✅ Return list of task IDs that failed (if any)
- ✅ Partial success allowed (some tasks updated, some failed)

**Edge Cases**:
- Empty task ID array → 400 Bad Request
- Some tasks not found → Update found tasks, return failed IDs
- Some tasks belong to different user → Skip those tasks, return failed IDs
- Invalid status value → 400 Bad Request
- Database unavailable → 503 Service Unavailable
- Missing JWT → 401 Unauthorized

**Non-Functional Requirements**:
- **Performance**: Bulk update completes in < 500ms for 100 tasks (p95)
- **Security**: Verify all tasks belong to authenticated user
- **Observability**: Log bulk operations with task count

---

### US-TASK-007: Search Tasks (P1)
**As a** logged-in user
**I want to** search my tasks by title or description
**So that** I can quickly find specific tasks

**Acceptance Criteria**:
- ✅ User provides search query (min 2 characters)
- ✅ Search in title and description (case-insensitive)
- ✅ Return matching tasks with highlighted matches
- ✅ Support partial word matching
- ✅ Combine with status/priority filters
- ✅ Pagination supported
- ✅ Return total match count

**Edge Cases**:
- Query < 2 characters → 400 Bad Request
- No matches found → Empty array with total_count: 0
- Special characters in query → Escaped properly (prevent SQL injection)
- Database unavailable → 503 Service Unavailable
- Missing JWT → 401 Unauthorized

**Non-Functional Requirements**:
- **Performance**: Search completes in < 200ms (p95) for 1000 tasks
- **Performance**: Full-text search index on title and description
- **Security**: Parameterized queries to prevent SQL injection
- **Observability**: Log search queries and result counts

---

### US-TASK-008: Sort Tasks (P1)
**As a** logged-in user
**I want to** sort my tasks by different fields
**So that** I can organize my work effectively

**Acceptance Criteria**:
- ✅ Sort by: due_date, priority, status, created_at, updated_at, title
- ✅ Sort order: ascending (asc) or descending (desc)
- ✅ Default sort: due_date asc, created_at desc
- ✅ Multi-field sorting supported (e.g., priority desc, due_date asc)
- ✅ Null values handled consistently (nulls last for asc, nulls first for desc)

**Edge Cases**:
- Invalid sort field → 400 Bad Request with valid options
- Invalid sort order → 400 Bad Request (must be asc or desc)
- Database unavailable → 503 Service Unavailable

**Non-Functional Requirements**:
- **Performance**: Sorted queries complete in < 100ms (p95)
- **Performance**: Database indexes on sortable fields

---

## API Endpoints

### POST /api/tasks

**Request**:
```json
{
  "title": "Review API documentation",
  "description": "Go through the REST API docs and update examples",
  "priority": "high",
  "due_date": "2026-01-19T17:00:00Z",
  "status": "todo"
}
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Review API documentation",
  "description": "Go through the REST API docs and update examples",
  "status": "todo",
  "priority": "high",
  "due_date": "2026-01-19T17:00:00Z",
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-01-15T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors (empty title, invalid priority, etc.)
- `401 Unauthorized`: Missing or invalid JWT
- `503 Service Unavailable`: Database unavailable

---

### GET /api/tasks

**Query Parameters**:
- `status`: Filter by status (comma-separated: todo,in_progress,done)
- `priority`: Filter by priority (comma-separated: low,medium,high)
- `search`: Search query (min 2 characters)
- `sort_by`: Sort field (due_date, priority, status, created_at, updated_at, title)
- `sort_order`: Sort order (asc, desc)
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

**Example Request**:
```
GET /api/tasks?status=todo,in_progress&priority=high&sort_by=due_date&sort_order=asc&page=1&page_size=20
```

**Response (200 OK)**:
```json
{
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Review API documentation",
      "description": "Go through the REST API docs and update examples",
      "status": "todo",
      "priority": "high",
      "due_date": "2026-01-19T17:00:00Z",
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_count": 45,
    "total_pages": 3
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Missing or invalid JWT
- `503 Service Unavailable`: Database unavailable

---

### GET /api/tasks/{task_id}

**Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Review API documentation",
  "description": "Go through the REST API docs and update examples",
  "status": "todo",
  "priority": "high",
  "due_date": "2026-01-19T17:00:00Z",
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-01-15T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid UUID format
- `401 Unauthorized`: Missing or invalid JWT
- `404 Not Found`: Task not found or doesn't belong to user
- `503 Service Unavailable`: Database unavailable

---

### PATCH /api/tasks/{task_id}

**Request** (partial update):
```json
{
  "status": "in_progress",
  "priority": "medium"
}
```

**Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Review API documentation",
  "description": "Go through the REST API docs and update examples",
  "status": "in_progress",
  "priority": "medium",
  "due_date": "2026-01-19T17:00:00Z",
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-01-15T11:45:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors or no fields provided
- `401 Unauthorized`: Missing or invalid JWT
- `404 Not Found`: Task not found or doesn't belong to user
- `503 Service Unavailable`: Database unavailable

---

### DELETE /api/tasks/{task_id}

**Response (204 No Content)**:
```
(empty body)
```

**Error Responses**:
- `400 Bad Request`: Invalid UUID format
- `401 Unauthorized`: Missing or invalid JWT
- `404 Not Found`: Task not found or doesn't belong to user
- `503 Service Unavailable`: Database unavailable

---

### POST /api/tasks/bulk-update

**Request**:
```json
{
  "task_ids": [
    "550e8400-e29b-41d4-a716-446655440000",
    "660e8400-e29b-41d4-a716-446655440001"
  ],
  "status": "done"
}
```

**Response (200 OK)**:
```json
{
  "updated_count": 2,
  "failed_ids": [],
  "message": "Successfully updated 2 tasks"
}
```

**Partial Success Response (200 OK)**:
```json
{
  "updated_count": 1,
  "failed_ids": ["660e8400-e29b-41d4-a716-446655440001"],
  "message": "Updated 1 task, 1 task failed (not found or access denied)"
}
```

**Error Responses**:
- `400 Bad Request`: Empty task_ids array or invalid status
- `401 Unauthorized`: Missing or invalid JWT
- `503 Service Unavailable`: Database unavailable

---

## Database Schema Requirements

### Tasks Table

```sql
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'todo',
    priority task_priority NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT description_length CHECK (LENGTH(description) <= 2000)
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_user_priority ON tasks(user_id, priority);

-- Full-text search index
CREATE INDEX idx_tasks_search ON tasks USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## Security Requirements

### SEC-TASK-001: User Isolation
- **MUST** filter all queries by user_id from JWT
- **MUST NEVER** allow cross-user task access
- **MUST** return 404 (not 403) for unauthorized access to prevent enumeration
- **MUST** validate user_id on every operation (create, read, update, delete)

### SEC-TASK-002: Input Validation
- **MUST** validate title length (1-200 characters)
- **MUST** validate description length (max 2000 characters)
- **MUST** validate status enum (todo, in_progress, done)
- **MUST** validate priority enum (low, medium, high)
- **MUST** validate due_date format (ISO 8601)
- **MUST** sanitize search queries to prevent SQL injection
- **MUST** use parameterized queries for all database operations

### SEC-TASK-003: Authentication
- **MUST** require valid JWT on all endpoints
- **MUST** extract user_id from JWT (never from request body)
- **MUST** return 401 for missing or invalid JWT

### SEC-TASK-004: Rate Limiting
- **MUST** limit task creation: 100 per hour per user
- **MUST** limit bulk operations: 10 per minute per user
- **MUST** limit search queries: 60 per minute per user

---

## Non-Functional Requirements

### Performance (NFR-TASK-P)
- **NFR-TASK-P-001**: Task creation completes in < 200ms (p95)
- **NFR-TASK-P-002**: Task list query completes in < 100ms (p95) for 1000 tasks
- **NFR-TASK-P-003**: Single task query completes in < 50ms (p95)
- **NFR-TASK-P-004**: Task update completes in < 150ms (p95)
- **NFR-TASK-P-005**: Task deletion completes in < 100ms (p95)
- **NFR-TASK-P-006**: Search query completes in < 200ms (p95)
- **NFR-TASK-P-007**: Bulk update completes in < 500ms for 100 tasks (p95)

### Scalability (NFR-TASK-S)
- **NFR-TASK-S-001**: Support 10,000 tasks per user
- **NFR-TASK-S-002**: Support 1,000 concurrent task operations
- **NFR-TASK-S-003**: Horizontal scaling without code changes
- **NFR-TASK-S-004**: Database connection pooling (10-20 connections)

### Reliability (NFR-TASK-R)
- **NFR-TASK-R-001**: 99.9% uptime for task endpoints
- **NFR-TASK-R-002**: Graceful degradation on database failures
- **NFR-TASK-R-003**: Automatic retry for transient failures
- **NFR-TASK-R-004**: Data consistency (no orphaned tasks)

### Observability (NFR-TASK-O)
- **NFR-TASK-O-001**: Structured logging with correlation IDs
- **NFR-TASK-O-002**: Log all task operations (create, update, delete)
- **NFR-TASK-O-003**: Metrics: operation latency, error rate, task count per user
- **NFR-TASK-O-004**: Alerts: high error rate, slow queries, database connection issues
- **NFR-TASK-O-005**: Distributed tracing for task operations

### Accessibility (NFR-TASK-A)
- **NFR-TASK-A-001**: WCAG 2.1 AA compliance for task UI
- **NFR-TASK-A-002**: Keyboard navigation support (arrow keys, Enter, Escape)
- **NFR-TASK-A-003**: Screen reader compatibility (ARIA labels, live regions)
- **NFR-TASK-A-004**: Clear error messages announced to assistive tech
- **NFR-TASK-A-005**: Color contrast ratios ≥ 4.5:1

---

## Testing Requirements

### Unit Tests
- ✅ Task validation logic (title, description, status, priority, due_date)
- ✅ User isolation enforcement
- ✅ Search query sanitization
- ✅ Pagination logic
- ✅ Sorting logic

### Integration Tests
- ✅ Create task flow
- ✅ List tasks with filters and sorting
- ✅ View single task
- ✅ Update task flow
- ✅ Delete task flow
- ✅ Bulk update flow
- ✅ Search tasks flow
- ✅ User isolation (cannot access other users' tasks)

### Performance Tests
- ✅ List query performance with 1000 tasks
- ✅ Search query performance with 1000 tasks
- ✅ Bulk update performance with 100 tasks
- ✅ Concurrent operations (1000 users)

### Security Tests
- ✅ SQL injection prevention
- ✅ Cross-user access prevention
- ✅ JWT validation on all endpoints
- ✅ Input validation enforcement
- ✅ Rate limiting enforcement

---

## Dependencies

### External Libraries
- **FastAPI**: Web framework
- **SQLAlchemy**: ORM
- **Pydantic**: Data validation
- **asyncpg**: PostgreSQL driver

### Database
- **PostgreSQL 14+**: Required for ENUM types and full-text search

### Authentication
- **JWT tokens**: Required for user identification

---

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Cross-user data access | Critical | Medium | Enforce user_id filtering on all queries, automated tests, code reviews |
| Slow queries with large datasets | High | Medium | Database indexes on user_id, status, priority, due_date; query optimization |
| SQL injection | Critical | Low | Parameterized queries, input validation, security testing |
| Concurrent update conflicts | Medium | Low | Optimistic concurrency control (Phase III), last-write-wins acceptable for Phase II |
| Database connection exhaustion | High | Low | Connection pooling, connection limits, monitoring |

---

## Future Enhancements (Out of Scope for Phase II)

- **Phase III**: Task tags and categories
- **Phase III**: Task attachments (files, images)
- **Phase III**: Task comments and activity log
- **Phase III**: Recurring tasks
- **Phase III**: Task templates
- **Phase III**: Subtasks and task dependencies
- **Phase IV**: Task sharing and collaboration
- **Phase IV**: Team workspaces
- **Phase V**: Real-time task updates (WebSocket)
- **Phase V**: Task analytics and insights

---

## Related Specifications

- **Overview**: [Phase II Overview](../overview.md)
- **Authentication**: [Authentication System](./authentication.md)
- **API Endpoints**: [REST API Endpoints](../api/rest-endpoints.md)
- **Database Schema**: [Database Schema](../database/schema.md)
- **UI Pages**: [Dashboard](../ui/dashboard.md)
- **Constitution**: [Phase II Constitution](../../../.specify/memory/constitution.md)

---

## Approval and Sign-off

**Specification Status**: Draft
**Constitutional Compliance**: ✅ Verified
**Security Review**: Pending
**Ready for Planning**: Pending validation checklist

**Next Steps**:
1. Review and validate this specification
2. Run `/sp.clarify` if clarifications needed
3. Run `/sp.plan` to create implementation plan
4. Run `/sp.tasks` to generate task breakdown
