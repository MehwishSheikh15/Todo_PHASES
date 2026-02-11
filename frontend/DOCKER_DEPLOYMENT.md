# Todo Chatbot Frontend - Docker Deployment

This document explains how to build and run the Todo Chatbot Frontend using Docker.

## Prerequisites

- Docker installed on your machine
- Backend service running (either locally or remotely)

## Building the Docker Image

To build the Docker image for the Todo Chatbot Frontend:

```bash
cd frontend
docker build -t todo-chatbot-frontend:latest .
```

## Running the Container

### With Environment Variables

```bash
docker run -d \
  --name todo-chatbot-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 \
  todo-chatbot-frontend:latest
```

### Using Environment File

Create a `.env` file with your environment variables:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Then run:

```bash
docker run -d \
  --name todo-chatbot-frontend \
  -p 3000:3000 \
  --env-file .env \
  todo-chatbot-frontend:latest
```

## Docker Compose (Recommended)

For easier management with the backend, you can use Docker Compose:

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
- Minimal base image (node:18-alpine)
- No unnecessary packages installed
- Proper file permissions
- Health check endpoint

## Ports

- The container exposes port 3000
- Maps to port 3000 on the host

## Health Check

The container includes a health check that verifies the main page is responding.

Access the frontend at: `http://localhost:3000`

## Troubleshooting

### Container Won't Start

1. Check that the NEXT_PUBLIC_BACKEND_URL is set correctly
2. Verify the backend service is accessible
3. Look at container logs: `docker logs todo-chatbot-frontend`

### API Issues

1. Verify the NEXT_PUBLIC_BACKEND_URL points to the correct backend
2. Check that the backend is running and accessible
3. Review the browser console for CORS or network errors

### Performance Issues

1. Adjust resource limits if needed:
   ```bash
   docker run -d \
     --name todo-chatbot-frontend \
     --memory=256m \
     --cpus=0.5 \
     -p 3000:3000 \
     -e NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 \
     todo-chatbot-frontend:latest
   ```