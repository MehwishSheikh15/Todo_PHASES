# Todo Chatbot - Docker Configuration

This document provides instructions for containerizing the Todo Chatbot application with Docker.

## Overview

The Todo Chatbot consists of two main components:
- **Frontend**: A React-based user interface
- **Backend**: A Python/FastAPI-based API server

Both components have been configured with Docker to enable easy deployment and consistent environments.

## Docker Files Created

1. `todo-frontend.Dockerfile` - Builds the React frontend application
2. `todo-backend.Dockerfile` - Builds the Python backend API
3. `todo-frontend.dockerignore` - Specifies files to exclude from frontend build
4. `todo-backend.dockerignore` - Specifies files to exclude from backend build
5. `todo-docker-compose.yml` - Orchestrates both services
6. `build-and-run-docker.sh` - Script to build and run containers (Linux/Mac)
7. `build-and-run-docker.bat` - Script to build and run containers (Windows)
8. `DOCKER_SETUP.md` - Detailed setup instructions

## Building the Images

To build the Docker images with the specified tags:

```bash
# Build the frontend image
docker build -f todo-frontend.Dockerfile -t todo-frontend:latest .

# Build the backend image
docker build -f todo-backend.Dockerfile -t todo-backend:latest .
```

## Running the Application

### Option 1: Using the Scripts

Run the provided script to build and run both containers:

```bash
# Linux/Mac
./build-and-run-docker.sh

# Windows
build-and-run-docker.bat
```

### Option 2: Using Docker Compose

Build and run both services using Docker Compose:

```bash
docker-compose -f todo-docker-compose.yml up --build
```

### Option 3: Manual Container Management

Start the backend first:

```bash
docker run -d --name todo-backend-container -p 8000:8000 todo-backend:latest
```

Then start the frontend:

```bash
docker run -d --name todo-frontend-container -p 3000:3000 --link todo-backend-container:backend todo-frontend:latest
```

## Accessing the Application

After running the containers:

- **Frontend**: Access the React application at http://localhost:3000
- **Backend**: Access the API at http://localhost:8000/docs for the Swagger UI

## Environment Variables

The containers are configured with appropriate environment variables:

- **Frontend**: Configured to connect to the backend API
- **Backend**: Configured with the appropriate port and environment settings

## Troubleshooting

1. **Port Already in Use**: If you get port binding errors, ensure no other services are running on ports 3000 or 8000.

2. **Container Won't Start**: Check the container logs:
   ```bash
   docker logs todo-frontend-container
   docker logs todo-backend-container
   ```

3. **Network Issues**: If the frontend can't connect to the backend, ensure the containers are on the same network or properly linked.

## Cleanup

To stop and remove the containers:

```bash
docker stop todo-frontend-container todo-backend-container
docker rm todo-frontend-container todo-backend-container
```

To remove the images:

```bash
docker rmi todo-frontend:latest todo-backend:latest
```

## Best Practices

- The Dockerfiles use multi-stage builds to minimize image size
- Non-root users are used in production for security
- Proper health checks are implemented
- Dependencies are cached during build for faster rebuilds
- .dockerignore files prevent unnecessary files from being copied to the image