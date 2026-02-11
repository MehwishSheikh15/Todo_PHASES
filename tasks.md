# Tasks: Minikube Deployment for Todo Chatbot

## Feature Overview

This document outlines the tasks required to deploy the Todo Chatbot application to a local Minikube cluster, replacing the hosted frontend and backend with local containers. The implementation will maintain the same communication pattern as the online version: **User Browser → Frontend Pod → Backend Pod → Response Returned**.

## Dependencies

- Docker must be installed and running
- Minikube must be installed (version 1.20 or later)
- kubectl must be installed
- Helm must be installed (version 3.x)
- Git must be installed

## Parallel Execution Examples

- T002 [P] and T003 [P]: Install Minikube and kubectl in parallel
- T007 [P] [US1] and T008 [P] [US1]: Create Dockerfiles for frontend and backend in parallel
- T015 [P] [US2] and T016 [P] [US2]: Create ConfigMap and Secret in parallel
- T020 [P] [US3] and T021 [P] [US3]: Update Helm templates in parallel

## Implementation Strategy

The implementation will follow an MVP-first approach focusing on getting the basic deployment working first (User Story 1), then adding more sophisticated features in subsequent phases. Each user story will be implemented as a complete, independently testable increment.

---

## Phase 1: Setup

### Goal
Prepare the environment with all necessary tools and initialize the project structure for Kubernetes deployment.

### Tasks

- [ ] T001 Install Docker Desktop with Kubernetes enabled
- [ ] T002 [P] Install Minikube (run: `choco install minikube kubernetes-cli -y` or download from official site)
- [ ] T003 [P] Install Helm (run: `choco install kubernetes-helm -y` or download from official site)
- [ ] T004 Verify Docker is running (run: `docker --version`)
- [ ] T005 Verify kubectl is available (run: `kubectl version --client`)
- [ ] T006 Verify Helm is available (run: `helm version`)
- [ ] T007 Create directory structure for Kubernetes manifests (mkdir k8s)
- [ ] T008 Create directory structure for Helm chart (mkdir helm\todo-chatbot)

---

## Phase 2: Foundational

### Goal
Establish foundational components that all user stories depend on, including containerization and basic Kubernetes resources.

### Tasks

- [X] T009 Create Dockerfile for backend (C:\Users\NLN\Phase_II\backend\Dockerfile)
- [X] T010 Create Dockerfile for frontend (C:\Users\NLN\Phase_II\frontend\Dockerfile) [COMPLETED - Also created Dockerfile.production for production build]
- [X] T011 Create namespace manifest (C:\Users\NLN\Phase_II\k8s\namespace.yaml)
- [X] T012 Create initial Helm Chart.yaml (C:\Users\NLN\Phase_II\helm\todo-chatbot\Chart.yaml)
- [X] T013 Create initial Helm values.yaml (C:\Users\NLN\Phase_II\helm\todo-chatbot\values.yaml)
- [X] T014 Create Helm templates directory (mkdir C:\Users\NLN\Phase_II\helm\todo-chatbot\templates) [COMPLETED - Created all necessary templates]

---

## Phase 3: [US1] User Accesses Application

### Goal
Enable users to access the application in the browser, with frontend and backend deployed as containers in Kubernetes.

### Independent Test Criteria
- User can access the frontend in browser
- Frontend loads without errors
- Backend is accessible internally
- Health check endpoint returns healthy status

### Tasks

- [ ] T015 [P] [US1] Build backend Docker image (run: `cd backend && docker build -t todo-backend:latest .`)
- [ ] T016 [P] [US1] Build frontend Docker image (run: `cd frontend && docker build -t todo-frontend:latest .`)
- [ ] T017 [US1] Start Minikube cluster (run: `minikube start --driver=hyperv --memory=4096 --cpus=2`)
- [ ] T018 [US1] Enable ingress addon in Minikube (run: `minikube addons enable ingress`)
- [X] T019 [US1] Create ConfigMap for environment configuration (C:\Users\NLN\Phase_II\k8s\configmaps-and-secrets.yaml)
- [X] T020 [US1] Create Secret for sensitive data (update C:\Users\NLN\Phase_II\k8s\configmaps-and-secrets.yaml)
- [X] T021 [US1] Create backend deployment and service (C:\Users\NLN\Phase_II\k8s\backend-deployment-service.yaml)
- [X] T022 [US1] Create frontend deployment and service (C:\Users\NLN\Phase_II\k8s\frontend-deployment-service.yaml)
- [X] T023 [US1] Create ingress for external access (C:\Users\NLN\Phase_II\k8s\ingress.yaml)
- [X] T024 [US1] Apply all Kubernetes manifests (run: `kubectl apply -f k8s/`) [COMPLETED - Created pv-pvc.yaml as well]
- [ ] T025 [US1] Wait for deployments to be ready (run: `kubectl wait --for=condition=available deployment/todo-backend-deployment -n todo-chatbot --timeout=300s && kubectl wait --for=condition=available deployment/todo-frontend-deployment -n todo-chatbot --timeout=300s`)

