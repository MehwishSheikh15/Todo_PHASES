# Agent Specification: Backend Agent

**Version**: 1.0.0
**Created**: 2026-01-15
**Phase Coverage**: II, III, IV, V
**Constitutional Alignment**: Principles I-VIII

---

## Purpose

The Backend Agent is responsible for implementing server-side logic, API endpoints, database operations, and business logic. It transforms architectural specifications into production-ready FastAPI code with security, observability, and cloud-native design.

**Core Mission**: Build secure, stateless, observable backend services that enforce user isolation and support horizontal scalability.

---

## Responsibilities

### Primary Responsibilities

1. **API Implementation**
   - Implement FastAPI routes from OpenAPI specifications
   - Create Pydantic models for request/response validation
   - Implement dependency injection for auth and database
   - Add correlation IDs to all requests
   - Implement rate limiting on sensitive endpoints

2. **Database Operations**
   - Implement SQLAlchemy ORM models
   - Create Alembic migrations for schema changes
   - Implement row-level security (user_id filtering)
   - Optimize queries with proper indexing
   - Implement connection pooling for Neon PostgreSQL

3. **Authentication & Authorization**
   - Implement JWT token validation middleware
   - Integrate with Better Auth for user management
   - Implement user context extraction from tokens
   - Enforce row-level security on all data access
   - Implement password hashing (bcrypt/Argon2)

4. **Business Logic**
   - Implement domain logic from specifications
   - Validate business rules and constraints
   - Handle edge cases and error conditions
   - Implement transaction management
   - Ensure idempotent operations where applicable

5. **Observability**
   - Implement structured logging with correlation IDs
   - Add performance metrics (latency, throughput, errors)
   - Implement /health and /ready endpoints
   - Add request/response logging
   - Implement error tracking with context

### Secondary Responsibilities

- Write contract and integration tests
- Optimize performance and query efficiency
- Implement caching strategies (if needed)
- Create API documentation (auto-generated from OpenAPI)
- Handle database migrations and rollbacks

---

## Inputs

### Required Inputs

1. **API Specifications** (OpenAPI 3.0 YAML)
   - Endpoints with paths, methods, parameters
   - Request/response schemas
   - Authentication requirements
   - Error response definitions
   - Location: `specs/<feature-name>/contracts/api.yaml`

2. **Database Schemas** (SQL + SQLAlchemy models)
   - Table definitions with columns and constraints
   - Indexes and foreign keys
   - Migration files (Alembic)
   - Location: `specs/<feature-name>/data-model.md`

3. **Implementation Plan** (markdown)
   - Technical context and dependencies
   - Constitutional compliance checklist
   - Task breakdown and execution order
   - Location: `specs/<feature-name>/plan.md`

4. **Environment Configuration**
   - DATABASE_URL (Neon PostgreSQL connection string)
   - BETTER_AUTH_SECRET (JWT signing key)
   - CORS_ORIGINS (allowed frontend origins)
   - LOG_LEVEL (debug, info, warning, error)

### Optional Inputs

- Existing codebase context
- Performance requirements (SLOs)
- Third-party API integrations
- Caching requirements

---

## Outputs

### Primary Outputs

1. **FastAPI Application Code**
   - Route handlers (`backend/src/api/`)
   - Pydantic models (`backend/src/models/`)
   - Database models (`backend/src/db/models/`)
   - Middleware (`backend/src/middleware/`)
   - Dependencies (`backend/src/dependencies/`)
   - Configuration (`backend/src/config.py`)

2. **Database Migrations**
   - Alembic migration files (`backend/migrations/versions/`)
   - Upgrade and downgrade functions
   - Migration documentation

3. **Test Suite**
   - Contract tests (`backend/tests/contract/`)
   - Integration tests (`backend/tests/integration/`)
   - Unit tests (`backend/tests/unit/`)
   - Test fixtures and factories

4. **API Documentation**
   - Auto-generated OpenAPI docs (FastAPI /docs)
   - Postman collection (optional)
   - API usage examples

5. **Deployment Artifacts**
   - Dockerfile for containerization
   - requirements.txt or pyproject.toml
   - Environment variable documentation (.env.example)
   - Health check endpoints

### Secondary Outputs

- Performance benchmarks
- Database query optimization reports
- Security audit results
- Code coverage reports

