# Todo Chatbot - Docker Deployment Guide

This document explains how to build and run the complete Todo Chatbot application using Docker.

## Overview

The Todo Chatbot application consists of:
- **Backend**: FastAPI application handling API requests and AI processing
- **Frontend**: Next.js application serving the user interface

## Prerequisites

- Docker installed on your machine
- Valid GEMINI_API_KEY from Google for AI features
- At least 4GB of RAM available for smooth operation

## Building the Application

### Build Backend

```bash
cd backend
docker build -t todo-chatbot-backend:latest .
```

### Build Frontend

```bash
cd frontend
docker build -t todo-chatbot-frontend:latest .
```

## Running the Application

### Individual Containers

1. Start the backend:
```bash
docker run -d \
  --name todo-chatbot-backend \
  -p 8000:8000 \
  -e GEMINI_API_KEY=your_gemini_api_key \
  -e SECRET_KEY=your_secret_key \
  -e DATABASE_URL=sqlite:///./todo_app.db \
  todo-chatbot-backend:latest
```

2. Start the frontend:
```bash
docker run -d \
  --name todo-chatbot-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 \
  todo-chatbot-frontend:latest
```

### Using Docker Compose (Recommended)

Create a `docker-compose.yml` file:

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
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://backend:8000
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

volumes:
  backend-data:
```

Create a `.env` file with your environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///./todo_app.db
```

Run the application:

```bash
docker-compose up -d
```

## Accessing the Application

- Frontend UI: http://localhost:3000
- Backend API: http://localhost:8000
- Backend API Docs: http://localhost:8000/docs
- Backend Health Check: http://localhost:8000/health

## Security Features

Both containers implement security best practices:

### Backend
- Runs as non-root user (UID 1001)
- Minimal base image (python:3.11-slim)
- No unnecessary packages installed
- Proper file permissions
- Health check endpoint

### Frontend
- Runs as non-root user (UID 1001)
- Minimal base image (node:18-alpine)
- No unnecessary packages installed
- Proper file permissions
- Health check endpoint

## Environment Variables

### Backend
- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `SECRET_KEY`: Secret key for JWT tokens (required)
- `DATABASE_URL`: Database connection string (default: sqlite:///./todo_app.db)
- `PORT`: Port number for the backend service (default: 8000)

### Frontend
- `NEXT_PUBLIC_BACKEND_URL`: URL of the backend service (default: http://localhost:8000)

## Volumes (Optional)

For persistent data storage, you can mount volumes:

### Backend
```bash
docker run -d \
  --name todo-chatbot-backend \
  -p 8000:8000 \
  -v todo-backend-data:/app/data \
  -e GEMINI_API_KEY=your_gemini_api_key \
  -e SECRET_KEY=your_secret_key \
  todo-chatbot-backend:latest
```

## Health Checks

Both containers include health checks:
- Backend: `http://localhost:8000/health`
- Frontend: `http://localhost:3000/` (main page)

## Troubleshooting

### Application Won't Start

1. Check that all required environment variables are set
2. Verify the database connection if using PostgreSQL
3. Look at container logs:
   ```bash
   docker logs todo-chatbot-backend
   docker logs todo-chatbot-frontend
   ```

### API Issues

1. Verify the GEMINI_API_KEY is valid and has proper permissions
2. Check that the backend is accessible from the frontend
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

### Connection Issues

1. Ensure the frontend can reach the backend
2. Check that the NEXT_PUBLIC_BACKEND_URL is set correctly
3. Verify both containers are on the same network if using Docker Compose

## Production Considerations

1. Use stronger secrets for SECRET_KEY
2. Consider using PostgreSQL instead of SQLite for production
3. Implement proper SSL certificates
4. Set up monitoring and alerting
5. Use a reverse proxy like nginx for production deployments
6. Implement proper backup strategies for data persistence