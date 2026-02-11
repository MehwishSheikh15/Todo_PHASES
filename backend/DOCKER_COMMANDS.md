# Docker Build and Run Commands for Backend Todo API

## Build the Docker Image
```bash
# Navigate to the backend directory
cd C:\Users\NLN\Phase_II\backend

# Build the Docker image
docker build -t todo-backend:latest .
```

## Run the Docker Container
```bash
# Run the container (with environment variables if needed)
docker run -d \
  --name todo-backend-container \
  -p 8000:8000 \
  -e GEMINI_API_KEY=your_gemini_api_key_here \
  -e DATABASE_URL=sqlite:///./todo_app.db \
  -e SECRET_KEY=your_secret_key_here \
  -e ALGORITHM=HS256 \
  -e ACCESS_TOKEN_EXPIRE_MINUTES=30 \
  todo-backend:latest
```

## Alternative: Run with Docker Compose
Create a `docker-compose.yml` file:
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - DATABASE_URL=sqlite:///./todo_app.db
      - SECRET_KEY=${SECRET_KEY}
      - ALGORITHM=HS256
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
    volumes:
      - ./todo_app.db:/app/todo_app.db  # Persist database
```

Then run:
```bash
docker-compose up -d
```

## Test the API
```bash
# Test the health endpoint
curl http://localhost:8000/health

# Test an API endpoint (example)
curl http://localhost:8000/api/tasks
```

## Environment Variables Required
The container expects these environment variables:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `DATABASE_URL`: Database connection string (default: sqlite:///./todo_app.db)
- `SECRET_KEY`: Secret key for JWT tokens
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time (default: 30)

## API Routes Available
The container supports all /api routes as the original service:
- GET /health - Health check endpoint
- GET /api/tasks - Get all tasks
- POST /api/tasks - Create a new task
- GET /api/tasks/{task_id} - Get a specific task
- PUT /api/tasks/{task_id} - Update a specific task
- DELETE /api/tasks/{task_id} - Delete a specific task
- POST /api/chat - Chat with the AI assistant
- All other /api routes as implemented in the original service

## Notes
- The container exposes port 8000
- The application runs with 4 worker processes for production
- The container is optimized for production with a multi-stage approach
- Database persistence should be handled via volumes if needed