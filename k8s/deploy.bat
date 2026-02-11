@echo off
REM Script to deploy Todo App to Kubernetes

echo Creating namespace...
kubectl apply -f namespace.yaml

echo Creating ConfigMap and Secrets...
kubectl apply -f configmaps-and-secrets.yaml

echo Creating Backend Deployment and Service...
kubectl apply -f backend-deployment-service.yaml

echo Creating Frontend Deployment and Service...
kubectl apply -f frontend-deployment-service.yaml

echo Waiting for deployments to be ready...
kubectl wait --for=condition=ready pod -l app=todo-backend -n todo-app --timeout=300s
kubectl wait --for=condition=ready pod -l app=todo-frontend -n todo-app --timeout=300s

echo Deployment complete!
echo Frontend is available at NodePort 30080
echo To access: minikube service todo-frontend -n todo-app (if using minikube)