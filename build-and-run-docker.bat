@echo off
setlocal

echo Building Docker images...

docker build -f todo-frontend.Dockerfile -t todo-frontend:latest .
if %errorlevel% neq 0 (
  echo Failed to build frontend image
  exit /b 1
)

docker build -f todo-backend.Dockerfile -t todo-backend:latest .
if %errorlevel% neq 0 (
  echo Failed to build backend image
  exit /b 1
)

echo Images built successfully!

echo Starting backend container...
docker run -d --name todo-backend-container -p 8000:8000 todo-backend:latest

timeout /t 5 /nobreak >nul

echo Starting frontend container...
docker run -d --name todo-frontend-container -p 3000:3000 --link todo-backend-container:backend todo-frontend:latest

echo Containers are running!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000

docker ps

pause