# Todo App with Gemini-Powered Chatbot

This is a full-stack Todo application featuring an AI-powered chatbot that understands natural language commands using Google's Gemini API. The application supports both Node.js and Python/FastAPI backends with intelligent task management capabilities. The application is designed for cloud-native deployment with Docker and Kubernetes.

## Features

- **Natural Language Processing**: Use everyday language to manage your tasks
- **Gemini AI Integration**: Advanced understanding of user intent using Google's Gemini Pro
- **Full Task Management**: Add, complete, delete, edit, search, and view tasks
- **Multi-platform Support**: Works with both Node.js and Python/FastAPI backends
- **Hugging Face Deployment Ready**: Optimized for Hugging Face Spaces
- **Dual Backend Architecture**: Choice of Node.js or Python backend with consistent functionality
- **Containerized Deployment**: Docker support for easy deployment
- **Kubernetes Native**: Designed for deployment on Kubernetes clusters
- **AI DevOps Tools Integration**: Includes tools like kubectl-ai for enhanced operations

## Project Structure

```
├── Todo-App/               # Main application with Hugging Face integration
│   ├── app.py             # Flask app for Hugging Face Spaces compatibility
│   └── backend/           # Node.js backend with Gemini-powered chatbot
│       ├── api/           # API routes (chat, tasks)
│       ├── models/        # Database models (SQLite)
│       ├── utils/         # Utility functions (including Gemini NLP processor)
│       ├── server.js      # Express.js server
│       ├── package.json   # Node.js dependencies
│       └── .env           # Environment variables
├── backend/                # Python/FastAPI backend with Gemini integration
│   ├── src/
│   │   ├── api/           # API routes (auth, tasks, chat)
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions (including gemini_nlp_processor)
│   │   └── middleware/    # Middleware
│   ├── main.py            # Application entry point
│   └── requirements.txt   # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utilities and API clients
│   │   ├── services/      # Service classes
│   │   └── types/         # TypeScript types
│   ├── package.json       # Node.js dependencies
│   └── next.config.js     # Next.js configuration
├── docker/                # Docker configuration files
├── k8s/                   # Kubernetes manifests
├── helm/                  # Helm charts for deployment
├── specs/                 # Project specifications
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (for Node.js backend)
- Python 3.8+ (for Python backend)
- Google Gemini API Key
- Docker (for containerization)
- Kubernetes cluster (for Kubernetes deployment)
- Helm (for Helm-based deployments)

### Installation

#### For Node.js Backend

1. Navigate to the Node.js backend directory:
```bash
cd Todo-App/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables in `.env`:
```env
PORT=8000
NODE_ENV=development
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

#### For Python Backend

1. Navigate to the Python backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up your environment variables in `.env`:
```env
DATABASE_URL=sqlite:///./todo_app.db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

## Docker Setup

### Building Docker Images

To build both frontend and backend Docker images with the specified tags, run:

```bash
# For Linux/Mac
./build-and-run-docker.sh

# For Windows
build-and-run-docker.bat
```

Or build them individually:

```bash
# Build frontend image
docker build -f todo-frontend.Dockerfile -t todo-frontend:latest .

# Build backend image
docker build -f todo-backend.Dockerfile -t todo-backend:latest .
```

### Running the Application with Docker

After building the images, you can run the containers:

```bash
# Run backend container
docker run -d --name todo-backend-container -p 8000:8000 todo-backend:latest

# Run frontend container (with link to backend)
docker run -d --name todo-frontend-container -p 3000:3000 --link todo-backend-container:backend todo-frontend:latest
```

### Alternative: Using Docker Compose

For easier management, you can also use the provided docker-compose file:

```bash
docker-compose up --build
```

## Kubernetes Deployment

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/intro/install/)

### Quick Start

#### 1. Start Minikube

```bash
# Start Minikube cluster
./setup-minikube.bat
```

#### 2. Build Docker Images

```bash
# Build backend image
cd backend
docker build -t todo-backend:latest .
cd ..

# Build frontend image
cd frontend
docker build -t todo-frontend:latest .
cd ..
```

#### 3. Deploy Using Helm

```bash
# Install the application using Helm
./install-helm-chart.bat
```

#### 4. Access the Application

```bash
# Get the Minikube IP
minikube ip

# Add to your hosts file: <MINIKUBE_IP> todo.local
# Then access the application at: http://todo.local
```

Alternatively, use port forwarding:

```bash
# Port forward to access the frontend
kubectl port-forward svc/todo-chatbot-frontend-service 3000:3000 -n todo-chatbot
```

Then visit `http://localhost:3000`

### Manual Deployment (Alternative to Helm)

If you prefer to deploy manually without Helm:

```bash
# Apply all Kubernetes manifests
./deploy-k8s.bat
```

