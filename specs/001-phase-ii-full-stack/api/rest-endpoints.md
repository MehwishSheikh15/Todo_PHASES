# Technical Specification: REST API Endpoints

**Specification ID**: `001-phase-ii-full-stack-api`
**Version**: 1.0.0
**Created**: 2026-01-15
**Status**: Specification
**Priority**: P0 (Critical - System Interface)
**Constitutional Compliance**: ✅ Verified

---

## Purpose

Define the complete REST API contract for the Phase II Todo web application, including all authentication and task management endpoints. This specification serves as the authoritative API reference for frontend developers, backend implementers, and API consumers.

**Core Mission**: Provide a clear, consistent, and secure REST API that follows industry best practices, OpenAPI 3.0 standards, and constitutional requirements for security, observability, and cloud-native design.

---

## Constitutional Alignment

| Principle | Implementation |
|-----------|----------------|
| **I. Spec > Code** | Complete API contract before implementation |
| **II. Architecture > Implementation** | ADR for REST design, versioning strategy, error handling |
| **III. Security by Default** | JWT on all protected endpoints, HTTPS only, rate limiting |
| **IV. Stateless Services** | No server-side sessions, all state in JWT or query params |
| **V. User Isolation Guaranteed** | All endpoints filter by user_id from JWT |
| **VI. Cloud-Native First** | Stateless, horizontally scalable, health checks |
| **VII. Reusable Intelligence** | OpenAPI spec enables code generation and tooling |
| **VIII. Observability Ready** | Correlation IDs, structured errors, health endpoints |
| **IX. UI is Product Feature** | Clear error messages, consistent responses, developer experience |

---

## API Design Principles

### REST Conventions
1. **Resource-Oriented**: URLs represent resources (nouns), not actions (verbs)
2. **HTTP Methods**: GET (read), POST (create), PATCH (partial update), DELETE (delete)
3. **Status Codes**: Semantic HTTP status codes (200, 201, 400, 401, 404, 500, etc.)
4. **JSON Format**: All requests and responses use JSON (Content-Type: application/json)
5. **Idempotency**: GET, PUT, DELETE are idempotent; POST is not

### Naming Conventions
- **URLs**: Lowercase, hyphen-separated (kebab-case): `/api/auth/password-reset`
- **JSON Keys**: Snake_case: `user_id`, `created_at`, `access_token`
- **Enums**: Lowercase, underscore-separated: `todo`, `in_progress`, `done`

### Versioning Strategy
- **Phase II**: No versioning (v1 implicit in base path `/api`)
- **Phase III+**: Version in URL path: `/api/v2/tasks` or Accept header: `application/vnd.api+json; version=2`

### Authentication
- **Protected Endpoints**: Require `Authorization: Bearer <jwt_token>` header
- **Public Endpoints**: `/api/auth/register`, `/api/auth/login`, `/health`, `/ready`
- **Token Expiry**: Access tokens expire after 1 hour, refresh tokens after 7 days

### Rate Limiting
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Response**: 429 Too Many Requests with `Retry-After` header

### Error Handling
- **Consistent Format**: All errors return JSON with `error`, `message`, `details`, `correlation_id`
- **Validation Errors**: Include field-level errors in `details` array
- **Correlation IDs**: Every response includes `X-Correlation-ID` header for tracing

---

## Base URL

### Development
```
http://localhost:8000/api
```

### Production
```
https://api.todo-app.example.com/api
```

---

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Authentication**: None (public endpoint)

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Request Schema**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| email | string | Yes | Valid email format (RFC 5322) |
| password | string | Yes | 8+ chars, uppercase, number, special char |

**Success Response (201 Created)**:
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2026-01-15T10:30:00Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzA1MzE1ODAwLCJleHAiOjE3MDUzMTk0MDB9.signature",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTcwNTMxNTgwMCwiZXhwIjoxNzA1OTIwNjAwfQ.signature",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Error Responses**:

**400 Bad Request** - Invalid input:
```json
{
  "error": "validation_error",
  "message": "Request validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter"
    }
  ],
  "correlation_id": "abc-123-def-456"
}
```

**409 Conflict** - Email already exists:
```json
{
  "error": "email_exists",
  "message": "An account with this email already exists",
  "correlation_id": "abc-123-def-456"
}
```