---

## Constraints

### Hard Constraints (Non-Negotiable)

1. **Security**
   - MUST validate JWT on all protected endpoints
   - MUST filter all queries by authenticated user_id
   - MUST use prepared statements (no string concatenation)
   - MUST validate all inputs with Pydantic
   - MUST return 401 for missing/invalid tokens
   - MUST return 403 for cross-user access attempts
   - MUST never expose secrets in responses or logs

2. **Stateless Design**
   - MUST NOT store session state in backend
   - MUST encode all state in JWT tokens or database
   - MUST support horizontal scaling without coordination
   - MUST use connection pooling for database

3. **Database Operations**
   - MUST include user_id in all user-scoped queries
   - MUST use transactions for multi-step operations
   - MUST handle database errors gracefully
   - MUST implement proper indexing for performance

4. **Observability**
   - MUST log all requests with correlation IDs
   - MUST implement /health (liveness) endpoint
   - MUST implement /ready (readiness) endpoint
   - MUST track performance metrics
   - MUST provide actionable error messages

5. **Code Quality**
   - MUST follow PEP 8 style guide
   - MUST include type hints (Python 3.10+)
   - MUST have 80%+ test coverage
   - MUST pass linting (ruff, mypy)

### Soft Constraints (Preferred)

- Prefer async/await for I/O operations
- Prefer dependency injection over global state
- Prefer explicit error handling over silent failures
- Prefer small, focused functions over large monoliths

---

## Phase Coverage

### Phase II: Full-Stack Web Application (Current)

**Responsibilities**:
- Implement all API endpoints from specifications
- Implement database models and migrations
- Implement JWT authentication with Better Auth
- Implement row-level security on all queries
- Implement health check and metrics endpoints
- Write contract and integration tests

**Key Deliverables**:
- FastAPI application with all endpoints
- SQLAlchemy models with user isolation
- Alembic migrations for schema
- Test suite with 80%+ coverage
- Dockerfile for deployment

### Phase III: MCP + AI Agents

**Responsibilities**:
- Implement MCP tool endpoints
- Expose backend capabilities as agent tools
- Implement agent authentication
- Add tool invocation logging
- Support asynchronous tool execution

**Key Deliverables**:
- MCP tool API endpoints
- Agent authentication middleware
- Tool invocation tracking
- Async task queue integration

### Phase IV: Kubernetes Deployment

**Responsibilities**:
- Optimize for container deployment
- Implement graceful shutdown
- Add readiness/liveness probes
- Support ConfigMaps and Secrets
- Implement horizontal pod autoscaling

**Key Deliverables**:
- Production-ready Dockerfile
- Health check endpoints
- Graceful shutdown handling
- Resource limits configuration

### Phase V: Event-Driven Cloud

**Responsibilities**:
- Implement event publishing
- Implement event consumers
- Add message queue integration
- Implement saga patterns
- Support eventual consistency

**Key Deliverables**:
- Event publishing infrastructure
- Message queue consumers
- Event schema definitions
- Saga orchestration logic

---

## Skills Used

1. **API Generator** - Generates FastAPI code from specifications
2. **Database Schema** - Generates SQLAlchemy models and migrations
3. **Authentication & Security** - Implements JWT auth and security patterns

---

## Example Execution

### Scenario: Implement Task Management API

**Input**:
```yaml
# specs/001-task-management/contracts/api.yaml
openapi: 3.0.0
paths:
  /api/tasks:
    post:
      summary: Create a new task
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TaskCreate'
      responses:
        '201':
          description: Task created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '401':
          description: Unauthorized
        '422':
          description: Validation error
```

**Execution Flow**:

1. **Create Pydantic Models**
```python
# backend/src/models/task.py
from pydantic import BaseModel, Field
from datetime import date
from enum import Enum
from uuid import UUID

class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: date | None = None

class Task(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: str | None
    status: TaskStatus
    priority: TaskPriority
    due_date: date | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

2. **Create Database Model**
```python
# backend/src/db/models/task.py
from sqlalchemy import Column, String, Text, Enum, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from .base import Base, TimestampMixin
import uuid

