# Entry point for Hugging Face Spaces
from main import app

# This file serves as the entry point for Hugging Face Spaces
# The app object is imported from main.py and will be served by the platform
# Hugging Face Spaces will automatically use the PORT environment variable

if __name__ == "__main__":
    import uvicorn
    # This is mainly for local testing; Hugging Face will run the app differently
    uvicorn.run(app, host="0.0.0.0", port=7860)