from setuptools import setup, find_packages

setup(
    name="todo-backend",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "sqlmodel==0.0.16",
        "asyncpg==0.28.0",
        "pydantic[email]==2.5.0",
        "bcrypt==4.1.1",
        "python-jose[cryptography]==3.3.0",
        "passlib[bcrypt]==1.7.4",
        "python-multipart==0.0.6",
        "alembic==1.13.1",
        "psycopg2-binary==2.9.9",
        "better-exceptions==0.3.3",
        "python-dotenv==1.0.0",
    ],
    author="Todo App Team",
    description="Todo Application Backend",
    python_requires=">=3.7",
)