# Todo Chatbot - Kubernetes Deployment

This repository contains the Kubernetes deployment configuration for the Todo Chatbot application, featuring an AI-powered chatbot that understands natural language commands using Google's Gemini API.

## Prerequisites

Before deploying the application, ensure you have the following tools installed:

- [Docker](https://www.docker.com/get-started)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/intro/install/)

## Quick Start

### 1. Start Minikube

```bash
# Start Minikube cluster
./setup-minikube.bat
```

### 2. Build Docker Images

```bash
# Build backend image
cd backend
docker build -t todo-backend:latest .
cd ..

# Build frontend image
cd frontend
docker build -t todo-frontend:latest .
cd ..
```

### 3. Deploy Using Helm

```bash
# Install the application using Helm
./install-helm-chart.bat
```

### 4. Access the Application

```bash
# Get the Minikube IP
minikube ip

# Add to your hosts file: <MINIKUBE_IP> todo.local
# Then access the application at: http://todo.local
```

Alternatively, use port forwarding:

```bash
# Port forward to access the frontend
kubectl port-forward svc/todo-chatbot-frontend-service 3000:3000 -n todo-chatbot
```

Then visit `http://localhost:3000`

## Manual Deployment (Alternative to Helm)

If you prefer to deploy manually without Helm:

```bash
# Apply all Kubernetes manifests
./deploy-k8s.bat
```

## Configuration

### Environment Variables

The application uses the following configuration:

- `GEMINI_API_KEY`: Your Google Gemini API key (set in secrets)
- `SECRET_KEY`: Secret key for JWT tokens (set in secrets)
- `DATABASE_URL`: Database connection string (set in configmap)
- `BACKEND_URL`: Backend service URL (set in configmap)

To update these values, modify the `helm/todo-chatbot/values.yaml` file before installing the chart.

### Persistent Storage

The application uses persistent storage for the SQLite database. The configuration is in `helm/todo-chatbot/templates/pv-pvc.yaml`.

## AI DevOps Tools Integration

This deployment includes integration with AI-powered DevOps tools:

### Docker AI Gordon
Optimizes Docker images using AI recommendations:
```bash
docker gordon analyze backend/Dockerfile
docker gordon suggest frontend/Dockerfile
```

### kubectl-ai
Enhances kubectl with AI-powered commands:
```bash
kubectl ai explain deployment
kubectl ai troubleshoot pod/<pod-name>
```

### Kagent
Automates Kubernetes operations:
```bash
kagent start --config=kagent.yaml
kagent status
```

## Validation and Testing

Run the validation script to verify your deployment:

```bash
./validate-deployment.bat
```

This script will:
- Check if Minikube is running
- Verify deployments are ready
- Test service connectivity
- Check application logs
- Validate basic functionality

## Troubleshooting

### Common Issues

1. **Images not found**: Ensure you've built the Docker images before deploying
2. **Service not accessible**: Check if the ingress controller is enabled in Minikube:
   ```bash
   minikube addons enable ingress
   ```
3. **API key issues**: Verify your GEMINI_API_KEY is correctly set in the secrets

### Useful Commands

```bash
# Check pod status
kubectl get pods -n todo-chatbot

# View logs
kubectl logs -l app=todo-backend -n todo-chatbot
kubectl logs -l app=todo-frontend -n todo-chatbot

# Describe resources for debugging
kubectl describe deployment todo-chatbot-backend-deployment -n todo-chatbot

# Check services
kubectl get svc -n todo-chatbot

# Check ingress
kubectl get ingress -n todo-chatbot
```

## Scaling

To scale the deployments:

```bash
# Scale backend
kubectl scale deployment todo-chatbot-backend-deployment -n todo-chatbot --replicas=3

# Scale frontend
kubectl scale deployment todo-chatbot-frontend-deployment -n todo-chatbot --replicas=3
```

## Uninstall

To remove the application:

```bash
# Using Helm
helm uninstall todo-chatbot -n todo-chatbot

# Or delete the namespace
kubectl delete namespace todo-chatbot
```

## Architecture

The deployment replicates your online architecture locally:

- **User Browser** → **Frontend Pod** → **Backend Pod** → **Response Returned**
- **Frontend**: Next.js application deployed as a Kubernetes Deployment with Service
- **Backend**: FastAPI application deployed as a Kubernetes Deployment with Service  
- **Database**: SQLite with persistent storage
- **Internal Communication**: Frontend pod communicates with backend pod via internal service URL (`http://todo-backend-service:8000`)
- **Ingress**: Kubernetes Ingress to expose the application externally
- **ConfigMap**: Stores non-sensitive configuration including backend service URL
- **Secrets**: Stores sensitive information like API keys

## Security

- API keys are stored in Kubernetes Secrets
- Network policies can be added for additional security
- Regular security scanning recommended for production use

## Next Steps

1. Set up monitoring with Prometheus and Grafana
2. Implement CI/CD pipeline
3. Add horizontal pod autoscaling
4. Set up backup and disaster recovery