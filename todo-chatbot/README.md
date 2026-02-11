# Todo Chatbot Helm Chart

This Helm chart deploys the Todo Chatbot application, which consists of a frontend UI and a backend API.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+

## Installation

To install the chart with the release name `todo`:

```bash
helm install todo ./todo-chatbot
```

## Configuration

The following table lists the configurable parameters of the Todo Chatbot chart and their default values.

### Global Parameters

| Parameter                 | Description                                     | Default                |
| ------------------------- | ----------------------------------------------- | ---------------------- |
| `global.namespace`        | Namespace to deploy resources                   | `todo-app`             |

### Frontend Parameters

| Parameter                                 | Description                                         | Default                       |
| ----------------------------------------- | --------------------------------------------------- | ----------------------------- |
| `frontend.replicaCount`                   | Number of frontend pods to deploy                   | `1`                           |
| `frontend.image.repository`               | Frontend image repository                           | `todo-frontend`               |
| `frontend.image.pullPolicy`               | Frontend image pull policy                          | `IfNotPresent`                |
| `frontend.image.tag`                      | Frontend image tag (defaults to chart appVersion)   | `""`                          |
| `frontend.service.type`                   | Frontend service type                               | `NodePort`                    |
| `frontend.service.port`                   | Frontend service port                               | `80`                          |
| `frontend.service.nodePort`               | Frontend service node port                          | `30080`                       |
| `frontend.resources.limits.cpu`           | CPU limit for frontend                              | `200m`                        |
| `frontend.resources.limits.memory`        | Memory limit for frontend                           | `256Mi`                       |
| `frontend.resources.requests.cpu`         | CPU request for frontend                            | `100m`                        |
| `frontend.resources.requests.memory`      | Memory request for frontend                         | `128Mi`                       |
| `frontend.env.NEXT_PUBLIC_BACKEND_URL`    | Backend service URL for frontend to connect to      | `"http://todo-backend:5000"`  |

### Backend Parameters

| Parameter                             | Description                                       | Default                       |
| ------------------------------------- | ------------------------------------------------- | ----------------------------- |
| `backend.replicaCount`                | Number of backend pods to deploy                  | `2`                           |
| `backend.image.repository`            | Backend image repository                          | `todo-backend`                |
| `backend.image.pullPolicy`            | Backend image pull policy                         | `IfNotPresent`                |
| `backend.image.tag`                   | Backend image tag (defaults to chart appVersion)  | `""`                          |
| `backend.service.type`                | Backend service type                              | `ClusterIP`                   |
| `backend.service.port`                | Backend service port                              | `5000`                        |
| `backend.service.targetPort`          | Backend service target port                       | `8000`                        |
| `backend.resources.limits.cpu`        | CPU limit for backend                             | `500m`                        |
| `backend.resources.limits.memory`     | Memory limit for backend                          | `512Mi`                       |
| `backend.resources.requests.cpu`      | CPU request for backend                           | `250m`                        |
| `backend.resources.requests.memory`   | Memory request for backend                        | `256Mi`                       |
| `backend.env.PORT`                    | Backend port                                      | `"8000"`                      |
| `backend.env.DATABASE_URL`            | Database URL                                      | `"sqlite:///./todo_app.db"`   |

### Configuration Parameters

| Parameter                     | Description                                    | Default                       |
| ----------------------------- | ---------------------------------------------- | ----------------------------- |
| `config.backendServiceName`   | Backend service name within the cluster        | `"todo-backend"`              |
| `config.backendServicePort`   | Backend service port                           | `5000`                        |

### Secrets Parameters

| Parameter             | Description                                | Default                       |
| --------------------- | ------------------------------------------ | ----------------------------- |
| `secrets.geminiApiKey`| Gemini API key                             | `"YOUR_GEMINI_API_KEY_HERE"`  |
| `secrets.secretKey`   | Secret key for JWT tokens                  | `"YOUR_SECRET_KEY_HERE"`      |
| `secrets.dbPassword`  | Database password                          | `"YOUR_DB_PASSWORD_HERE"`     |

## Upgrading

To upgrade the chart to a new version or change configuration:

```bash
helm upgrade todo ./todo-chatbot --set frontend.replicaCount=2 --set backend.replicaCount=3
```

## Uninstallation

To uninstall/delete the `todo` release:

```bash
helm delete todo
```

This removes all the Kubernetes components associated with the chart and deletes the release.