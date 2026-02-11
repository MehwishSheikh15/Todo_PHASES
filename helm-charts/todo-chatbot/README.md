# Todo Chatbot Helm Chart

A Helm chart for deploying the Todo Chatbot application on Kubernetes with separate frontend and backend deployments.

## Features

- ✅ Separate frontend and backend deployments
- ✅ Configurable replica counts via Helm values
- ✅ Configurable image tags via Helm values
- ✅ Configurable backend service URL via Helm values
- ✅ Support for Helm upgrades
- ✅ Ingress for local access
- ✅ Health checks and resource limits
- ✅ ConfigMap for environment variables

## Prerequisites

- Kubernetes cluster (Minikube for local deployment)
- Helm 3.x
- kubectl
- Docker images for frontend and backend

## Quick Start

### 1. Start Minikube
```bash
minikube start --driver=docker
minikube addons enable ingress
```

### 2. Configure Local DNS
Add to your hosts file (`C:\Windows\System32\drivers\etc\hosts`):
```
<MINIKUBE_IP> todo-chatbot.local
```

### 3. Install the Chart
```bash
helm install todo-chatbot ./todo-chatbot
```

### 4. Access the Application
```
http://todo-chatbot.local
```

## Configuration

### values.yaml Overview

| Parameter | Description | Default |
|-----------|-------------|---------|
| `frontend.image.repository` | Frontend Docker image | `todo-chatbot-frontend` |
| `frontend.image.tag` | Frontend image tag | `latest` |
| `frontend.replicaCount` | Number of frontend replicas | `2` |
| `frontend.env.BACKEND_URL` | Backend API URL | `http://todo-chatbot-backend:80/api` |
| `backend.image.repository` | Backend Docker image | `todo-chatbot-backend` |
| `backend.image.tag` | Backend image tag | `latest` |
| `backend.replicaCount` | Number of backend replicas | `2` |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.host` | Ingress hostname | `todo-chatbot.local` |

### Custom Installation

Install with custom values:
```bash
helm install todo-chatbot ./todo-chatbot \
  --set frontend.replicaCount=3 \
  --set backend.replicaCount=3 \
  --set frontend.image.tag=v1.0.0 \
  --set backend.image.tag=v1.0.0
```

## Upgrading

### Scale Replicas
```bash
helm upgrade todo-chatbot ./todo-chatbot \
  --set frontend.replicaCount=5 \
  --reuse-values
```

### Update Image Tags
```bash
helm upgrade todo-chatbot ./todo-chatbot \
  --set frontend.image.tag=v2.0.0 \
  --set backend.image.tag=v2.0.0 \
  --reuse-values
```

### Change Backend URL
```bash
helm upgrade todo-chatbot ./todo-chatbot \
  --set frontend.env.BACKEND_URL="http://new-backend:80/api" \
  --reuse-values
```

## Chart Structure

```
todo-chatbot/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default configuration values
├── templates/
│   ├── _helpers.tpl        # Template helpers
│   ├── deployment-frontend.yaml
│   ├── deployment-backend.yaml
│   ├── service-frontend.yaml
│   ├── service-backend.yaml
│   ├── ingress.yaml
│   └── configmap.yaml
└── .helmignore
```

## Verification

Check deployment status:
```bash
# View all resources
kubectl get all -l app.kubernetes.io/instance=todo-chatbot

# Check pods
kubectl get pods -l app.kubernetes.io/instance=todo-chatbot

# View logs
kubectl logs -l app.kubernetes.io/component=frontend -f
kubectl logs -l app.kubernetes.io/component=backend -f
```

## Uninstalling

```bash
helm uninstall todo-chatbot
```

## AI-Assisted Operations

Use kubectl-ai for intelligent operations:
```bash
kubectl ai "scale the frontend deployment to 10 replicas"
kubectl ai "show me all pods for todo-chatbot"
kubectl ai "why is the frontend pod failing?"
```

## Troubleshooting

See [DEPLOYMENT_COMMANDS.md](../DEPLOYMENT_COMMANDS.md) for detailed troubleshooting guide.

## Support

For issues and questions, refer to the deployment documentation.
