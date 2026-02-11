# 🚀 Quick Start Guide - Todo Chatbot Deployment

## Prerequisites
```bash
# 1. Start Minikube
minikube start --driver=docker

# 2. Enable Ingress
minikube addons enable ingress

# 3. Add to hosts file (PowerShell as Admin)
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "$(minikube ip) todo-chatbot.local"
```

## Build & Load Images
```bash
# Frontend
cd C:\Users\BRC\Downloads\PHASE_II\docker\frontend
docker build -t todo-chatbot-frontend:latest .
minikube image load todo-chatbot-frontend:latest

# Backend
cd C:\Users\BRC\Downloads\PHASE_II\docker\backend
docker build -t todo-chatbot-backend:latest .
minikube image load todo-chatbot-backend:latest
```

## Deploy
```bash
cd C:\Users\BRC\Downloads\PHASE_II\helm-charts
helm install todo-chatbot ./todo-chatbot
```

## Verify
```bash
kubectl get all -l app.kubernetes.io/instance=todo-chatbot
```

## Access
```
http://todo-chatbot.local
```

## Scale
```bash
helm upgrade todo-chatbot ./todo-chatbot --set frontend.replicaCount=5 --reuse-values
```

## Update Images
```bash
helm upgrade todo-chatbot ./todo-chatbot --set frontend.image.tag=v2.0.0 --reuse-values
```

## Troubleshoot
```bash
kubectl logs -l app.kubernetes.io/component=frontend -f
kubectl describe pod <pod-name>
```

## Uninstall
```bash
helm uninstall todo-chatbot
```

---

📖 **Full Documentation**: See [walkthrough.md](file:///C:/Users/BRC/.gemini/antigravity/brain/29dec097-1971-41de-8d23-48af9018fe53/walkthrough.md)
