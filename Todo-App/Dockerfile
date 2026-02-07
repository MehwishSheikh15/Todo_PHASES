FROM python:3.10-slim

WORKDIR /app

# Copy the backend files
COPY backend-fastapi/ .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 7860 (standard for Hugging Face Spaces)
EXPOSE 7860

# Run the application with uvicorn on port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
