# API Contracts: Todo Chatbot Internal Communication

## Backend Health Check Endpoint

### GET /health
**Description**: Health check endpoint to verify backend service status

**Request**:
- Method: GET
- Path: `/health`
- Headers: None required
- Query Parameters: None
- Request Body: None

**Response**:
- Status Code: 200 OK (when healthy)
- Content-Type: application/json
- Response Body:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-19T22:59:00Z",
  "version": "1.0.0"
}
```

**Error Responses**:
- Status Code: 500 Internal Server Error (when unhealthy)
- Content-Type: application/json
- Response Body:
```json
{
  "status": "unhealthy",
  "error": "description of the issue"
}
```

**Usage**: Called by Kubernetes liveness and readiness probes to verify service health.

## Frontend-Backend API Communication

### General Pattern
**Base URL**: `{BACKEND_SERVICE_URL}/api`
**Example**: `http://todo-backend-service:8000/api`

**Headers**:
- Content-Type: application/json (for POST/PUT requests)
- Authorization: Bearer {token} (if authentication required)

### Authentication Endpoints

#### POST /api/auth/login
**Description**: User login endpoint

**Request**:
- Method: POST
- Path: `/api/auth/login`
- Headers: Content-Type: application/json
- Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:
- Status Code: 200 OK
- Content-Type: application/json
- Response Body:
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

#### POST /api/auth/register
**Description**: User registration endpoint

**Request**:
- Method: POST
- Path: `/api/auth/register`
- Headers: Content-Type: application/json
- Request Body:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response**:
- Status Code: 200 OK or 201 Created
- Content-Type: application/json
- Response Body:
```json
{
  "id": "number",
  "username": "string",
  "email": "string"
}
```

### Task Management Endpoints

#### GET /api/tasks
**Description**: Retrieve all tasks for the authenticated user

**Request**:
- Method: GET
- Path: `/api/tasks`
- Headers: Authorization: Bearer {token}

**Response**:
- Status Code: 200 OK
- Content-Type: application/json
- Response Body:
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "completed": "boolean",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

#### POST /api/tasks
**Description**: Create a new task

**Request**:
- Method: POST
- Path: `/api/tasks`
- Headers: Content-Type: application/json, Authorization: Bearer {token}
- Request Body:
```json
{
  "title": "string",
  "description": "string"
}
```

**Response**:
- Status Code: 201 Created
- Content-Type: application/json
- Response Body:
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### PUT /api/tasks/{task_id}
**Description**: Update an existing task

**Request**:
- Method: PUT
- Path: `/api/tasks/{task_id}`
- Headers: Content-Type: application/json, Authorization: Bearer {token}
- Request Body:
```json
{
  "title": "string",
  "description": "string",
  "completed": "boolean"
}
```

**Response**:
- Status Code: 200 OK
- Content-Type: application/json
- Response Body:
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### DELETE /api/tasks/{task_id}
**Description**: Delete a task

**Request**:
- Method: DELETE
- Path: `/api/tasks/{task_id}`
- Headers: Authorization: Bearer {token}

**Response**:
- Status Code: 204 No Content

### Chatbot Endpoints

#### POST /api/chat
**Description**: Send a message to the chatbot and receive a response

**Request**:
- Method: POST
- Path: `/api/chat`
- Headers: Content-Type: application/json, Authorization: Bearer {token}
- Request Body:
```json
{
  "message": "string"
}
```

**Response**:
- Status Code: 200 OK
- Content-Type: application/json
- Response Body:
```json
{
  "response": "string",
  "action": "string",
  "task_data": {}
}
```

## Internal Service Communication Contract

### Frontend to Backend Communication
- Protocol: HTTP/HTTPS
- Base URL: `http://todo-backend-service:8000` (internal Kubernetes service)
- All API endpoints are prefixed with `/api`
- Authentication tokens are passed in Authorization header
- JSON is the standard format for request and response bodies
- Standard HTTP status codes are used to indicate success/error conditions

### Error Handling
- 4xx status codes indicate client-side errors
- 5xx status codes indicate server-side errors
- Error responses follow the format:
```json
{
  "detail": "error message"
}
```

### Security
- All API endpoints except health check require authentication
- JWT tokens are used for authentication
- HTTPS is used for secure communication (in production)