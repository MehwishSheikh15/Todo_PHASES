from fastapi import HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from src.utils.auth import SECRET_KEY, ALGORITHM
from src.models.user import User
from sqlmodel import Session, select
from src.database import get_session
from contextlib import contextmanager
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()

class JWTMiddleware:
    """
    Middleware to verify JWT tokens on protected endpoints.
    """

    @staticmethod
    def verify_token(credentials: HTTPAuthorizationCredentials = security) -> str:
        """
        Verify the JWT token from the Authorization header.

        Args:
            credentials: HTTP authorization credentials

        Returns:
            str: The decoded token payload if valid

        Raises:
            HTTPException: If token is invalid or missing
        """
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        try:
            token = credentials.credentials
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")

            if user_id is None:
                raise credentials_exception

            return payload
        except JWTError:
            raise credentials_exception

    @staticmethod
    def get_current_user_payload(request: Request) -> dict:
        """
        Get the current user's payload from the JWT token in the request.

        Args:
            request: The incoming request

        Returns:
            dict: The user payload from the JWT token
        """
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header missing or malformed"
            )

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")

            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials"
                )

            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )