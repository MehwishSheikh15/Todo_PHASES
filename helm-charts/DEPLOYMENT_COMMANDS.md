# Todo Chatbot - Kubernetes Deployment Commands

This document contains all the commands needed to deploy the Todo Chatbot application to Minikube using Helm charts.

## Prerequisites Setup

### 1. Start Minikube with Docker Driver
```bash
# Start Minikube with Docker driver
minikube start --driver=docker

# Verify Minikube is running
minikube status
```

### 2. Enable Ingress Addon
```bash
# Enable NGINX Ingress Controller
minikube addons enable ingress

# Verify ingress controller is running
kubectl get pods -n ingress-nginx
```

### 3. Configure Local DNS (Windows)
```powershell
# Get Minikube IP
minikube ip

# Add to hosts file (Run PowerShell as Administrator)
# Replace <MINIKUBE_IP> with the actual IP from above
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "<MINIKUBE_IP> todo-chatbot.local"
```

---

## Helm Installation Commands

### Initial Installation
```bash
# Navigate to helm charts directory
cd C:\Users\BRC\Downloads\PHASE_II\helm-charts

# Lint the Helm chart (validate syntax)
helm lint ./todo-chatbot

# Dry-run to preview what will be installed
helm install todo-chatbot ./todo-chatbot --dry-run --debug

# Install the chart
helm install todo-chatbot ./todo-chatbot

# Verify installation
helm list
kubectl get all -l app.kubernetes.io/instance=todo-chatbot
```

### Installation with Custom Values
```bash
# Install with custom replica counts
helm install todo-chatbot ./todo-chatbot \
  --set frontend.replicaCount=3 \
  --set backend.replicaCount=3

# Install with custom images
helm install todo-chatbot ./todo-chatbot \
  --set frontend.image.repository=your-registry/frontend \
  --set frontend.image.tag=v1.0.0 \
  --set backend.image.repository=your-registry/backend \
  --set backend.image.tag=v1.0.0

# Install with custom backend URL
helm install todo-chatbot ./todo-chatbot \
  --set frontend.env.BACKEND_URL="http://custom-backend:80/api"
```

---

## Helm Upgrade Commands

### Upgrade Replica Counts
```bash
# Scale frontend to 5 replicas
helm upgrade todo-chatbot ./todo-chatbot \
  --set frontend.replicaCount=5 \
  --reuse-values

# Scale backend to 4 replicas
helm upgrade todo-chatbot ./todo-chatbot \
  --set backend.replicaCount=4 \
  --reuse-values

# Scale both
helm upgrade todo-chatbot ./todo-chatbot \
  --set frontend.replicaCount=5 \
  --set backend.replicaCount=4 \
  --reuse-values
```

### Upgrade Image Tags
```bash
# Update frontend image tag
helm upgrade todo-chatbot ./todo-chatbot \
  --set frontend.image.tag=v2.0.0 \
  --reuse-values

# Update backend image tag
helm upgrade todo-chatbot ./todo-chatbot \
  --set backend.image.tag=v2.0.0 \
  --reuse-values

# Update both images
helm upgrade todo-chatbot ./todo-chatbot \
  --set frontend.image.tag=v2.0.0 \
  --set backend.image.tag=v2.0.0 \
  --reuse-values
```

### Upgrade Backend URL
```bash
# Change backend URL
helm upgrade todo-chatbot ./todo-chatbot \
  --set frontend.env.BACKEND_URL="http://new-backend:80/api" \
  --reuse-values
```

### Upgrade from Modified values.yaml
```bash
# After editing values.yaml directly
helm upgrade todo-chatbot ./todo-chatbot

# Force upgrade (recreate pods)
helm upgrade todo-chatbot ./todo-chatbot --force
```

---

## kubectl-ai Commands for Operations

> **Note**: kubectl-ai requires installation. Install with: `kubectl krew install ai`

### Scaling Operations
```bash
# AI-assisted scaling
kubectl ai "scale the frontend deployment to 10 replicas"
kubectl ai "scale the backend deployment to 5 replicas"
kubectl ai "scale all todo-chatbot deployments to 3 replicas"
```

### Monitoring and Status
```bash
# Check pod status
kubectl ai "show me all pods for todo-chatbot"
kubectl ai "are all todo-chatbot pods running?"
kubectl ai "show me pod resource usage for todo-chatbot"

# Check deployment status
kubectl ai "show deployment status for todo-chatbot"
kubectl ai "show me the rollout history of frontend deployment"

# Check services
kubectl ai "list all services for todo-chatbot"
kubectl ai "show me the ingress configuration"
```

### Troubleshooting
```bash
# Debug failing pods
kubectl ai "why is the frontend pod failing?"
kubectl ai "show me logs from the backend pod"
kubectl ai "describe the failing pod"

# Network troubleshooting
kubectl ai "can the frontend reach the backend service?"
kubectl ai "test connectivity between frontend and backend"

# Resource issues
kubectl ai "which pods are using the most memory?"
kubectl ai "show me pods that are being throttled"
```

