import os
import subprocess
import threading
import time
import socket
from flask import Flask, request, jsonify, render_template_string

# Check if backend is already running
def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

# Start the Node.js backend in a separate thread
def start_backend():
    import time
    import threading

    def run_node_server():
        try:
            # Attempt to start the Node.js server as a persistent process
            process = subprocess.Popen(
                ['node', 'server.js'],
                cwd='backend',
                env={**os.environ, 'PORT': '8000'}
            )
            # Store the process so we can reference it later if needed
            setattr(run_node_server, 'process', process)

            # Wait for the process to complete (this will keep the thread alive)
            process.wait()
            print(f"Node.js server process ended with return code: {process.returncode}")

        except FileNotFoundError:
            print("Node.js is not installed or not in PATH. Please install Node.js to use the chatbot functionality.")
        except Exception as e:
            print(f"Error starting Node.js server: {str(e)}")

    # Check if port 8000 is available and start the server in a separate thread
    if not is_port_in_use(8000):
        print("Starting Node.js backend server on port 8000...")
        thread = threading.Thread(target=run_node_server, daemon=True)
        thread.start()
        # Give the server a moment to start
        time.sleep(3)
    else:
        print("Node.js backend server is already running on port 8000")

# Create a minimal Flask app to work with Hugging Face Spaces
app = Flask(__name__)

# Start backend when Flask app starts
start_backend()

# Proxy endpoint to forward requests to Node.js backend
@app.route('/')
def home():
    return jsonify({"message": "Todo Chatbot Backend - API available at /api/*"})

@app.route('/api/todo-backend/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
def proxy_api(path):
    import requests
    import json

    # Import the mock API as fallback
    from mock_chat_api import process_chat_message

    # Forward requests to the Node.js backend
    backend_url = f"http://localhost:8000/api/{path}"

    try:
        if request.method == 'GET':
            resp = requests.get(backend_url, params=request.args, timeout=10)
        elif request.method == 'POST':
            resp = requests.post(backend_url, json=request.json, timeout=10)
        elif request.method == 'PUT':
            resp = requests.put(backend_url, json=request.json, timeout=10)
        elif request.method == 'DELETE':
            resp = requests.delete(backend_url, timeout=10)
        elif request.method == 'PATCH':
            resp = requests.patch(backend_url, json=request.json, timeout=10)

        # Check if response is JSON
        try:
            response_data = resp.json()
            return response_data, resp.status_code
        except:
            # If response is not JSON, return as text
            return {"error": "Non-JSON response from backend", "details": resp.text}, resp.status_code

    except requests.exceptions.ConnectionError:
        # Fallback to mock API for chat endpoint
        if path == 'chat' and request.method == 'POST':
            try:
                message_data = request.json
                message = message_data.get("message", "") if message_data else ""
                response = process_chat_message(message)
                return response, 200
            except Exception as fallback_error:
                print(f"Fallback API error: {str(fallback_error)}")

        return {"error": "Cannot connect to Node.js backend. Please make sure it's running on port 8000", "status": "offline", "fallback_active": True}, 503
    except requests.exceptions.Timeout:
        return {"error": "Request to Node.js backend timed out", "status": "timeout"}, 504
    except Exception as e:
        return {"error": f"Unexpected error connecting to backend: {str(e)}", "status": "error"}, 500

# Also maintain the original route for compatibility
@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
def proxy_api_fallback(path):
    import requests
    import json

    # Import the mock API as fallback
    from mock_chat_api import process_chat_message

    # Forward requests to the Node.js backend
    backend_url = f"http://localhost:8000/api/{path}"

    try:
        if request.method == 'GET':
            resp = requests.get(backend_url, params=request.args, timeout=10)
        elif request.method == 'POST':
            resp = requests.post(backend_url, json=request.json, timeout=10)
        elif request.method == 'PUT':
            resp = requests.put(backend_url, json=request.json, timeout=10)
        elif request.method == 'DELETE':
            resp = requests.delete(backend_url, timeout=10)
        elif request.method == 'PATCH':
            resp = requests.patch(backend_url, json=request.json, timeout=10)

        # Check if response is JSON
        try:
            response_data = resp.json()
            return response_data, resp.status_code
        except:
            # If response is not JSON, return as text
            return {"error": "Non-JSON response from backend", "details": resp.text}, resp.status_code

    except requests.exceptions.ConnectionError:
        # Fallback to mock API for chat endpoint
        if path == 'chat' and request.method == 'POST':
            try:
                message_data = request.json
                message = message_data.get("message", "") if message_data else ""
                response = process_chat_message(message)
                return response, 200
            except Exception as fallback_error:
                print(f"Fallback API error: {str(fallback_error)}")

        return {"error": "Cannot connect to Node.js backend. Please make sure it's running on port 8000", "status": "offline", "fallback_active": True}, 503
    except requests.exceptions.Timeout:
        return {"error": "Request to Node.js backend timed out", "status": "timeout"}, 504
    except Exception as e:
        return {"error": f"Unexpected error connecting to backend: {str(e)}", "status": "error"}, 500

# Health check endpoint
@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "todo-chatbot-backend"})

# Health check endpoint for todo-backend path
@app.route('/api/todo-backend/health')
def todo_backend_health():
    import requests
    try:
        # Check if the Node.js backend is running
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            try:
                health_data = response.json()
                return jsonify({"status": "healthy", "service": "todo-chatbot-backend", "backend_status": "ok", "details": health_data})
            except:
                return jsonify({"status": "healthy", "service": "todo-chatbot-backend", "backend_status": "ok"})
        else:
            return jsonify({"status": "unhealthy", "service": "todo-chatbot-backend", "backend_status": f"error-{response.status_code}"}), 500
    except requests.exceptions.ConnectionError:
        # If Node.js backend is not available, indicate that fallback is active
        return jsonify({
            "status": "degraded",
            "service": "todo-chatbot-backend",
            "backend_status": "offline",
            "message": "Node.js backend is not running on port 8000, but fallback API is available",
            "fallback_available": True
        })
    except Exception as e:
        return jsonify({"status": "unhealthy", "service": "todo-chatbot-backend", "backend_status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Start the Flask app
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8001)))