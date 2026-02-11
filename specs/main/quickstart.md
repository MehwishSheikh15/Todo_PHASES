# Quickstart Guide: Todo Chatbot Kubernetes Deployment

## Overview
This guide provides step-by-step instructions to deploy the Todo Chatbot application to a local Minikube cluster, replacing the hosted frontend and backend with local containers.

## Prerequisites
- Docker installed and running
- Minikube installed (version 1.20 or later)
- kubectl installed
- Helm installed (version 3.x)
- Git installed

## Step 1: Clone and Prepare the Repository
```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd <repository-directory>

# Navigate to the project directory
cd C:\Users\NLN\Phase_II
```

## Step 2: Start Minikube Cluster
```bash
# Start Minikube with sufficient resources
minikube start --driver=hyperv --memory=4096 --cpus=2

# Or use default driver if Hyper-V is not available
minikube start --memory=4096 --cpus=2

# Enable ingress addon for external access
minikube addons enable ingress

# Verify cluster is running
kubectl cluster-info
```

## Step 3: Build Docker Images
```bash
# Set Docker environment to use Minikube's Docker daemon
@FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i

# Alternative: Run this command to set Docker environment
eval $(minikube docker-env)

# Build backend image
cd backend
docker build -t todo-backend:latest .
cd ..

# Build frontend image
cd frontend
docker build -t todo-frontend:latest .
cd ..
```

## Step 4: Deploy Using Helm
```bash
# Navigate to the project root
cd C:\Users\NLN\Phase_II

# Install the Todo Chatbot using Helm
helm install todo-chatbot ./helm/todo-chatbot --namespace todo-chatbot --create-namespace --wait

# Verify the installation
helm list -n todo-chatbot
```

## Step 5: Verify the Deployment
```bash
# Check if all pods are running
kubectl get pods -n todo-chatbot

# Check if all services are available
kubectl get svc -n todo-chatbot

# Check if ingress is configured
kubectl get ingress -n todo-chatbot

# Wait for deployments to be ready
kubectl wait --for=condition=available deployment/todo-chatbot-backend-deployment -n todo-chatbot --timeout=300s
kubectl wait --for=condition=available deployment/todo-chatbot-frontend-deployment -n todo-chatbot --timeout=300s
```

## Step 6: Access the Application
### Option 1: Using Ingress (Recommended)
```bash
# Get Minikube IP
minikube ip

# Add the IP and hostname to your hosts file (C:\Windows\System32\drivers\etc\hosts)
# Add this line: <MINIKUBE_IP> todo.local

# Access the application at: http://todo.local
```

### Option 2: Using Port Forwarding (Temporary Access)
```bash
# Forward frontend service to local port
kubectl port-forward svc/todo-chatbot-frontend-service 3000:3000 -n todo-chatbot

# Access the application at: http://localhost:3000
# Keep the terminal window open while using the application
```

## Step 7: Validate Functionality
```bash
# Check backend health
kubectl exec -it deployment/todo-chatbot-backend-deployment -n todo-chatbot -- curl localhost:8000/health

# View application logs
kubectl logs -l app=todo-backend -n todo-chatbot
kubectl logs -l app=todo-frontend -n todo-chatbot
```

## Troubleshooting

### Issue: Images not found
**Solution**: Ensure you've built the Docker images in the Minikube Docker environment:
```bash
# Set Docker environment
@FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i

# Rebuild images
cd backend && docker build -t todo-backend:latest . && cd ..
cd frontend && docker build -t todo-frontend:latest . && cd ..
```

### Issue: Service not accessible
**Solution**: Verify ingress controller is enabled:
```bash
minikube addons enable ingress
```

### Issue: API key problems
**Solution**: Update the secret with your actual GEMINI_API_KEY:
```bash
kubectl create secret generic todo-chatbot-secrets -n todo-chatbot \
  --from-literal=GEMINI_API_KEY="your-actual-api-key" \
  --from-literal=SECRET_KEY="your-secret-key" \
  --from-literal=DB_PASSWORD="your-db-password" \
  --save-config --dry-run=client -o yaml | kubectl apply -f -
```

## Scaling the Application
```bash
# Scale backend deployment
kubectl scale deployment todo-chatbot-backend-deployment -n todo-chatbot --replicas=3

# Scale frontend deployment
kubectl scale deployment todo-chatbot-frontend-deployment -n todo-chatbot --replicas=3

# Check current replica counts
kubectl get deployments -n todo-chatbot
```

## Cleanup
```bash
# Uninstall the Helm release
helm uninstall todo-chatbot -n todo-chatbot

# Optionally, delete the namespace
kubectl delete namespace todo-chatbot

# Stop Minikube
minikube stop
```

## AI DevOps Tools Integration

### Using kubectl-ai
```bash
# Get explanations for resources
kubectl ai explain pod
kubectl ai explain deployment

# Generate Kubernetes resources
kubectl ai create deployment my-app --image=my-image:latest

# Troubleshoot issues
kubectl ai troubleshoot pod/<pod-name>
```

### Using Kagent
```bash
# Start Kagent for automated operations
kagent start --config=kagent.yaml

# Check automation status
kagent status
```