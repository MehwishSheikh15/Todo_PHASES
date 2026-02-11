# Implementation Plan: Minikube Deployment for Todo Chatbot

## Technical Context

This plan outlines the deployment of the Todo Chatbot application to a local Minikube cluster, replacing the hosted frontend and backend with local containers. The implementation will maintain the same communication pattern as the online version: **User Browser → Frontend Pod → Backend Pod → Response Returned**.

### Current Architecture
- Online Frontend: https://hackathon-ii-todo-app-ob5q.vercel.app
- Online Backend: https://mehwishsheikh15-todo-app.hf.space
- Communication: Frontend calls backend via /api routes

### Target Architecture
- Local Frontend: Container running Next.js application
- Local Backend: Container running FastAPI application
- Internal Communication: Frontend pod calls backend pod via Kubernetes service name
- External Access: Via NodePort or Ingress

### Technologies
- Container Runtime: Docker
- Orchestration: Kubernetes (Minikube)
- Packaging: Helm
- AI DevOps Tools: kubectl-ai, Kagent

## Constitution Check

### Library-First Approach
- [ ] Each component (frontend, backend) should be containerizable as a standalone unit
- [ ] Services must be independently deployable and testable

### CLI Interface
- [ ] Deployment process must be scriptable via CLI commands
- [ ] All operations should support text-based output for automation

### Test-First (NON-NEGOTIABLE)
- [ ] Deployment validation must include functional tests
- [ ] Health checks must verify service availability

### Integration Testing
- [ ] Test inter-service communication between frontend and backend
- [ ] Verify API contract compliance between services

### Observability
- [ ] Deployments must include proper logging
- [ ] Health endpoints must be accessible for monitoring

## Gates

### Gate 1: Architecture Compatibility
- [ ] Containerization approach compatible with existing codebase
- [ ] Kubernetes service discovery works with current frontend configuration

### Gate 2: Environment Configuration
- [ ] Environment variables properly configured for internal service communication
- [ ] Secrets management implemented for sensitive data

### Gate 3: Deployment Validation
- [ ] Successful deployment to Minikube
- [ ] All services accessible and functional
- [ ] Internal communication between services verified

## Phase 0: Outline & Research

### Research Tasks

#### RT-1: Containerization Strategy
**Task**: Research optimal containerization approach for Next.js and FastAPI applications
**Focus**: 
- Best practices for containerizing Next.js applications
- Optimal base images for FastAPI applications
- Multi-stage build considerations

#### RT-2: Environment Variable Mapping
**Task**: Determine how to map online environment variables to local Kubernetes equivalents
**Focus**:
- How the online frontend accesses the backend API
- What environment variable holds the backend URL
- How to replace this with internal Kubernetes service name

#### RT-3: Service Discovery Mechanism
**Task**: Research Kubernetes service discovery for internal pod communication
**Focus**:
- How services are named and accessed within the cluster
- Best practices for service-to-service communication
- DNS resolution within Kubernetes

#### RT-4: NodePort vs Ingress Access
**Task**: Compare NodePort and Ingress for exposing frontend to browser
**Focus**:
- Pros and cons of each approach
- Ease of access for local development
- Future production readiness

#### RT-5: Helm Best Practices
**Task**: Research Helm chart best practices for multi-service applications
**Focus**:
- Proper structuring of templates
- Configuration management via values.yaml
- Dependency handling between services

#### RT-6: AI DevOps Tool Integration
**Task**: Investigate integration points for kubectl-ai and Kagent
**Focus**:
- How kubectl-ai can assist with Kubernetes operations
- How Kagent can automate operational tasks
- Best practices for AI-assisted operations

### Research Findings

#### Decision: Containerization Approach
**Rationale**: Use multi-stage builds for both frontend and backend to optimize image size and security
**Alternatives considered**: Single-stage builds were considered but rejected due to larger image sizes

#### Decision: Environment Variable Replacement
**Rationale**: Replace the online backend URL with internal Kubernetes service name via ConfigMap
**Alternatives considered**: Hardcoding service name in image vs. using ConfigMap (ConfigMap chosen for flexibility)

#### Decision: Service Naming Convention
**Rationale**: Use standard Kubernetes naming convention: `<service-name>:<port>`
**Specifics**: Backend service will be accessible as `todo-backend-service:8000`

