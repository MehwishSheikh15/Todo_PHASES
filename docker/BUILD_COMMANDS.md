# Docker Build and Push Commands

## Build Images

### Frontend
```bash
# Navigate to frontend directory
cd C:\Users\BRC\Downloads\PHASE_II\docker\frontend

# Build frontend image
docker build -t todo-chatbot-frontend:latest .

# Tag for different versions
docker tag todo-chatbot-frontend:latest todo-chatbot-frontend:v1.0.0
```

### Backend
```bash
# Navigate to backend directory
cd C:\Users\BRC\Downloads\PHASE_II\docker\backend

# Build backend image
docker build -t todo-chatbot-backend:latest .

# Tag for different versions
docker tag todo-chatbot-backend:latest todo-chatbot-backend:v1.0.0
```

## Load Images into Minikube

```bash
# Load frontend image
minikube image load todo-chatbot-frontend:latest

# Load backend image
minikube image load todo-chatbot-backend:latest

# Verify images are loaded
minikube image ls | findstr todo-chatbot
```

## Push to Registry (Optional)

### Docker Hub
```bash
# Login to Docker Hub
docker login

# Tag images
docker tag todo-chatbot-frontend:latest yourusername/todo-chatbot-frontend:latest
docker tag todo-chatbot-backend:latest yourusername/todo-chatbot-backend:latest

# Push images
docker push yourusername/todo-chatbot-frontend:latest
docker push yourusername/todo-chatbot-backend:latest
```

### Azure Container Registry
```bash
# Login to ACR
az acr login --name yourregistry

# Tag images
docker tag todo-chatbot-frontend:latest yourregistry.azurecr.io/todo-chatbot-frontend:latest
docker tag todo-chatbot-backend:latest yourregistry.azurecr.io/todo-chatbot-backend:latest

# Push images
docker push yourregistry.azurecr.io/todo-chatbot-frontend:latest
docker push yourregistry.azurecr.io/todo-chatbot-backend:latest
```

## Update Helm Values

After building images, update `values.yaml`:
```yaml
frontend:
  image:
    repository: todo-chatbot-frontend  # or yourusername/todo-chatbot-frontend
    tag: latest  # or v1.0.0
    pullPolicy: IfNotPresent  # Use Never for local Minikube images

backend:
  image:
    repository: todo-chatbot-backend  # or yourusername/todo-chatbot-backend
    tag: latest  # or v1.0.0
    pullPolicy: IfNotPresent  # Use Never for local Minikube images
```
