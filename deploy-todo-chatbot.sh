#!/bin/bash
# Todo Chatbot - One-Shot Minikube Deployment Script
# Deploys frontend and backend to Minikube with full cleanup and verification

set -e  # Exit on error

echo "========================================="
echo "Todo Chatbot Minikube Deployment"
echo "========================================="
echo ""

# Step 1: Check prerequisites
echo "[Step 1/9] Checking prerequisites..."
command -v minikube >/dev/null 2>&1 || { echo "ERROR: minikube not found. Install it first."; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "ERROR: kubectl not found. Install it first."; exit 1; }
command -v helm >/dev/null 2>&1 || { echo "ERROR: helm not found. Install it first."; exit 1; }
echo "✓ All prerequisites found"
echo ""

# Step 2: Verify Minikube is running
echo "[Step 2/9] Checking Minikube status..."
if ! minikube status &>/dev/null; then
    echo "Minikube is not running. Starting Minikube..."
    minikube start --driver=docker
else
    echo "✓ Minikube is running"
fi
echo ""

# Step 3: Clean up previous deployment
echo "[Step 3/9] Cleaning up previous deployment..."
helm uninstall todo-chatbot -n todo-app 2>/dev/null && echo "✓ Uninstalled previous Helm release" || echo "No previous release found"
kubectl delete namespace todo-app --ignore-not-found=true && echo "✓ Deleted namespace" || true
echo "Waiting for cleanup to complete..."
sleep 5
echo ""

# Step 4: Create namespace
echo "[Step 4/9] Creating namespace todo-app..."
kubectl create namespace todo-app
echo "✓ Namespace created"
echo ""

# Step 5: Load Docker images into Minikube
echo "[Step 5/9] Loading Docker images into Minikube..."
if docker images | grep -q "todo-frontend"; then
    echo "Loading todo-frontend:latest..."
    minikube image load todo-frontend:latest
    echo "✓ Frontend image loaded"
else
    echo "⚠ WARNING: todo-frontend image not found locally"
    echo "   The deployment may fail. Build the image first with:"
    echo "   docker build -t todo-frontend:latest ./frontend"
fi

if docker images | grep -q "todo-backend"; then
    echo "Loading todo-backend:latest..."
    minikube image load todo-backend:latest
    echo "✓ Backend image loaded"
else
    echo "⚠ WARNING: todo-backend image not found locally"
    echo "   The deployment may fail. Build the image first with:"
    echo "   docker build -t todo-backend:latest ./backend"
fi
echo ""

# Step 6: Deploy with Helm
echo "[Step 6/9] Deploying with Helm..."
cd "$(dirname "$0")"
helm install todo-chatbot ./todo-chatbot -n todo-app
echo "✓ Helm deployment initiated"
echo ""

# Step 7: Wait for pods to be ready
echo "[Step 7/9] Waiting for pods to be ready (max 120s)..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=todo-chatbot -n todo-app --timeout=120s || {
    echo "⚠ WARNING: Some pods may not be ready yet"
    echo "Check status with: kubectl get pods -n todo-app"
}
echo ""

# Step 8: Display deployment status
echo "[Step 8/9] Deployment Status"
echo "========================================="
kubectl get all -n todo-app
echo ""

echo "Pod Status:"
echo "========================================="
kubectl get pods -n todo-app
echo ""

echo "Services:"
echo "========================================="
kubectl get svc -n todo-app
echo ""

# Step 9: Get access URL
echo "[Step 9/9] Getting access information..."
MINIKUBE_IP=$(minikube ip)
echo ""
echo "========================================="
echo "✓ DEPLOYMENT COMPLETE!"
echo "========================================="
echo "Frontend URL: http://$MINIKUBE_IP:30080"
echo "Backend Service: todo-backend:5000 (internal)"
echo ""
echo "Useful Commands:"
echo "  View logs (frontend): kubectl logs -l app.kubernetes.io/component=frontend -n todo-app -f"
echo "  View logs (backend):  kubectl logs -l app.kubernetes.io/component=backend -n todo-app -f"
echo "  Check status:         kubectl get all -n todo-app"
echo "  Uninstall:            helm uninstall todo-chatbot -n todo-app"
echo "========================================="
