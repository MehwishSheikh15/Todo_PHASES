# Research Findings: Minikube Deployment for Todo Chatbot

## Containerization Strategy

### Next.js Application Containerization
For the frontend Next.js application, the optimal approach involves a multi-stage Docker build:

1. **Builder Stage**: Install dependencies and build the application
2. **Runner Stage**: Copy built application to a lightweight Node.js image

Key considerations:
- Use node:18-alpine as the base image for smaller footprint
- Copy package files first for better layer caching
- Implement proper environment variable handling for API URLs
- Use dumb-init for proper signal handling in containers

### FastAPI Application Containerization
For the backend FastAPI application, the approach is similar:

1. Install system dependencies (gcc for certain Python packages)
2. Install Python dependencies
3. Copy application code
4. Set proper environment variables

Key considerations:
- Use python:3.11-slim for optimized image size
- Install system dependencies needed for Python packages
- Properly configure uvicorn for production use

## Environment Variable Mapping

### Current Online Configuration
The online version has:
- Frontend URL: https://hackathon-ii-todo-app-ob5q.vercel.app
- Backend API URL: https://mehwishsheikh15-todo-app.hf.space/api

### Local Kubernetes Configuration
For the local Kubernetes deployment, we need to replace the backend URL with the internal service name:
- Frontend will access backend via: http://todo-backend-service:8000/api
- This will be configured through a Kubernetes ConfigMap
- The environment variable NEXT_PUBLIC_BACKEND_URL will be set to the internal service URL

## Service Discovery Mechanism

### Kubernetes DNS Resolution
Within Kubernetes, services are accessible via DNS names following the pattern:
`<service-name>.<namespace>.svc.cluster.local`

For our deployment:
- Backend service name: `todo-backend-service`
- Namespace: `todo-chatbot`
- Full DNS name: `todo-backend-service.todo-chatbot.svc.cluster.local`
- Short name (within same namespace): `todo-backend-service`

### Internal Communication
- Frontend pods will resolve the backend service using the short name: `todo-backend-service:8000`
- This ensures communication stays within the cluster
- No external network calls are required for internal service communication

## External Access Methods Comparison

### NodePort
Pros:
- Simple to set up
- Direct access to services
- Good for development

Cons:
- Limited port range (30000-32767)
- Less production-like
- No advanced routing capabilities

### Ingress
Pros:
- Production-like setup
- Advanced routing capabilities
- Standard path-based routing
- Closer to production deployment

Cons:
- More complex setup
- Requires ingress controller

### Decision
Ingress is the preferred approach as it provides a more production-like environment and better routing capabilities.

## Helm Best Practices

### Chart Structure
- Use standard Helm chart structure with templates, values.yaml, and Chart.yaml
- Parameterize all configurable values in values.yaml
- Use helpers for common naming patterns
- Include proper labels and selectors

### Template Organization
- Separate templates by resource type (deployment, service, configmap, etc.)
- Use conditional templates for optional resources
- Include proper metadata and annotations

## AI DevOps Tool Integration

### kubectl-ai Integration
kubectl-ai enhances kubectl with AI-powered commands:
- Generate Kubernetes manifests based on natural language descriptions
- Explain existing resources in plain English
- Troubleshoot issues with AI-assisted diagnostics
- Get suggestions for best practices

### Kagent Integration
Kagent provides AI-powered automation for Kubernetes:
- Automated scaling based on resource usage
- Anomaly detection and alerting
- Automated remediation of common issues
- Predictive maintenance

## Security Considerations

### Secrets Management
- Store sensitive data (API keys, passwords) in Kubernetes Secrets
- Use base64 encoding for secret values
- Implement proper RBAC for accessing secrets
- Consider external secrets management for production

### Network Policies
- Implement network policies to restrict traffic between services if needed
- Allow only necessary communication between frontend and backend
- Secure external access through ingress controls

## Resource Management

### Resource Limits and Requests
- Define CPU and memory requests for proper scheduling
- Set limits to prevent resource exhaustion
- Consider different requirements for frontend vs backend
- Plan for horizontal pod autoscaling based on usage

## Health Checks

### Liveness and Readiness Probes
- Implement HTTP-based health checks for both services
- Use appropriate initial delay and timeout values
- Distinguish between liveness (is app alive) and readiness (is app ready to serve traffic)
- Backend health endpoint: /health
- Frontend health check: root path or specific health endpoint if available