# Todo Chatbot - Ubuntu/WSL Deployment Guide

## 🚀 One-Shot Deployment

### Quick Deploy (Recommended)
```bash
cd /mnt/c/Users/BRC/Downloads/PHASE_II
chmod +x deploy-todo-chatbot.sh
./deploy-todo-chatbot.sh
```

### One-Liner Command
```bash
cd /mnt/c/Users/BRC/Downloads/PHASE_II && helm uninstall todo-chatbot -n todo-app 2>/dev/null; kubectl delete namespace todo-app --ignore-not-found=true && sleep 5 && kubectl create namespace todo-app && minikube image load todo-frontend:latest 2>/dev/null && minikube image load todo-backend:latest 2>/dev/null && helm install todo-chatbot ./todo-chatbot -n todo-app && sleep 10 && kubectl get all -n todo-app && echo "Access at: http://$(minikube ip):30080"
```

---

## 📋 Prerequisites Installation (Ubuntu/WSL)

### Install Minikube
```bash
# Download and install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64

# Verify installation
minikube version
```

### Install kubectl
```bash
# Download kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Install kubectl
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl

# Verify installation
kubectl version --client
```

### Install Helm
```bash
# Download and install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify installation
helm version
```

### Install Docker (if not already installed)
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io

# Add user to docker group
sudo usermod -aG docker $USER

# Restart shell or run
newgrp docker
```

---

## 🎯 Step-by-Step Deployment

### 1. Start Minikube
```bash
# Start Minikube with Docker driver
minikube start --driver=docker

# Verify status
minikube status
```

### 2. Build Docker Images (if not already built)
```bash
# Navigate to project directory
cd /mnt/c/Users/BRC/Downloads/PHASE_II

# Build frontend image
docker build -t todo-frontend:latest ./frontend

# Build backend image
docker build -t todo-backend:latest ./backend

# Verify images
docker images | grep todo
```

### 3. Clean Up Previous Deployment
```bash
# Uninstall previous release
helm uninstall todo-chatbot -n todo-app 2>/dev/null || true

# Delete namespace
kubectl delete namespace todo-app --ignore-not-found=true

# Wait for cleanup
sleep 5
```

### 4. Create Namespace
```bash
kubectl create namespace todo-app
```

### 5. Load Images into Minikube
```bash
# Load frontend image
minikube image load todo-frontend:latest

# Load backend image
minikube image load todo-backend:latest

# Verify images in Minikube
minikube image ls | grep todo
```

### 6. Deploy with Helm
```bash
cd /mnt/c/Users/BRC/Downloads/PHASE_II
helm install todo-chatbot ./todo-chatbot -n todo-app
```

### 7. Verify Deployment
```bash
# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=todo-chatbot -n todo-app --timeout=120s

# Check all resources
kubectl get all -n todo-app

# Check pod status
kubectl get pods -n todo-app

# Check services
kubectl get svc -n todo-app
```

### 8. Access Application
```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)
echo "Access frontend at: http://$MINIKUBE_IP:30080"

# Open in browser (if WSL with Windows)
explorer.exe "http://$MINIKUBE_IP:30080"
```

---

## 🔍 Verification Commands

### Check Pod Status
```bash
kubectl get pods -n todo-app -w
```

### View Logs
```bash
# Frontend logs
kubectl logs -l app.kubernetes.io/component=frontend -n todo-app -f

# Backend logs
kubectl logs -l app.kubernetes.io/component=backend -n todo-app -f

# Specific pod
kubectl logs <pod-name> -n todo-app
```

### Describe Resources
```bash
# Describe pods
kubectl describe pods -n todo-app

# Describe services
kubectl describe svc -n todo-app

# Describe deployments
kubectl describe deployments -n todo-app
```

### Test Connectivity
```bash
# Test frontend
curl http://$(minikube ip):30080

# Test backend from within cluster
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -n todo-app -- curl http://todo-chatbot-backend:5000/health
```

---

## 🔧 Troubleshooting

### Pods Not Starting
```bash
# Check pod events
kubectl describe pod <pod-name> -n todo-app

# Check logs
kubectl logs <pod-name> -n todo-app

# Check all events
kubectl get events -n todo-app --sort-by='.lastTimestamp'
```

### Image Pull Errors
```bash
# Verify images are in Minikube
minikube image ls | grep todo

# If missing, load them
minikube image load todo-frontend:latest
minikube image load todo-backend:latest

# Check image pull policy in values.yaml (should be "Never" for local images)
```

### Service Not Accessible
```bash
# Check service
kubectl get svc -n todo-app

# Check NodePort
kubectl describe svc todo-chatbot-frontend -n todo-app | grep NodePort

# Verify Minikube IP
minikube ip

# Check if Minikube tunnel is needed
minikube service todo-chatbot-frontend -n todo-app --url
```

---

## 🧹 Clean Up

### Uninstall Application
```bash
helm uninstall todo-chatbot -n todo-app
kubectl delete namespace todo-app
```

### Stop Minikube
```bash
minikube stop
```

### Delete Minikube Cluster
```bash
minikube delete
```

---

## 📊 Configuration Summary

| Component | Image | Service Type | Port | NodePort | Replicas |
|-----------|-------|--------------|------|----------|----------|
| Frontend | todo-frontend:latest | NodePort | 80 | 30080 | 1 |
| Backend | todo-backend:latest | ClusterIP | 5000 | - | 2 |

**Namespace:** todo-app  
**Frontend URL:** http://\<minikube-ip\>:30080  
**Backend URL:** http://todo-backend:5000 (internal)

---

## 🎓 Quick Reference

```bash
# Deploy everything
cd /mnt/c/Users/BRC/Downloads/PHASE_II && ./deploy-todo-chatbot.sh

# Check status
kubectl get all -n todo-app

# View logs
kubectl logs -l app.kubernetes.io/component=frontend -n todo-app -f

# Get access URL
echo "http://$(minikube ip):30080"

# Uninstall
helm uninstall todo-chatbot -n todo-app
```
