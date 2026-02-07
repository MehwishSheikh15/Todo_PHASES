# REST API Endpoints Specification

## Purpose
This document defines the complete REST API for the Phase II Todo application. It specifies all endpoints, request/response formats, authentication requirements, and error handling patterns for the backend service.

## Base URL
```
https://api.yourdomain.com/v1
```

## Authentication
All protected endpoints require JWT authentication in the format:
```
Authorization: Bearer <JWT_TOKEN>
```

## Common Headers
- `Content-Type: application/json`
- `Accept: application/json`
- `Authorization: Bearer <JWT_TOKEN>` (for protected endpoints)

## Endpoint Definitions

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "displayName": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "displayName": "John Doe",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-string"
}
```

**Validation:**
- Email must be valid format
- Password must be 8+ characters with uppercase, lowercase, number, symbol
- Email must be unique
- displayName is optional, max 100 characters

**Errors:**
- 400: Invalid input format
- 409: Email already exists
- 422: Validation errors

#### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "displayName": "John Doe",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-string"
}
```

**Errors:**
- 400: Invalid input format
- 401: Invalid credentials
- 429: Rate limit exceeded

#### POST /auth/logout
Logout user (client-side token invalidation).

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

### Task Management Endpoints

#### GET /tasks
Retrieve all tasks for the authenticated user.

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `status`: Filter by status (todo|in-progress|done)
- `priority`: Filter by priority (high|medium|low)
- `category`: Filter by category
- `sortBy`: Sort by field (createdAt|dueDate|priority|title) - default: createdAt
- `order`: Sort order (asc|desc) - default: desc
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response (200 OK):**
```json
{
  "tasks": [
    {
      "id": "uuid-string",
      "title": "Complete project proposal",
      "description": "Finish the project proposal document",
      "status": "todo",
      "priority": "high",
      "category": "work",
      "dueDate": "2023-12-31T23:59:59.000Z",
      "completedAt": null,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "userId": "user-uuid-string"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 45,
    "itemsPerPage": 20
  }
}
```

#### GET /tasks/{taskId}
Retrieve a specific task by ID.

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameter:**
- `taskId`: UUID of the task to retrieve

**Response (200 OK):**
```json
{
  "task": {
    "id": "uuid-string",
    "title": "Complete project proposal",
    "description": "Finish the project proposal document",
    "status": "todo",
    "priority": "high",
    "category": "work",
    "dueDate": "2023-12-31T23:59:59.000Z",
    "completedAt": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "userId": "user-uuid-string"
  }
}
```

**Errors:**
- 401: Missing or invalid token
- 403: Task belongs to another user
- 404: Task not found

#### POST /tasks
Create a new task.

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "title": "Complete project proposal",
  "description": "Finish the project proposal document",
  "priority": "high",
  "category": "work",
  "dueDate": "2023-12-31T23:59:59.000Z"
}
```

**Response (201 Created):**
```json
{
  "task": {
    "id": "uuid-string",
    "title": "Complete project proposal",
    "description": "Finish the project proposal document",
    "status": "todo",
    "priority": "high",
    "category": "work",
    "dueDate": "2023-12-31T23:59:59.000Z",
    "completedAt": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "userId": "user-uuid-string"
  }
}
```

**Validation:**
- Title is required, max 200 characters
- Description is optional, max 1000 characters
- Priority must be high, medium, or low
- Status defaults to 'todo'
- Due date must be valid ISO 8601 format

**Errors:**
- 400: Invalid input format
- 401: Missing or invalid token
- 422: Validation errors

#### PUT /tasks/{taskId}
Update an existing task completely.

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameter:**
- `taskId`: UUID of the task to update

**Request Body:**
```json
{
  "title": "Updated project proposal",
  "description": "Revised project proposal document",
  "status": "in-progress",
  "priority": "high",
  "category": "work",
  "dueDate": "2023-12-31T23:59:59.000Z"
}
```

**Response (200 OK):**
```json
{
  "task": {
    "id": "uuid-string",
    "title": "Updated project proposal",
    "description": "Revised project proposal document",
    "status": "in-progress",
    "priority": "high",
    "category": "work",
    "dueDate": "2023-12-31T23:59:59.000Z",
    "completedAt": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T10:30:00.000Z",
    "userId": "user-uuid-string"
  }
}
```

**Errors:**
- 400: Invalid input format
- 401: Missing or invalid token
- 403: Task belongs to another user
- 404: Task not found
- 422: Validation errors

#### PATCH /tasks/{taskId}
Partially update an existing task.

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameter:**
- `taskId`: UUID of the task to update

**Request Body:**
```json
{
  "status": "done",
  "completedAt": "2023-01-02T15:30:00.000Z"
}
```

**Response (200 OK):**
```json
{
  "task": {
    "id": "uuid-string",
    "title": "Complete project proposal",
    "description": "Finish the project proposal document",
    "status": "done",
    "priority": "high",
    "category": "work",
    "dueDate": "2023-12-31T23:59:59.000Z",
    "completedAt": "2023-01-02T15:30:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T15:30:00.000Z",
    "userId": "user-uuid-string"
  }
}
```

**Errors:**
- 400: Invalid input format
- 401: Missing or invalid token
- 403: Task belongs to another user
- 404: Task not found
- 422: Validation errors

#### DELETE /tasks/{taskId}
Delete a specific task.

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameter:**
- `taskId`: UUID of the task to delete

**Response (204 No Content):**
```
(No response body)
```

**Errors:**
- 401: Missing or invalid token
- 403: Task belongs to another user
- 404: Task not found

### Health Check Endpoint

#### GET /health
Check the health status of the API.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Common Error Responses

### 400 Bad Request
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid request parameters",
    "details": [
      "Field 'email' is required",
      "Field 'password' must be at least 8 characters"
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied to this resource"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Requested resource not found"
  }
}
```

### 422 Unprocessable Entity
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      "Priority must be one of: high, medium, low",
      "Due date must be in the future"
    ]
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

## Rate Limiting
- Authentication endpoints: 5 requests per IP per hour
- API endpoints: 1000 requests per user per hour
- Excessive requests return 429 Too Many Requests

## Security Headers
All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## CORS Policy
- Allowed origins: frontend domain(s)
- Allowed methods: GET, POST, PUT, PATCH, DELETE
- Allowed headers: Content-Type, Authorization
- Credentials allowed: true

## Request Size Limits
- Maximum request body size: 10MB
- Maximum file upload size: 5MB (if applicable in future)

## Response Compression
- Responses compressed using gzip when >1KB
- Client must accept gzip encoding

## Versioning
- API version in URL path: `/v1/`
- Backward compatibility maintained for minor versions
- Breaking changes require new major version