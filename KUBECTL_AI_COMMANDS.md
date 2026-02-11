# kubectl-ai Commands for Todo Chatbot Management

## Deploy all manifests in this folder
```bash
kubectl-ai apply all resources in the k8s directory
```

Or more specifically:
```bash
kubectl-ai deploy all manifests in C:\Users\NLN\Phase_II\k8s
```

## Expose todo-frontend as NodePort
```bash
kubectl-ai expose deployment todo-frontend --type=NodePort --port=80 --target-port=3000 --name=todo-frontend-service
```

Alternatively, if the service already exists but isn't a NodePort:
```bash
kubectl-ai patch service todo-frontend -p '{"spec":{"type":"NodePort"}}'
```

## Scale todo-backend to 3 replicas
```bash
kubectl-ai scale deployment todo-backend --replicas=3
```

## Check why any pod is crashing
```bash
kubectl-ai explain why pods in todo-app namespace are crashing
```

More specifically:
```bash
kubectl-ai check logs for crashing pods in todo-app namespace
```

Or to get more detailed diagnostic information:
```bash
kubectl-ai diagnose pod issues in todo-app namespace
kubectl-ai show events for pods in todo-app namespace
kubectl-ai get pod statuses with reasons in todo-app namespace
```

## Additional Useful kubectl-ai Commands

### Check overall system status
```bash
kubectl-ai show status of all resources in todo-app namespace
```

### Get detailed information about deployments
```bash
kubectl-ai describe deployments in todo-app namespace
```

### Troubleshoot service connectivity
```bash
kubectl-ai troubleshoot connectivity between frontend and backend in todo-app
```

### Check resource utilization
```bash
kubectl-ai show resource usage for pods in todo-app namespace
```

### Rollback deployment if needed
```bash
kubectl-ai rollback deployment todo-backend in todo-app namespace
```

These kubectl-ai commands leverage AI to help you manage your Kubernetes resources more efficiently, providing natural language interfaces to common kubectl operations.