### Configuration Management
```bash
# View configurations
kubectl ai "show me all environment variables in frontend deployment"
kubectl ai "what is the backend URL configured in frontend?"

# Update configurations
kubectl ai "update the backend URL environment variable"
kubectl ai "restart all todo-chatbot pods"
```

---

## kagent Commands (Optional AI Operations Tool)

> **Note**: kagent is an optional AI-powered Kubernetes operations tool

### Installation
```bash
# Install kagent (if available)
go install github.com/your-org/kagent@latest
```

### Operations
```bash
# Intelligent pod management
kagent "ensure all todo-chatbot pods are healthy"
kagent "optimize resource allocation for todo-chatbot"

# Automated troubleshooting
kagent "diagnose and fix issues with todo-chatbot deployment"
kagent "why is my ingress not working?"

# Performance optimization
kagent "suggest performance improvements for todo-chatbot"
kagent "analyze and optimize resource requests/limits"
```

---

## Standard kubectl Commands

### Viewing Resources
```bash
# Get all resources
kubectl get all -l app.kubernetes.io/instance=todo-chatbot

# Get pods
kubectl get pods -l app.kubernetes.io/instance=todo-chatbot

# Get deployments
kubectl get deployments -l app.kubernetes.io/instance=todo-chatbot

# Get services
kubectl get services -l app.kubernetes.io/instance=todo-chatbot

# Get ingress
kubectl get ingress
```

### Viewing Logs
```bash
# Frontend logs
kubectl logs -l app.kubernetes.io/component=frontend --tail=100 -f

# Backend logs
kubectl logs -l app.kubernetes.io/component=backend --tail=100 -f

# Specific pod logs
kubectl logs <pod-name> -f
```

### Describing Resources
```bash
# Describe frontend deployment
kubectl describe deployment -l app.kubernetes.io/component=frontend

# Describe backend deployment
kubectl describe deployment -l app.kubernetes.io/component=backend

# Describe ingress
kubectl describe ingress
```

### Port Forwarding (Alternative Access)
```bash
# Forward frontend port
kubectl port-forward service/todo-chatbot-frontend 8080:80

# Forward backend port
kubectl port-forward service/todo-chatbot-backend 8000:80
```

---

## Helm Management Commands

### Viewing Helm Releases
```bash
# List all releases
helm list

# Get release status
helm status todo-chatbot

# Get release values
helm get values todo-chatbot

# Get all release information
helm get all todo-chatbot
```

### Rollback
```bash
# View revision history
helm history todo-chatbot

# Rollback to previous version
helm rollback todo-chatbot

# Rollback to specific revision
helm rollback todo-chatbot 2
```

### Uninstall
```bash
# Uninstall the release
helm uninstall todo-chatbot

# Uninstall and keep history
helm uninstall todo-chatbot --keep-history
```

---

## Verification Commands

### After Installation
```bash
# 1. Check all pods are running
kubectl get pods -l app.kubernetes.io/instance=todo-chatbot

# 2. Check services are created
kubectl get services -l app.kubernetes.io/instance=todo-chatbot

# 3. Check ingress is configured
kubectl get ingress

# 4. Test frontend access
curl http://todo-chatbot.local

# 5. Test backend health
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- curl http://todo-chatbot-backend/api/health
```

### Health Checks
```bash
# Check pod health
kubectl get pods -l app.kubernetes.io/instance=todo-chatbot -o wide

# Check events for issues
kubectl get events --sort-by='.lastTimestamp' | grep todo-chatbot

# Check resource usage
kubectl top pods -l app.kubernetes.io/instance=todo-chatbot
```

---

## Quick Reference

### Common Workflows

**Deploy for the first time:**
```bash
cd C:\Users\BRC\Downloads\PHASE_II\helm-charts
helm install todo-chatbot ./todo-chatbot
```

**Scale replicas:**
```bash
helm upgrade todo-chatbot ./todo-chatbot --set frontend.replicaCount=5 --reuse-values
```

**Update images:**
```bash
helm upgrade todo-chatbot ./todo-chatbot \
  --set frontend.image.tag=v2.0.0 \
  --set backend.image.tag=v2.0.0 \
  --reuse-values
```

**Check status:**
```bash
kubectl get all -l app.kubernetes.io/instance=todo-chatbot
```

**View logs:**
```bash
kubectl logs -l app.kubernetes.io/component=frontend -f
```

**Access application:**
```
http://todo-chatbot.local
```

---

## Troubleshooting Guide

### Pods Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name>
```

### Ingress Not Working
```bash
# Verify ingress controller is running
kubectl get pods -n ingress-nginx

# Check ingress configuration
kubectl describe ingress

# Verify hosts file entry
type C:\Windows\System32\drivers\etc\hosts | findstr todo-chatbot
```

### Image Pull Errors
```bash
# If using local images, load them into Minikube
minikube image load <image-name>:<tag>

# Verify images in Minikube
minikube image ls | findstr todo-chatbot
```

### Service Connection Issues
```bash
# Test service connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -- wget -O- http://todo-chatbot-backend

# Check service endpoints
kubectl get endpoints
```