**429 Too Many Requests** - Rate limit exceeded:
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many registration attempts. Please try again later.",
  "retry_after": 3600,
  "correlation_id": "abc-123-def-456"
}
```

**503 Service Unavailable** - Database unavailable:
```json
{
  "error": "service_unavailable",
  "message": "Service temporarily unavailable. Please try again later.",
  "correlation_id": "abc-123-def-456"
}
```

**Rate Limit**: 3 requests per hour per IP

---

### POST /api/auth/login

Authenticate user and receive JWT tokens.

**Authentication**: None (public endpoint)

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK)**:
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Error Responses**:

**401 Unauthorized** - Invalid credentials:
```json
{
  "error": "invalid_credentials",
  "message": "Invalid email or password",
  "correlation_id": "abc-123-def-456"
}
```

**403 Forbidden** - Account locked:
```json
{
  "error": "account_locked",
  "message": "Account locked due to too many failed login attempts. Please reset your password or try again in 15 minutes.",
  "locked_until": "2026-01-15T11:00:00Z",
  "correlation_id": "abc-123-def-456"
}
```

**Rate Limit**: 5 requests per minute per IP

---

### POST /api/auth/refresh

Refresh access token using refresh token.

**Authentication**: None (refresh token in body)

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Error Responses**:

**401 Unauthorized** - Invalid or expired refresh token:
```json
{
  "error": "invalid_token",
  "message": "Invalid or expired refresh token. Please log in again.",
  "correlation_id": "abc-123-def-456"
}
```

**Rate Limit**: 10 requests per minute per user

---

### POST /api/auth/password-reset/request

Request password reset email.

**Authentication**: None (public endpoint)

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response (200 OK)**:
```json
{
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

**Note**: Generic message returned regardless of whether email exists (prevents user enumeration).

**Rate Limit**: 3 requests per hour per email

---

### POST /api/auth/password-reset/confirm

Complete password reset with token.

**Authentication**: None (reset token in body)

**Request Body**:
```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "new_password": "NewSecurePass123!"
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Password reset successful. Please log in with your new password."
}
```

**Error Responses**:

**400 Bad Request** - Invalid token or weak password:
```json
{
  "error": "invalid_request",
  "message": "Invalid or expired reset token",
  "correlation_id": "abc-123-def-456"
}
```

---

### POST /api/auth/logout

Logout user (client-side token removal, optional server-side revocation).

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Logged out successfully"
}
```

---

## Task Management Endpoints

### POST /api/tasks

Create a new task.

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "title": "Review API documentation",
  "description": "Go through the REST API docs and update examples",
  "priority": "high",
  "due_date": "2026-01-19T17:00:00Z",
  "status": "todo"
}
```

**Request Schema**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | 1-200 characters, not empty |
| description | string | No | Max 2000 characters |
| priority | enum | No | low, medium, high (default: medium) |
| due_date | string | No | ISO 8601 format |
| status | enum | No | todo, in_progress, done (default: todo) |

**Success Response (201 Created)**:
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

**400 Bad Request** - Validation error:
```json
{
  "error": "validation_error",
  "message": "Request validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required and cannot be empty"
    },
    {
      "field": "priority",
      "message": "Priority must be one of: low, medium, high"
    }
  ],
  "correlation_id": "abc-123-def-456"
}
```

**401 Unauthorized** - Missing or invalid JWT:
```json
{
  "error": "unauthorized",
  "message": "Authentication required. Please provide a valid access token.",
  "correlation_id": "abc-123-def-456"
}
```

**Rate Limit**: 100 requests per hour per user

---

### GET /api/tasks

List all tasks for authenticated user with filtering, sorting, and pagination.

**Authentication**: Required (Bearer token)

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter by status (comma-separated: todo,in_progress,done) |
| priority | string | No | Filter by priority (comma-separated: low,medium,high) |
| search | string | No | Search in title and description (min 2 characters) |
| sort_by | string | No | Sort field: due_date, priority, status, created_at, updated_at, title (default: due_date) |
| sort_order | string | No | Sort order: asc, desc (default: asc) |
| page | integer | No | Page number (default: 1) |
| page_size | integer | No | Items per page (default: 20, max: 100) |

**Example Request**:
```
GET /api/tasks?status=todo,in_progress&priority=high&sort_by=due_date&sort_order=asc&page=1&page_size=20
```

**Success Response (200 OK)**:
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
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Fix authentication bug",
      "description": "Investigate and fix JWT token expiry issue",
      "status": "in_progress",
      "priority": "high",
      "due_date": "2026-01-16T17:00:00Z",
      "created_at": "2026-01-14T09:00:00Z",
      "updated_at": "2026-01-15T08:00:00Z"
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

**Empty Response (200 OK)**:
```json
{
  "tasks": [],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_count": 0,
    "total_pages": 0
  }
}
```

**Error Responses**:

