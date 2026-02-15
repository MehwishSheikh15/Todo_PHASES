# Todo Chatbot - Docker Setup

This document explains how to build and run the Todo Chatbot application using Docker.

## Prerequisites

- Docker installed on your machine
- Access to the project files

## Building the Docker Images

To build both frontend and backend Docker images with the specified tags, run:

```bash
# For Linux/Mac
./build-and-run-docker.sh

# For Windows
build-and-run-docker.bat
```

Or build them individually:

```bash
# Build frontend image
docker build -f todo-frontend.Dockerfile -t todo-frontend:latest .

# Build backend image
docker build -f todo-backend.Dockerfile -t todo-backend:latest .
```

## Running the Application Locally

After building the images, you can run the containers:

```bash
# Run backend container
docker run -d --name todo-backend-container -p 8000:8000 todo-backend:latest

# Run frontend container (with link to backend)
docker run -d --name todo-frontend-container -p 3000:3000 --link todo-backend-container:backend todo-frontend:latest
```

## Accessing the Application

Once the containers are running:

- Frontend (React app): http://localhost:3000
- Backend (API): http://localhost:8000

## Alternative: Using Docker Compose

For easier management, you can also create a docker-compose.yml file:

```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: todo-backend.Dockerfile
    ports:
      - "8000:8000"
    environment:
      - PORT=8000

  frontend:
    build:
      context: ./frontend
      dockerfile: todo-frontend.Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - BACKEND_URL=http://backend:8000
```

Then run with:
```bash
docker-compose up --build
```

## Stopping the Containers

To stop and remove the containers:

```bash
docker stop todo-frontend-container todo-backend-container
docker rm todo-frontend-container todo-backend-container
```