@echo off
REM Script to set up Minikube for Todo Chatbot deployment

echo Starting Minikube cluster...
minikube start --driver=hyperv --memory=4096 --cpus=2

if %ERRORLEVEL% NEQ 0 (
    echo Failed to start Minikube. Trying with default driver...
    minikube start --memory=4096 --cpus=2
)

if %ERRORLEVEL% EQU 0 (
    echo Minikube cluster started successfully!
    echo Enabling required addons...
    minikube addons enable ingress
    minikube addons enable dashboard
    
    echo Creating namespace for Todo Chatbot...
    kubectl create namespace todo-chatbot || echo Namespace may already exist
    
    echo Minikube setup complete!
    echo To access the dashboard, run: minikube dashboard
) else (
    echo Failed to start Minikube cluster. Please ensure Minikube is installed and properly configured.
    exit /b 1
)