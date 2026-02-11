# Environment Configuration for Frontend in Kubernetes

## Environment Variables

The frontend needs to be configured to connect to the backend Kubernetes service. In Kubernetes, this is typically handled through environment variables or by building the application with the correct backend URL.

### Option 1: Build-time Configuration (Recommended for static builds)
If using build-time configuration, you would build the image with the backend service URL:

```bash
# Build with backend service URL
docker build -t todo-frontend:latest --build-arg BACKEND_SERVICE_URL=http://todo-backend:8000 .
```

To support this, we need to modify the Dockerfile to accept build arguments:

```Dockerfile
# Multi-stage build for optimal image size
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Set build-time environment variable
ARG BACKEND_SERVICE_URL=http://todo-backend:8000
ENV NEXT_PUBLIC_BACKEND_URL=$BACKEND_SERVICE_URL

# Copy application code
COPY . .

# Build the Next.js application
RUN npm run build


# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules
# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/postcss.config.js ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/tsconfig.json ./

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Run the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
```

### Option 2: Runtime Configuration (Used in Kubernetes Deployments)
In Kubernetes, the preferred approach is to set the environment variable at runtime via the deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: todo-frontend
  template:
    metadata:
      labels:
        app: todo-frontend
    spec:
      containers:
      - name: frontend
        image: todo-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_BACKEND_URL
          value: "http://todo-backend:8000"
```

This approach allows the same image to be used across different environments by simply changing the deployment configuration.