**400 Bad Request** - Invalid query parameters:
```json
{
  "error": "validation_error",
  "message": "Invalid query parameters",
  "details": [
    {
      "field": "sort_by",
      "message": "Invalid sort field. Must be one of: due_date, priority, status, created_at, updated_at, title"
    }
  ],
  "correlation_id": "abc-123-def-456"
}
```

**Rate Limit**: 60 requests per minute per user

---

### GET /api/tasks/{task_id}

Get a single task by ID.

**Authentication**: Required (Bearer token)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| task_id | UUID | Yes | Task identifier |

**Success Response (200 OK)**:
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

**400 Bad Request** - Invalid UUID format:
```json
{
  "error": "validation_error",
  "message": "Invalid task ID format. Must be a valid UUID.",
  "correlation_id": "abc-123-def-456"
}
```

**404 Not Found** - Task not found or doesn't belong to user:
```json
{
  "error": "not_found",
  "message": "Task not found",
  "correlation_id": "abc-123-def-456"
}
```

**Rate Limit**: 120 requests per minute per user

---

### PATCH /api/tasks/{task_id}

Update a task (partial update).

**Authentication**: Required (Bearer token)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| task_id | UUID | Yes | Task identifier |

**Request Body** (all fields optional):
```json
{
  "title": "Review and update API documentation",
  "status": "in_progress",
  "priority": "medium"
}
```

**Success Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Review and update API documentation",
  "description": "Go through the REST API docs and update examples",
  "status": "in_progress",
  "priority": "medium",
  "due_date": "2026-01-19T17:00:00Z",
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-01-15T11:45:00Z"
}
```

**Error Responses**:

**400 Bad Request** - No fields provided or validation error:
```json
{
  "error": "validation_error",
  "message": "At least one field must be provided for update",
  "correlation_id": "abc-123-def-456"
}
```

**404 Not Found** - Task not found:
```json
{
  "error": "not_found",
  "message": "Task not found",
  "correlation_id": "abc-123-def-456"
}
```

**Rate Limit**: 100 requests per hour per user

---

### DELETE /api/tasks/{task_id}

Delete a task.

**Authentication**: Required (Bearer token)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| task_id | UUID | Yes | Task identifier |

**Success Response (204 No Content)**:
```
(empty body)
```

**Error Responses**:

**404 Not Found** - Task not found:
```json
{
  "error": "not_found",
  "message": "Task not found",
  "correlation_id": "abc-123-def-456"
}
```

**Rate Limit**: 100 requests per hour per user

---

### POST /api/tasks/bulk-update

Update multiple tasks at once.

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "task_ids": [
    "550e8400-e29b-41d4-a716-446655440000",
    "660e8400-e29b-41d4-a716-446655440001"
  ],
  "status": "done"
}
```

**Request Schema**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| task_ids | array | Yes | Array of UUIDs, min 1, max 100 |
| status | enum | Yes | todo, in_progress, done |

**Success Response (200 OK)**:
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

**400 Bad Request** - Invalid request:
```json
{
  "error": "validation_error",
  "message": "Request validation failed",
  "details": [
    {
      "field": "task_ids",
      "message": "task_ids array cannot be empty"
    }
  ],
  "correlation_id": "abc-123-def-456"
}
```

**Rate Limit**: 10 requests per minute per user

---

## Health Check Endpoints

### GET /health

Basic health check endpoint.

**Authentication**: None (public endpoint)

**Success Response (200 OK)**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

**Unhealthy Response (503 Service Unavailable)**:
```json
{
  "status": "unhealthy",
  "timestamp": "2026-01-15T10:30:00Z",
  "version": "1.0.0",
  "details": {
    "database": "unavailable"
  }
}
```

---

### GET /ready

Readiness check endpoint (checks all dependencies).

**Authentication**: None (public endpoint)

**Success Response (200 OK)**:
```json
{
  "status": "ready",
  "timestamp": "2026-01-15T10:30:00Z",
  "checks": {
    "database": "ok",
    "redis": "ok"
  }
}
```

**Not Ready Response (503 Service Unavailable)**:
```json
{
  "status": "not_ready",
  "timestamp": "2026-01-15T10:30:00Z",
  "checks": {
    "database": "ok",
    "redis": "unavailable"
  }
}
```

---

## Common Response Headers

All API responses include these headers:

| Header | Description | Example |
|--------|-------------|---------|
| X-Correlation-ID | Unique request identifier for tracing | abc-123-def-456 |
| X-RateLimit-Limit | Maximum requests allowed in window | 100 |
| X-RateLimit-Remaining | Requests remaining in current window | 95 |
| X-RateLimit-Reset | Unix timestamp when limit resets | 1705319400 |
| Content-Type | Response content type | application/json |

