# Todo App with Gemini-Powered Chatbot

This is a full-stack Todo application featuring an AI-powered chatbot that understands natural language commands using Google's Gemini API. The application supports both Node.js and Python/FastAPI backends with intelligent task management capabilities.

## Features

- **Natural Language Processing**: Use everyday language to manage your tasks
- **Gemini AI Integration**: Advanced understanding of user intent using Google's Gemini Pro
- **Full Task Management**: Add, complete, delete, edit, search, and view tasks
- **Multi-platform Support**: Works with both Node.js and Python/FastAPI backends
- **Hugging Face Deployment Ready**: Optimized for Hugging Face Spaces
- **Dual Backend Architecture**: Choice of Node.js or Python backend with consistent functionality

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
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (for Node.js backend)
- Python 3.8+ (for Python backend)
- Google Gemini API Key

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

## Troubleshooting

- If the chatbot doesn't respond as expected, check that your GEMINI_API_KEY is valid
- Ensure both backends are properly configured with the same API key
- Check the logs for any error messages

## Contributing

Feel free to fork this repository and submit pull requests for improvements. We welcome contributions that enhance the chatbot's understanding capabilities or add new features.