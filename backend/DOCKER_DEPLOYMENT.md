# Todo Chatbot Backend - Docker Deployment

This document explains how to build and run the Todo Chatbot Backend using Docker.

## Prerequisites

- Docker installed on your machine
- Valid GEMINI_API_KEY from Google for AI features
- (Optional) Database URL if using PostgreSQL instead of SQLite

## Building the Docker Image

To build the Docker image for the Todo Chatbot Backend:

```bash
cd backend
docker build -t todo-chatbot-backend:latest .
```

## Running the Container

### With Environment Variables

```bash
docker run -d \
  --name todo-chatbot-backend \
  -p 8000:8000 \
  -e GEMINI_API_KEY=your_gemini_api_key \
  -e SECRET_KEY=your_secret_key \
  -e DATABASE_URL=sqlite:///./todo_app.db \
  todo-chatbot-backend:latest
```

### Using Environment File

Create a `.env` file with your environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///./todo_app.db
```

Then run:

```bash
docker run -d \
  --name todo-chatbot-backend \
  -p 8000:8000 \
  --env-file .env \
  todo-chatbot-backend:latest
```

## Docker Compose (Alternative)

For easier management with the frontend, you can use Docker Compose:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=${DATABASE_URL:-sqlite:///./todo_app.db}
    volumes:
      - ./backend-data:/app/data
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
    depends_on:
      - backend

volumes:
  backend-data:
```

## Security Features

- Runs as non-root user (UID 1001)
- Minimal base image (python:3.11-slim)
- No unnecessary packages installed
- Proper file permissions
- Health check endpoint

## Ports

- The container exposes port 8000
- Maps to port 8000 on the host

## Volumes (Optional)

You can mount a volume to persist SQLite database:

```bash
docker run -d \
  --name todo-chatbot-backend \
  -p 8000:8000 \
  -v todo-backend-data:/app/data \
  -e GEMINI_API_KEY=your_gemini_api_key \
  -e SECRET_KEY=your_secret_key \
  todo-chatbot-backend:latest
```

## Health Check

The container includes a health check that verifies the `/health` endpoint is responding.

Access the health endpoint at: `http://localhost:8000/health`

## Troubleshooting

### Container Won't Start

1. Check that all required environment variables are set
2. Verify the database connection if using PostgreSQL
3. Look at container logs: `docker logs todo-chatbot-backend`

### API Issues

1. Verify the GEMINI_API_KEY is valid and has proper permissions
2. Check that the database is accessible
3. Review the application logs for specific error messages

### Performance Issues

1. Adjust resource limits if needed:
   ```bash
   docker run -d \
     --name todo-chatbot-backend \
     --memory=512m \
     --cpus=1.0 \
     -p 8000:8000 \
     -e GEMINI_API_KEY=your_gemini_api_key \
     todo-chatbot-backend:latest
   ```