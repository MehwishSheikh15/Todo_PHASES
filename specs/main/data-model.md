# Data Model: Todo Chatbot Kubernetes Deployment

## Frontend Configuration

### Entity: FrontendConfig
**Description**: Configuration parameters for the frontend Next.js application

**Fields**:
- `BACKEND_SERVICE_URL` (string): Internal Kubernetes service URL for backend communication
  - Format: `http://<service-name>:<port>`
  - Example: `http://todo-backend-service:8000`
  - Required: Yes
- `FRONTEND_PORT` (integer): Port on which frontend runs inside container
  - Default: 3000
  - Required: No (uses default)
- `NEXT_PUBLIC_BACKEND_URL` (string): Environment variable for frontend to know backend location
  - Value comes from BACKEND_SERVICE_URL
  - Required: Yes

**Relationships**:
- References: BackendService for API communication
- Used by: FrontendDeployment to configure environment

**Validation Rules**:
- BACKEND_SERVICE_URL must be a valid HTTP URL
- BACKEND_SERVICE_URL must follow Kubernetes service naming convention

## Backend Service

### Entity: BackendService
**Description**: Configuration for the backend FastAPI application

**Fields**:
- `SERVICE_NAME` (string): Kubernetes service name
  - Format: `<name>-service`
  - Example: `todo-backend-service`
  - Required: Yes
- `PORT` (integer): Port number for API access
  - Default: 8000
  - Required: No (uses default)
- `HEALTH_ENDPOINT` (string): Path for health checks
  - Default: `/health`
  - Required: No (uses default)
- `API_PREFIX` (string): Path prefix for all API endpoints
  - Default: `/api`
  - Required: No (uses default)

**Relationships**:
- Accessed by: FrontendService for API communication
- Implemented by: BackendDeployment and BackendService resources

**State Transitions**:
- `Starting` → `Healthy` (after successful initialization)
- `Healthy` → `Unhealthy` (when health checks fail)
- `Unhealthy` → `Healthy` (when health checks resume passing)

**Validation Rules**:
- SERVICE_NAME must follow Kubernetes naming conventions (lowercase, alphanumeric, hyphens only)
- PORT must be a valid port number (1-65535)

## Kubernetes Deployment

### Entity: K8SDeployment
**Description**: Kubernetes deployment configuration for the application

**Fields**:
- `NAMESPACE` (string): Kubernetes namespace for the deployment
  - Default: `todo-chatbot`
  - Required: No (uses default)
- `REPLICAS` (integer): Number of pod replicas for each service
  - Default: 1
  - Range: 1-100
  - Required: No (uses default)
- `RESOURCE_LIMITS` (object): CPU and memory limits for containers
  - Structure: `{cpu: string, memory: string}`
  - Example: `{cpu: "500m", memory: "512Mi"}`
  - Required: No (uses defaults)
- `RESOURCE_REQUESTS` (object): CPU and memory requests for containers
  - Structure: `{cpu: string, memory: string}`
  - Example: `{cpu: "250m", memory: "256Mi"}`
  - Required: No (uses defaults)

**Relationships**:
- Contains: FrontendDeployment and BackendDeployment
- Uses: ConfigMap and Secret for configuration
- Exposes: FrontendService and BackendService

**Validation Rules**:
- NAMESPACE must follow Kubernetes naming conventions
- REPLICAS must be a positive integer
- RESOURCE_LIMITS and REQUESTS must be valid Kubernetes resource specifications

## Kubernetes Service

### Entity: K8SService
**Description**: Kubernetes service configuration for internal and external access

**Fields**:
- `TYPE` (string): Type of service (ClusterIP, NodePort, LoadBalancer)
  - Default: ClusterIP for backend, depends on configuration for frontend
  - Required: No (uses default)
- `PORT` (integer): Port exposed by the service
  - Required: Yes
- `TARGET_PORT` (integer): Port on the pod to forward traffic to
  - Required: Yes
- `SELECTOR` (object): Labels to match pods for traffic routing
  - Structure: `{key: value}`
  - Required: Yes

**Relationships**:
- Routes to: Pods defined by corresponding Deployment
- Referenced by: Ingress for external access (frontend service)

**Validation Rules**:
- TYPE must be a valid Kubernetes service type
- PORT and TARGET_PORT must be valid port numbers (1-65535)

## Kubernetes Ingress

### Entity: K8SIngress
**Description**: Kubernetes Ingress configuration for external access

**Fields**:
- `HOST` (string): Hostname for the ingress rule
  - Default: `todo.local`
  - Required: No (uses default)
- `PATHS` (array): Path-based routing rules
  - Structure: Array of `{path: string, pathType: string, backend: object}`
  - Required: Yes
- `TLS` (array): TLS configuration for HTTPS
  - Structure: Array of TLS configurations
  - Required: No (optional for HTTPS)

**Relationships**:
- Routes to: FrontendService for user access
- May route to: BackendService for API access (depending on configuration)

**Validation Rules**:
- HOST must be a valid hostname
- PATHS must contain valid path patterns
- All referenced services must exist in the same namespace