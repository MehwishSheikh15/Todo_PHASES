@echo off
REM Build and run script for Todo Chatbot Frontend (Production)

echo Building production Docker image for Todo Chatbot Frontend...
docker build -f Dockerfile.production -t todo-chatbot-frontend:production .

REM Check if the build was successful
if %ERRORLEVEL% EQU 0 (
    echo Build successful!
    
    REM Run the Docker container
    echo Running the container...
    docker run -d ^
        --name todo-chatbot-frontend-prod ^
        -p 3000:3000 ^
        -e NEXT_PUBLIC_BACKEND_URL=%NEXT_PUBLIC_BACKEND_URL% ^
        todo-chatbot-frontend:production
    
    echo Container is running on port 3000
    echo Access the UI at: http://localhost:3000
) else (
    echo Build failed!
    exit /b 1
)