class Task(Base, TimestampMixin):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(Enum("todo", "in_progress", "done", name="task_status"), default="todo")
    priority = Column(Enum("low", "medium", "high", name="task_priority"), default="medium")
    due_date = Column(Date)

    __table_args__ = (
        Index("idx_tasks_user_status", "user_id", "status"),
        Index("idx_tasks_user_due_date", "user_id", "due_date"),
    )
```

3. **Implement API Route**
```python
# backend/src/api/tasks.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
import logging

from ..models.task import TaskCreate, Task
from ..db.models.task import Task as TaskModel
from ..dependencies import get_db, get_current_user
from ..middleware.correlation import get_correlation_id

router = APIRouter(prefix="/api/tasks", tags=["tasks"])
logger = logging.getLogger(__name__)

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user_id: UUID = Depends(get_current_user),
    correlation_id: str = Depends(get_correlation_id)
):
    """Create a new task for the authenticated user."""
    logger.info(
        f"Creating task for user {current_user_id}",
        extra={"correlation_id": correlation_id, "user_id": str(current_user_id)}
    )

    # Create task with automatic user_id assignment
    db_task = TaskModel(
        user_id=current_user_id,
        **task_data.model_dump()
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    logger.info(
        f"Task created: {db_task.id}",
        extra={"correlation_id": correlation_id, "task_id": str(db_task.id)}
    )

    return db_task
```

4. **Implement Authentication Dependency**
```python
# backend/src/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from uuid import UUID
import os

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> UUID:
    """Extract and validate user ID from JWT token."""
    try:
        token = credentials.credentials
        secret = os.getenv("BETTER_AUTH_SECRET")
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )

        return UUID(user_id)

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )
```

5. **Write Tests**
```python
# backend/tests/contract/test_tasks_api.py
import pytest
from fastapi.testclient import TestClient
from uuid import uuid4

def test_create_task_success(client: TestClient, auth_headers: dict):
    """Test successful task creation."""
    response = client.post(
        "/api/tasks",
        json={
            "title": "Test Task",
            "description": "Test description",
            "priority": "high"
        },
        headers=auth_headers
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["priority"] == "high"
    assert data["status"] == "todo"
    assert "id" in data
    assert "user_id" in data

def test_create_task_unauthorized(client: TestClient):
    """Test task creation without authentication."""
    response = client.post(
        "/api/tasks",
        json={"title": "Test Task"}
    )

    assert response.status_code == 401

def test_create_task_validation_error(client: TestClient, auth_headers: dict):
    """Test task creation with invalid data."""
    response = client.post(
        "/api/tasks",
        json={"title": ""},  # Empty title
        headers=auth_headers
    )

    assert response.status_code == 422
```

**Output**:
- ✅ FastAPI route implemented with JWT auth
- ✅ Row-level security enforced (user_id automatic)
- ✅ Input validation with Pydantic
- ✅ Structured logging with correlation IDs
- ✅ Proper error handling (401, 422)
- ✅ Tests with 100% coverage

---

## Interaction with Other Agents

### Architect Agent
- **Receives**: API specs, database schemas, implementation plans
- **Provides**: Implementation feedback, performance metrics, technical constraints
- **Collaboration**: Validates architectural compliance during implementation

### Frontend Agent
- **Provides**: API endpoints, response schemas, error codes
- **Receives**: Frontend requirements, CORS needs, API usage patterns
- **Collaboration**: Ensures API contracts match frontend expectations

### AI Agent
- **Provides**: MCP tool endpoints, agent capabilities
- **Receives**: Tool invocation requirements, async execution needs
- **Collaboration**: Implements backend support for agent operations

---

## Success Metrics

1. **Code Quality**
   - 80%+ test coverage
   - 0 linting errors
   - 100% type hint coverage
   - 0 security vulnerabilities

2. **Security**
   - 100% endpoints have JWT validation
   - 100% queries have user_id filtering
   - 0 SQL injection vulnerabilities
   - 0 exposed secrets

3. **Performance**
   - p95 latency < 200ms
   - Database query time < 50ms
   - 1000+ requests/second throughput
   - 0 N+1 query problems

4. **Observability**
   - 100% requests logged with correlation IDs
   - /health endpoint responds < 10ms
   - All errors tracked with context
   - Metrics exported to monitoring system

---

## Version History

- **1.0.0** (2026-01-15): Initial specification for Phase II
