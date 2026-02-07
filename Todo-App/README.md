---
title: TodoPro - Advanced Task Management
emoji: 📋
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
app_port: 7860
---

# 🚀 TodoPro - Advanced Task Management Suite

TodoPro is a modern, full-stack productivity application featuring a sleek Next.js frontend, a high-performance FastAPI backend, and an integrated AI Chatbot powered by Google Gemini.

## ✨ Features

### 💻 Frontend (Next.js)
- **Dynamic Dashboard**: Real-time task statistics and progress tracking.
- **Interactive Calendar**: Drag-and-drop task scheduling and date-based filtering.
- **Micro-Animations**: Smooth UI transitions using Framer Motion.
- **Modern UI**: Clean, responsive design with Tailwind CSS.

### ⚙️ Backend (FastAPI)
- **High Performance**: Built with asynchronous FastAPI for minimal latency.
- **Safe Auth**: Secure JWT-based authentication with email normalization.
- **Activity Log**: Automatic tracking of all user actions (Create/Update/Delete).
- **Scalable DB**: SQLModel (SQLAlchemy) for flexible database management.

### 🤖 AI Integration
- **Todo Chatbot**: Manage your tasks using natural language.
- **Intelligent Insights**: Powered by the Gemini 1.5 Pro model for context-aware assistance.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/) |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/), [SQLModel](https://sqlmodel.tiangolo.com/) |
| **Database** | [SQLite](https://sqlite.org/) (Default), [PostgreSQL](https://www.postgresql.org/) (Compatible) |
| **AI** | [Google Gemini AI](https://ai.google.dev/) |
| **Deployment** | [Docker](https://www.docker.com/), [Hugging Face Spaces](https://huggingface.co/spaces) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Gemini API Key

### Backend Setup
```bash
cd Todo-App/backend-fastapi
pip install -r requirements.txt
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment

The application is containerized and ready for **Hugging Face Spaces**.

1. Set your `SECRET_KEY` and `GEMINI_API_KEY` in the Space's Settings → Variables/Secrets.
2. The `Dockerfile` handles the installation of all dependencies and runs the FastAPI server on port 7860.

## 🔑 Environment Variables

### Backend (`.env`)
- `DATABASE_URL`: Path to your SQLite file or PostgreSQL connection string.
- `SECRET_KEY`: Long string for JWT encryption.
- `GEMINI_API_KEY`: Your API key from Google AI Studio.

### Frontend (`.env.local`)
- `NEXT_PUBLIC_BACKEND_URL`: URL of your deployed backend.

---

Built with ❤️ by [Mehwish Sheikh](https://huggingface.co/MehwishSheikh15)
