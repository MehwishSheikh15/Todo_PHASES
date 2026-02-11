# Docker Build and Run Commands for Frontend Chat UI

## Build the Docker Image
```bash
# Navigate to the frontend directory
cd C:\Users\NLN\Phase_II\frontend

# Build the Docker image
docker build -t todo-frontend:latest .
```

## Alternative: Build with Backend Service URL
```bash
# Build with specific backend service URL (if using build-time configuration)
docker build -t todo-frontend:latest --build-arg BACKEND_SERVICE_URL=http://todo-backend:8000 .
```

## Run the Docker Container
```bash
# Run the container with environment variable for backend service
docker run -d \
  --name todo-frontend-container \
  -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL=http://todo-backend:8000 \
  todo-frontend:latest
```

## Run with Docker Network (for local testing with backend)
```bash
# Create a custom network
docker network create todo-network

# Run backend container
docker run -d \
  --name todo-backend-container \
  --network todo-network \
  -e GEMINI_API_KEY=your_gemini_api_key_here \
  -e DATABASE_URL=sqlite:///./todo_app.db \
  -e SECRET_KEY=your_secret_key_here \
  todo-backend:latest

# Run frontend container
docker run -d \
  --name todo-frontend-container \
  --network todo-network \
  -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL=http://todo-backend-container:8000 \
  todo-frontend:latest
```

## Alternative: Run with Docker Compose
Create a `docker-compose.yml` file:
```yaml
version: '3.8'

services:
  backend:
    build: ../backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - DATABASE_URL=sqlite:///./todo_app.db
      - SECRET_KEY=${SECRET_KEY}
      - ALGORITHM=HS256
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
    networks:
      - todo-network

  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://backend:8000
    depends_on:
      - backend
    networks:
      - todo-network

networks:
  todo-network:
    driver: bridge
```

Then run:
```bash
docker-compose up -d
```

## Environment Variables Required
The container expects this environment variable:
- `NEXT_PUBLIC_BACKEND_URL`: The URL of the backend service (default: http://todo-backend:8000)

## Notes
- The container exposes port 3000
- The application is optimized for production with a multi-stage build
- In Kubernetes, the NEXT_PUBLIC_BACKEND_URL will be set to the internal service name (e.g., http://todo-backend:8000)
- The frontend will connect to the backend using the Kubernetes service DNS name
- The image uses dumb-init for proper signal handling in containers