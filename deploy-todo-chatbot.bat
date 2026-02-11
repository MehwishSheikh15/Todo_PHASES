@echo off
REM One-Shot Deployment Script for Todo Chatbot on Minikube (Windows)
REM This script cleans up previous deployments and deploys fresh

echo ========================================
echo Todo Chatbot Deployment to Minikube
echo ========================================
echo.

REM Step 1: Verify Minikube is running
echo [Step 1] Checking Minikube status...
minikube status >nul 2>&1
if errorlevel 1 (
    echo Minikube is not running. Starting Minikube...
    minikube start --driver=docker
) else (
    echo Minikube is running
)
echo.

REM Step 2: Clean up previous deployment
echo [Step 2] Cleaning up previous deployments...
helm uninstall todo-chatbot -n todo-app 2>nul
kubectl delete namespace todo-app --ignore-not-found=true
echo Waiting for namespace deletion...
timeout /t 5 /nobreak >nul
echo.

REM Step 3: Create namespace
echo [Step 3] Creating namespace todo-app...
kubectl create namespace todo-app
echo.

REM Step 4: Load Docker images into Minikube
echo [Step 4] Loading Docker images into Minikube...
docker images | findstr "todo-frontend" >nul 2>&1
if not errorlevel 1 (
    echo Loading todo-frontend image...
    minikube image load todo-frontend:latest
) else (
    echo WARNING: todo-frontend image not found locally
)

docker images | findstr "todo-backend" >nul 2>&1
if not errorlevel 1 (
    echo Loading todo-backend image...
    minikube image load todo-backend:latest
) else (
    echo WARNING: todo-backend image not found locally
)
echo.

REM Step 5: Deploy using Helm
echo [Step 5] Deploying with Helm...
cd /d "%~dp0"
helm install todo-chatbot .\todo-chatbot -n todo-app
echo.

REM Step 6: Wait for pods to be ready
echo [Step 6] Waiting for pods to be ready...
timeout /t 10 /nobreak >nul
echo.

REM Step 7: Display deployment status
echo ========================================
echo Deployment Status
echo ========================================
kubectl get all -n todo-app
echo.

echo ========================================
echo Pod Status
echo ========================================
kubectl get pods -n todo-app
echo.

echo ========================================
echo Services
echo ========================================
kubectl get svc -n todo-app
echo.

REM Step 8: Get Minikube IP and access URL
for /f "tokens=*" %%i in ('minikube ip') do set MINIKUBE_IP=%%i
echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo Frontend URL: http://%MINIKUBE_IP%:30080
echo Backend Service: todo-backend:5000 (internal)
echo.
echo To view logs:
echo   Frontend: kubectl logs -l app.kubernetes.io/component=frontend -n todo-app -f
echo   Backend:  kubectl logs -l app.kubernetes.io/component=backend -n todo-app -f
echo.
echo To check status:
echo   kubectl get all -n todo-app
echo.
pause
