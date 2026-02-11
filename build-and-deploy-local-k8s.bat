@echo off
REM Build and deploy script for local Kubernetes Todo Chatbot

echo Building Docker images for local Kubernetes deployment...

echo Building backend image...
cd backend
docker build -t todo-backend:latest .
if %ERRORLEVEL% NEQ 0 (
    echo Backend build failed
    exit /b 1
)
cd ..

echo Building frontend image...
cd frontend
docker build -t todo-frontend:latest .
if %ERRORLEVEL% NEQ 0 (
    echo Frontend build failed
    exit /b 1
)
cd ..

echo Docker images built successfully!

echo Starting Minikube cluster...
minikube start --driver=hyperv --memory=4096 --cpus=2 --namespace=todo-chatbot
if %ERRORLEVEL% NEQ 0 (
    echo Trying with default driver...
    minikube start --memory=4096 --cpus=2 --namespace=todo-chatbot
)

echo Enabling ingress addon...
minikube addons enable ingress

echo Adding Minikube Docker daemon to current shell...
@FOR /f "tokens=*" %%i IN ('minikube -p minikube docker-env') DO @%%i

echo Rebuilding images in Minikube environment...
cd backend
docker build -t todo-backend:latest .
cd ..
cd frontend
docker build -t todo-frontend:latest .
cd ..

echo Installing Todo Chatbot to Minikube using Helm...
helm install todo-chatbot ./helm/todo-chatbot --namespace todo-chatbot --create-namespace --wait

echo Waiting for deployments to be ready...
kubectl wait --for=condition=available deployment/todo-chatbot-backend-deployment -n todo-chatbot --timeout=300s
kubectl wait --for=condition=available deployment/todo-chatbot-frontend-deployment -n todo-chatbot --timeout=300s

echo Local Kubernetes deployment complete!
echo.
echo To access the application:
echo 1. Get Minikube IP: minikube ip
echo 2. Add to your hosts file: ^<minikube-ip^> todo.local
echo 3. Access the application at: http://todo.local
echo.
echo Or use port forwarding to access temporarily:
echo kubectl port-forward svc/todo-chatbot-frontend-service 3000:3000 -n todo-chatbot
echo Then visit http://localhost:3000