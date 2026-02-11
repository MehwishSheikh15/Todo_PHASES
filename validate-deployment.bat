@echo off
REM Validation and testing script for Todo Chatbot Kubernetes deployment

echo Starting validation of Todo Chatbot deployment...

echo Checking if Minikube is running...
minikube status
if %ERRORLEVEL% NEQ 0 (
    echo Minikube is not running. Please start Minikube first.
    exit /b 1
)

echo Setting kubectl context to Minikube...
kubectl config use-context minikube

echo Checking if namespace exists...
kubectl get namespace todo-chatbot
if %ERRORLEVEL% NEQ 0 (
    echo Namespace todo-chatbot does not exist. Creating it...
    kubectl create namespace todo-chatbot
)

echo Checking if deployments are ready...
kubectl wait --for=condition=available deployment/todo-chatbot-backend-deployment -n todo-chatbot --timeout=300s
if %ERRORLEVEL% NEQ 0 (
    echo Backend deployment is not ready
    kubectl get pods -n todo-chatbot
    exit /b 1
)

kubectl wait --for=condition=available deployment/todo-chatbot-frontend-deployment -n todo-chatbot --timeout=300s
if %ERRORLEVEL% NEQ 0 (
    echo Frontend deployment is not ready
    kubectl get pods -n todo-chatbot
    exit /b 1
)

echo Checking if services are running...
kubectl get svc -n todo-chatbot

echo Checking if ingress is configured...
kubectl get ingress -n todo-chatbot

echo Checking pod statuses...
kubectl get pods -n todo-chatbot

echo Verifying application functionality...

echo Testing backend health endpoint...
kubectl port-forward svc/todo-chatbot-backend-service 8000:8000 -n todo-chatbot &
SET PORT_FORWARD_PID=%ERRORLEVEL%
timeout /t 5 /nobreak >nul
curl -s http://localhost:8000/health
IF %ERRORLEVEL% EQU 0 (
    echo Backend health check passed
) ELSE (
    echo Backend health check failed
)
taskkill /F /PID %PORT_FORWARD_PID% 2>nul

echo Testing if frontend is accessible...
kubectl port-forward svc/todo-chatbot-frontend-service 3000:3000 -n todo-chatbot &
SET PORT_FORWARD_PID=%ERRORLEVEL%
timeout /t 5 /nobreak >nul
curl -s http://localhost:3000/
IF %ERRORLEVEL% EQU 0 (
    echo Frontend accessibility check passed
) ELSE (
    echo Frontend accessibility check failed
)
taskkill /F /PID %PORT_FORWARD_PID% 2>nul

echo Checking logs for any errors...
echo Backend logs:
kubectl logs -l app=todo-backend -n todo-chatbot --tail=20
echo.
echo Frontend logs:
kubectl logs -l app=todo-frontend -n todo-chatbot --tail=20

echo.
echo Validation complete!
echo.
echo To access the application:
echo 1. Get Minikube IP: minikube ip
echo 2. Add the IP and hostname to your hosts file: ^<minikube-ip^> todo.local
echo 3. Access the application at: http://todo.local
echo.
echo Or use port forwarding to access temporarily:
echo kubectl port-forward svc/todo-chatbot-frontend-service 3000:3000 -n todo-chatbot
echo Then visit http://localhost:3000