# 🚀 One-Shot Deployment Commands

## Quick Deploy (Recommended)

### Windows
```powershell
cd C:\Users\BRC\Downloads\PHASE_II && .\deploy-todo-chatbot.bat
```

### Linux/Mac
```bash
cd /path/to/PHASE_II && chmod +x deploy-todo-chatbot.sh && ./deploy-todo-chatbot.sh
```

---

## Manual One-Line Deployment

### Complete Deployment (Copy & Paste)
```bash
kubectl delete namespace todo-app --ignore-not-found=true && sleep 5 && kubectl create namespace todo-app && minikube image load todo-frontend:latest 2>/dev/null || echo "Frontend image not found" && minikube image load todo-backend:latest 2>/dev/null || echo "Backend image not found" && helm install todo-chatbot ./todo-chatbot -n todo-app && kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=todo-chatbot -n todo-app --timeout=120s && kubectl get all -n todo-app && echo "Access at: http://$(minikube ip):30080"
```

### Windows PowerShell One-Liner
```powershell
kubectl delete namespace todo-app --ignore-not-found=true; Start-Sleep 5; kubectl create namespace todo-app; minikube image load todo-frontend:latest; minikube image load todo-backend:latest; helm install todo-chatbot .\todo-chatbot -n todo-app; Start-Sleep 10; kubectl get all -n todo-app; $ip = minikube ip; Write-Host "Access at: http://$ip:30080"
```

---

## Step-by-Step Manual Deployment

### 1. Clean Up Previous Deployment
```bash
helm uninstall todo-chatbot -n todo-app 2>/dev/null || true
kubectl delete namespace todo-app --ignore-not-found=true
sleep 5
```

### 2. Create Namespace
```bash
kubectl create namespace todo-app
```

### 3. Load Docker Images (if built locally)
```bash
# Load frontend image
minikube image load todo-frontend:latest

# Load backend image
minikube image load todo-backend:latest

# Verify images are loaded
minikube image ls | grep todo
```

### 4. Deploy with Helm
```bash
cd C:\Users\BRC\Downloads\PHASE_II
helm install todo-chatbot ./todo-chatbot -n todo-app
```

### 5. Verify Deployment
```bash
# Check all resources
kubectl get all -n todo-app

# Check pod status
kubectl get pods -n todo-app

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=todo-chatbot -n todo-app --timeout=120s
```

### 6. Get Access URL
```bash
# Get Minikube IP
minikube ip

# Access frontend at:
# http://<minikube-ip>:30080
```

---

## Verification Commands

### Check Pod Status
```bash
kubectl get pods -n todo-app
```

**Expected Output:**
```
NAME                              READY   STATUS    RESTARTS   AGE
todo-chatbot-frontend-xxxxx       1/1     Running   0          1m
todo-chatbot-backend-xxxxx        1/1     Running   0          1m
todo-chatbot-backend-xxxxx        1/1     Running   0          1m
```

### Check Services
```bash
kubectl get svc -n todo-app
```

**Expected Output:**
```
NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
todo-chatbot-frontend   NodePort    10.96.xxx.xxx   <none>        80:30080/TCP   1m
todo-chatbot-backend    ClusterIP   10.96.xxx.xxx   <none>        5000/TCP       1m
```

### View Logs
```bash
# Frontend logs
kubectl logs -l app.kubernetes.io/component=frontend -n todo-app -f

# Backend logs
kubectl logs -l app.kubernetes.io/component=backend -n todo-app -f
```

### Test Frontend Access
```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# Test frontend
curl http://$MINIKUBE_IP:30080

# Or open in browser
start http://$MINIKUBE_IP:30080  # Windows
open http://$MINIKUBE_IP:30080   # Mac
xdg-open http://$MINIKUBE_IP:30080  # Linux
```

---

## Troubleshooting

### Pods Not Starting
```bash
# Describe pod to see events
kubectl describe pod -n todo-app <pod-name>

# Check logs
kubectl logs -n todo-app <pod-name>
```

### Image Pull Errors
```bash
# Verify images are in Minikube
minikube image ls | grep todo

# If missing, load them
minikube image load todo-frontend:latest
minikube image load todo-backend:latest
```

### Service Not Accessible
```bash
# Verify service
kubectl get svc -n todo-app

# Check NodePort
kubectl describe svc todo-chatbot-frontend -n todo-app

# Verify Minikube IP
minikube ip
```

---

## Clean Up

### Uninstall Everything
```bash
helm uninstall todo-chatbot -n todo-app
kubectl delete namespace todo-app
```

### Quick Reinstall
```bash
helm uninstall todo-chatbot -n todo-app && kubectl delete namespace todo-app && sleep 5 && kubectl create namespace todo-app && helm install todo-chatbot ./todo-chatbot -n todo-app
```

---

## Configuration Summary

| Component | Image | Service Type | Port | Replicas |
|-----------|-------|--------------|------|----------|
| Frontend | `todo-frontend:latest` | NodePort | 80 → 30080 | 1 |
| Backend | `todo-backend:latest` | ClusterIP | 5000 | 2 |

**Environment Variables:**
- Frontend: `NEXT_PUBLIC_BACKEND_URL=http://todo-backend:5000`
- Backend: `PORT=5000`

**Namespace:** `todo-app`