### Configuration

#### Environment Variables

The application uses the following configuration:

- `GEMINI_API_KEY`: Your Google Gemini API key (set in secrets)
- `SECRET_KEY`: Secret key for JWT tokens (set in secrets)
- `DATABASE_URL`: Database connection string (set in configmap)
- `BACKEND_URL`: Backend service URL (set in configmap)

To update these values, modify the `helm/todo-chatbot/values.yaml` file before installing the chart.

### Scaling

To scale the deployments:

```bash
# Scale backend
kubectl scale deployment todo-chatbot-backend-deployment -n todo-chatbot --replicas=3

# Scale frontend
kubectl scale deployment todo-chatbot-frontend-deployment -n todo-chatbot --replicas=3
```

## AI DevOps Tools Integration

This deployment includes integration with AI-powered DevOps tools:

### Docker AI Gordon
Optimizes Docker images using AI recommendations:
```bash
docker gordon analyze backend/Dockerfile
docker gordon suggest frontend/Dockerfile
```

### kubectl-ai
Enhances kubectl with AI-powered commands:
```bash
kubectl ai explain deployment
kubectl ai troubleshoot pod/<pod-name>
```

### Kagent
Automates Kubernetes operations:
```bash
kagent start --config=kagent.yaml
kagent status
```

## Usage Examples

The chatbot understands various natural language commands:

- **Adding Tasks**:
  - "Add a task to buy groceries"
  - "Create a task to call mom"
  - "I need to finish the report"

- **Completing Tasks**:
  - "Complete task 1"
  - "Finish the shopping task"
  - "Mark task 'buy milk' as done"

- **Deleting Tasks**:
  - "Delete task 2"
  - "Remove the meeting task"
  - "Cancel 'call dentist' task"

- **Editing Tasks**:
  - "Edit task 3 to update the description"
  - "Change the priority of 'work report' task"

- **Searching Tasks**:
  - "Find tasks about work"
  - "Show me tasks with 'meeting' in them"

- **Viewing Tasks**:
  - "Show me my tasks for today"
  - "What do I have this week?"
  - "List all my tasks"

## API Endpoints

### Node.js Backend
- `POST /api/chat` - Send natural language commands to the chatbot
- `GET/POST/PUT/DELETE /api/tasks` - Standard task operations

### Python Backend
- `POST /api/chat` - Send natural language commands to the chatbot
- `GET/POST/PUT/DELETE /api/tasks` - Standard task operations

## Running the Application

### Node.js Backend
```bash
cd Todo-App/backend
npm start
```

### Python Backend
```bash
cd backend
uvicorn main:app --reload
```

### Hugging Face Deployment
The application is configured to work with Hugging Face Spaces through the Flask wrapper in `Todo-App/app.py`.

## How the Gemini Integration Works

The application uses Google's Gemini Pro model to:

1. Parse user input and identify the intent (ADD, COMPLETE, DELETE, EDIT, SEARCH, VIEW, etc.)
2. Extract relevant information (task titles, IDs, search queries, time periods)
3. Return structured data that the backend can process
4. Fall back to rule-based processing if the API is unavailable

## Deploying to Hugging Face Spaces

The application is configured to work with Hugging Face Spaces. The main entry point is in `Todo-App/app.py`, which serves as a proxy between the Flask interface required by Hugging Face and your Node.js backend.

To deploy:

1. Create a Space on Hugging Face with the appropriate runtime
2. Push your code to the repository
3. Make sure your GEMINI_API_KEY is set as a secret environment variable in the Space settings

## Security

- Store your GEMINI_API_KEY securely as an environment variable
- Never commit API keys to version control
- The application follows standard security practices for web applications
- API keys are stored in Kubernetes Secrets when deployed to Kubernetes
- Network policies can be added for additional security in Kubernetes

## Troubleshooting

### Common Issues

1. **Images not found**: Ensure you've built the Docker images before deploying
2. **Service not accessible**: Check if the ingress controller is enabled in Minikube:
   ```bash
   minikube addons enable ingress
   ```
3. **API key issues**: Verify your GEMINI_API_KEY is correctly set in the secrets

### Useful Commands

```bash
# Check pod status
kubectl get pods -n todo-chatbot

# View logs
kubectl logs -l app=todo-backend -n todo-chatbot
kubectl logs -l app=todo-frontend -n todo-chatbot

# Describe resources for debugging
kubectl describe deployment todo-chatbot-backend-deployment -n todo-chatbot

# Check services
kubectl get svc -n todo-chatbot

# Check ingress
kubectl get ingress -n todo-chatbot
```

## Contributing

Feel free to fork this repository and submit pull requests for improvements. We welcome contributions that enhance the chatbot's understanding capabilities or add new features.