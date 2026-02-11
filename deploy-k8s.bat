@echo off
REM Script to deploy Todo Chatbot to Minikube

echo Applying namespace...
kubectl apply -f k8s/namespace.yaml

echo Applying ConfigMaps and Secrets...
kubectl apply -f k8s/configmaps-and-secrets.yaml

echo Applying Persistent Volume and Claim...
kubectl apply -f k8s/pv-pvc.yaml

echo Applying Backend Deployment and Service...
kubectl apply -f k8s/backend-deployment-service.yaml

echo Applying Frontend Deployment and Service...
kubectl apply -f k8s/frontend-deployment-service.yaml

echo Applying Ingress...
kubectl apply -f k8s/ingress.yaml

echo Waiting for deployments to be ready...
kubectl wait --for=condition=ready pod -l app=todo-backend -n todo-chatbot --timeout=300s
kubectl wait --for=condition=ready pod -l app=todo-frontend -n todo-chatbot --timeout=300s

echo Deployment complete!
echo Access the application at: http://todo.local
echo Note: You may need to add 'todo.local' to your hosts file pointing to Minikube IP
echo Run 'minikube ip' to get the IP address