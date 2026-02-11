#!/bin/bash
# Build and run script for Todo Chatbot Frontend

# Build the Docker image
echo "Building Docker image for Todo Chatbot Frontend..."
docker build -t todo-chatbot-frontend:latest .

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    # Run the Docker container
    echo "Running the container..."
    docker run -d \
        --name todo-chatbot-frontend \
        -p 3000:3000 \
        -e NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL:-http://localhost:8000} \
        todo-chatbot-frontend:latest
    
    echo "Container is running on port 3000"
    echo "Access the UI at: http://localhost:3000"
else
    echo "Build failed!"
    exit 1
fi