#### Decision: External Access Method
**Rationale**: Use Ingress for external access to match production-like setup
**Alternatives considered**: NodePort was considered but Ingress provides better routing and is closer to production

#### Decision: AI Tool Integration Points
**Rationale**: Integrate kubectl-ai for command assistance and Kagent for operational automation
**Specifics**: Use kubectl-ai for generating Kubernetes manifests and troubleshooting; use Kagent for monitoring and auto-scaling

## Phase 1: Design & Contracts

### Data Model

#### DM-1: Frontend Configuration
- **Entity**: FrontendConfig
- **Fields**: 
  - BACKEND_SERVICE_URL (string): Internal service URL for backend communication
  - FRONTEND_PORT (int): Port on which frontend runs
- **Relationships**: References BackendService for API communication
- **Validation**: BACKEND_SERVICE_URL must be a valid Kubernetes service name

#### DM-2: Backend Service
- **Entity**: BackendService
- **Fields**:
  - SERVICE_NAME (string): Kubernetes service name
  - PORT (int): Port number for API access
  - HEALTH_ENDPOINT (string): Path for health checks
- **Relationships**: Accessed by FrontendService
- **State Transitions**: Healthy → Unhealthy → Healthy (based on health checks)

#### DM-3: Kubernetes Deployment
- **Entity**: K8SDeployment
- **Fields**:
  - NAMESPACE (string): Kubernetes namespace
  - REPLICAS (int): Number of pod replicas
  - RESOURCE_LIMITS (object): CPU and memory limits
- **Relationships**: Contains FrontendService and BackendService
- **Validation**: Resource limits must be within cluster capacity

### API Contracts

#### AC-1: Backend Health Check
- **Endpoint**: GET /health
- **Request**: No parameters
- **Response**: 
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-01-19T22:59:00Z",
    "version": "1.0.0"
  }
  ```
- **Error Codes**: 500 for unhealthy state

#### AC-2: Frontend-Backend Communication
- **Pattern**: All API calls from frontend to backend follow: `{BACKEND_SERVICE_URL}/api/{endpoint}`
- **Headers**: Standard HTTP headers
- **Authentication**: Bearer token in Authorization header (if required)

### Quickstart Guide

#### QSG-1: Local Development Setup
1. Clone the repository
2. Install Docker and Minikube
3. Start Minikube cluster
4. Build Docker images for frontend and backend
5. Deploy using Helm chart
6. Access the application via Ingress

#### QSG-2: Verification Steps
1. Check all pods are running: `kubectl get pods -n todo-chatbot`
2. Verify services are accessible: `kubectl get svc -n todo-chatbot`
3. Test internal communication between services
4. Access frontend via browser and verify functionality

## Phase 2: Implementation Plan

### IP-1: Containerization
**Objective**: Create Docker images for both frontend and backend applications
**Tasks**:
- Create Dockerfile for frontend (Next.js)
- Create Dockerfile for backend (FastAPI)
- Build and test images locally
- Tag images appropriately for deployment

### IP-2: Kubernetes Resources
**Objective**: Create Kubernetes manifests for deployment
**Tasks**:
- Create ConfigMap for environment configuration
- Create Secret for sensitive data
- Create Deployments for frontend and backend
- Create Services for internal communication
- Create Ingress for external access

### IP-3: Helm Chart
**Objective**: Package deployment as a Helm chart
**Tasks**:
- Create Helm chart structure
- Convert Kubernetes manifests to templates
- Parameterize configuration in values.yaml
- Test Helm chart installation and upgrades

### IP-4: AI DevOps Integration
**Objective**: Integrate kubectl-ai and Kagent for enhanced operations
**Tasks**:
- Document kubectl-ai usage for common operations
- Configure Kagent for monitoring and automation
- Create operational scripts leveraging AI tools

## Re-Evaluation of Constitution Check Post-Design

### Library-First Approach
- [x] Each component (frontend, backend) is containerizable as a standalone unit
- [x] Services are independently deployable and testable via Helm releases

### CLI Interface
- [x] Deployment process is scriptable via CLI commands (kubectl, helm)
- [x] All operations support text-based output for automation

### Test-First (NON-NEGOTIABLE)
- [x] Deployment validation includes functional tests
- [x] Health checks verify service availability

### Integration Testing
- [x] Inter-service communication between frontend and backend is tested
- [x] API contract compliance between services is verified

### Observability
- [x] Deployments include proper logging
- [x] Health endpoints are accessible for monitoring