---

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, POST (non-creation) |
| 201 | Created | Successful POST (resource creation) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Service temporarily unavailable |

---

## Error Response Format

All error responses follow this consistent format:

```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": [
    {
      "field": "field_name",
      "message": "Field-specific error message"
    }
  ],
  "correlation_id": "abc-123-def-456"
}
```

**Fields**:
- `error`: Machine-readable error code (snake_case)
- `message`: Human-readable error description
- `details`: Array of field-level errors (optional, for validation errors)
- `correlation_id`: Unique request identifier for debugging

---

## OpenAPI 3.0 Specification

The complete OpenAPI 3.0 specification will be generated at:
```
specs/001-phase-ii-full-stack/contracts/openapi.yaml
```

This specification can be used for:
- API documentation (Swagger UI, ReDoc)
- Code generation (client SDKs, server stubs)
- API testing (Postman, Insomnia)
- Contract testing
- API mocking

---

## Security Requirements

### SEC-API-001: HTTPS Only
- **MUST** enforce HTTPS in production
- **MUST** redirect HTTP to HTTPS
- **MUST** use TLS 1.2 or higher

### SEC-API-002: Authentication
- **MUST** require JWT on all protected endpoints
- **MUST** validate JWT signature and expiry
- **MUST** return 401 for missing or invalid tokens

### SEC-API-003: Rate Limiting
- **MUST** implement rate limiting on all endpoints
- **MUST** return 429 with Retry-After header
- **MUST** use distributed rate limiting (Redis)

### SEC-API-004: Input Validation
- **MUST** validate all inputs against schema
- **MUST** sanitize inputs to prevent injection
- **MUST** use parameterized queries

### SEC-API-005: CORS
- **MUST** configure CORS for frontend domain
- **MUST** restrict allowed origins in production
- **MUST** include credentials in CORS policy

### SEC-API-006: Security Headers
- **MUST** include security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Content-Security-Policy: default-src 'self'`

---

## Non-Functional Requirements

### Performance (NFR-API-P)
- **NFR-API-P-001**: API response time p95 < 200ms
- **NFR-API-P-002**: Health check response time < 50ms
- **NFR-API-P-003**: Support 1,000 concurrent requests
- **NFR-API-P-004**: Database connection pooling (10-20 connections)

### Reliability (NFR-API-R)
- **NFR-API-R-001**: 99.9% uptime
- **NFR-API-R-002**: Graceful degradation on dependency failures
- **NFR-API-R-003**: Circuit breaker for external services
- **NFR-API-R-004**: Automatic retry for transient failures

### Observability (NFR-API-O)
- **NFR-API-O-001**: Structured logging with correlation IDs
- **NFR-API-O-002**: Request/response logging (sanitized)
- **NFR-API-O-003**: Metrics: latency, throughput, error rate
- **NFR-API-O-004**: Distributed tracing (OpenTelemetry)
- **NFR-API-O-005**: Health check endpoints for monitoring

---

## Testing Requirements

### Contract Tests
- ✅ OpenAPI schema validation
- ✅ Request/response format validation
- ✅ Status code validation
- ✅ Header validation

### Integration Tests
- ✅ End-to-end API flows
- ✅ Authentication flows
- ✅ Error handling
- ✅ Rate limiting

### Performance Tests
- ✅ Load testing (1,000 concurrent users)
- ✅ Stress testing (find breaking point)
- ✅ Latency testing (p95, p99)

### Security Tests
- ✅ Authentication bypass attempts
- ✅ SQL injection prevention
- ✅ XSS prevention
- ✅ CSRF prevention
- ✅ Rate limit enforcement

---

## Related Specifications

- **Overview**: [Phase II Overview](../overview.md)
- **Authentication**: [Authentication System](../features/authentication.md)
- **Task CRUD**: [Task CRUD Operations](../features/task-crud.md)
- **Database Schema**: [Database Schema](../database/schema.md)
- **Constitution**: [Phase II Constitution](../../../.specify/memory/constitution.md)

---

## Approval and Sign-off

**Specification Status**: Draft
**Constitutional Compliance**: ✅ Verified
**OpenAPI Generation**: Pending
**Ready for Implementation**: Pending validation checklist

**Next Steps**:
1. Generate OpenAPI 3.0 YAML specification
2. Review and validate API contract
3. Run `/sp.plan` to create implementation plan
4. Run `/sp.tasks` to generate task breakdown
