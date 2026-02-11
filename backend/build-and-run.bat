@echo off
REM Build and run script for Todo Chatbot Backend

echo Building Docker image for Todo Chatbot Backend...
docker build -t todo-chatbot-backend:latest .

REM Check if the build was successful
if %ERRORLEVEL% EQU 0 (
    echo Build successful!
    
    REM Run the Docker container
    echo Running the container...
    docker run -d ^
        --name todo-chatbot-backend ^
        -p 8000:8000 ^
        -e GEMINI_API_KEY=%GEMINI_API_KEY% ^
        -e SECRET_KEY=%SECRET_KEY% ^
        -e DATABASE_URL=%DATABASE_URL% ^
        todo-chatbot-backend:latest
    
    echo Container is running on port 8000
    echo Access the API at: http://localhost:8000
    echo Access the docs at: http://localhost:8000/docs
) else (
    echo Build failed!
    exit /b 1
)