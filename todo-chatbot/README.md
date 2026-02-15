# Todo Chatbot Helm Chart

This Helm chart deploys the Todo Chatbot application, which consists of a React frontend and a Python backend.

## Chart Components

The chart creates the following Kubernetes resources:

- Frontend Deployment with 2 replicas
- Backend Deployment with 2 replicas
- Frontend Service to expose the React application
- Backend Service to expose the API server
- ConfigMap containing environment variables

## Prerequisites

- Kubernetes 1.19+
- Helm 3+

## Installing the Chart

To install the chart with the release name `my-release`:

```bash
helm install my-release .
```

## Configuration

The following table lists the configurable parameters of the todo-chatbot chart and their default values.

### Frontend Configuration

| Parameter                     | Description                               | Default Value |
|-------------------------------|-------------------------------------------|---------------|
| `frontend.replicaCount`       | Number of frontend replicas               | 2             |
| `frontend.image.repository`   | Frontend image repository                 | todo-frontend |
| `frontend.image.tag`          | Frontend image tag                        | latest        |
| `frontend.image.pullPolicy`   | Frontend image pull policy                | IfNotPresent  |
| `frontend.service.type`       | Frontend service type                     | ClusterIP     |
| `frontend.service.port`       | Frontend service port                     | 3000          |
| `frontend.resources.requests` | Frontend resource requests                | 128Mi memory, 100m CPU |
| `frontend.resources.limits`   | Frontend resource limits                  | 256Mi memory, 200m CPU |

### Backend Configuration

| Parameter                     | Description                               | Default Value |
|-------------------------------|-------------------------------------------|---------------|
| `backend.replicaCount`        | Number of backend replicas                | 2             |
| `backend.image.repository`    | Backend image repository                  | todo-backend  |
| `backend.image.tag`           | Backend image tag                         | latest        |
| `backend.image.pullPolicy`    | Backend image pull policy                 | IfNotPresent  |
| `backend.service.type`        | Backend service type                      | ClusterIP     |
| `backend.service.port`        | Backend service port                      | 5000          |
| `backend.resources.requests`  | Backend resource requests                 | 256Mi memory, 200m CPU |
| `backend.resources.limits`    | Backend resource limits                   | 512Mi memory, 400m CPU |

### ConfigMap Values

| Parameter                     | Description                               | Default Value |
|-------------------------------|-------------------------------------------|---------------|
| `config.REACT_APP_API_URL`    | URL for the backend API                   | http://todo-backend-service:5000 |
| `config.PORT`                 | Backend port                              | 5000          |
| `config.LOG_LEVEL`            | Log level                                 | info          |
| `config.DB_HOST`              | Database host                             | postgres      |
| `config.DB_PORT`              | Database port                             | 5432          |
| `config.DB_NAME`              | Database name                             | todo_db       |

## Customizing the Chart

To customize the installation, create a `values.yaml` file with your desired configuration and install using:

```bash
helm install my-release -f values.yaml .
```

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```bash
helm delete my-release
```

## Verifying the Installation

After installation, you can verify the deployment with:

```bash
kubectl get pods
kubectl get services
helm status my-release
```