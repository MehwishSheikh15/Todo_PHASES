#!/bin/bash

# Build the Docker images
echo "Building Docker images..."

docker build -f todo-frontend.Dockerfile -t todo-frontend:latest .
if [ $? -ne 0 ]; then
  echo "Failed to build frontend image"
  exit 1
fi

docker build -f todo-backend.Dockerfile -t todo-backend:latest .
if [ $? -ne 0 ]; then
  echo "Failed to build backend image"
  exit 1
fi

echo "Images built successfully!"

# Run the backend container
echo "Starting backend container..."
docker run -d --name todo-backend-container -p 8000:8000 todo-backend:latest

# Wait a moment for the backend to start
sleep 5

# Run the frontend container
echo "Starting frontend container..."
docker run -d --name todo-frontend-container -p 3000:3000 --link todo-backend-container:backend todo-frontend:latest

echo "Containers are running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"

# Show running containers
docker ps