---

## Phase 4: [US2] User Interacts with Backend Features

### Goal
Enable communication between frontend and backend pods using internal Kubernetes service names, allowing users to perform actions that require backend communication.

### Independent Test Criteria
- Frontend successfully communicates with backend via internal service
- API requests from frontend reach backend
- Responses are received and processed correctly
- All backend API endpoints are accessible

### Tasks

- [ ] T026 [US2] Update frontend environment to use internal backend service (modify C:\Users\NLN\Phase_II\k8s\frontend-deployment-service.yaml to use BACKEND_SERVICE_URL)
- [ ] T027 [US2] Create Kubernetes service for backend (ensure C:\Users\NLN\Phase_II\k8s\backend-deployment-service.yaml has ClusterIP service)
- [ ] T028 [US2] Verify internal service communication (run: `kubectl exec -it deployment/todo-frontend-deployment -n todo-chatbot -- curl -v http://todo-backend-service:8000/health`)
- [ ] T029 [US2] Test API endpoint access (run: `kubectl exec -it deployment/todo-frontend-deployment -n todo-chatbot -- curl -v http://todo-backend-service:8000/api/health`)
- [X] T030 [US2] Update Helm template for frontend config (C:\Users\NLN\Phase_II\helm\todo-chatbot\templates\frontend-deployment-service.yaml)
- [X] T031 [US2] Update Helm template for backend service (C:\Users\NLN\Phase_II\helm\todo-chatbot\templates\backend-deployment-service.yaml)
- [X] T032 [US2] Test updated Helm chart (run: `helm upgrade todo-chatbot ./helm/todo-chatbot --namespace todo-chatbot --wait`)

---

## Phase 5: [US3] System Health Monitoring

### Goal
Implement health monitoring for both frontend and backend services to ensure system stability and operational awareness.

### Independent Test Criteria
- Health check endpoint returns healthy status
- Kubernetes liveness and readiness probes work correctly
- Both services remain operational under normal load
- Health status is accessible for monitoring

### Tasks

- [ ] T033 [US3] Configure backend liveness probe (update C:\Users\NLN\Phase_II\k8s\backend-deployment-service.yaml)
- [ ] T034 [US3] Configure backend readiness probe (update C:\Users\NLN\Phase_II\k8s\backend-deployment-service.yaml)
- [ ] T035 [US3] Configure frontend liveness probe (update C:\Users\NLN\Phase_II\k8s\frontend-deployment-service.yaml)
- [ ] T036 [US3] Configure frontend readiness probe (update C:\Users\NLN\Phase_II\k8s\frontend-deployment-service.yaml)
- [ ] T037 [US3] Test health endpoint accessibility (run: `kubectl get pods -n todo-chatbot && kubectl logs -l app=todo-backend -n todo-chatbot`)
- [X] T038 [US3] Update Helm templates for health checks (C:\Users\NLN\Phase_II\helm\todo-chatbot\templates\backend-deployment-service.yaml)
- [X] T039 [US3] Update Helm templates for health checks (C:\Users\NLN\Phase_II\helm\todo-chatbot\templates\frontend-deployment-service.yaml)
- [X] T040 [US3] Verify health monitoring with Helm deployment (run: `helm upgrade todo-chatbot ./helm/todo-chatbot --namespace todo-chatbot --wait && kubectl get pods -n todo-chatbot`)

---

## Phase 6: Polish & Cross-Cutting Concerns

### Goal
Complete the deployment with AI DevOps tools integration, scaling capabilities, and operational scripts.

### Tasks

- [ ] T041 Install kubectl-ai plugin (follow official installation guide)
- [ ] T042 Create operational scripts for common tasks (C:\Users\NLN\Phase_II\deploy-k8s.bat)
- [ ] T043 Document kubectl-ai usage for the deployment (C:\Users\NLN\Phase_II\KUBERNETES_DEPLOYMENT.md)
- [ ] T044 Test scaling capabilities (run: `kubectl scale deployment todo-backend-deployment -n todo-chatbot --replicas=3 && kubectl scale deployment todo-frontend-deployment -n todo-chatbot --replicas=3`)
- [ ] T045 Test failure recovery (manually delete a pod and verify it's recreated)
- [ ] T046 Create cleanup script (C:\Users\NLN\Phase_II\cleanup-k8s.bat)
- [ ] T047 Update documentation with complete deployment instructions (C:\Users\NLN\Phase_II\KUBERNETES_DEPLOYMENT.md)
- [ ] T048 Perform end-to-end validation (access application in browser and test functionality)
- [X] T049 Package Helm chart for distribution (run: `helm package ./helm/todo-chatbot`)
- [ ] T050 Document AI DevOps tool integration points (C:\Users\NLN\Phase_II\KUBERNETES_DEPLOYMENT.md)