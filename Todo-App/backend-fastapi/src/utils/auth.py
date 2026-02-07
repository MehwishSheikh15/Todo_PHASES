from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from pydantic import BaseModel
from src.models.user import User
from src.database import get_session
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

# Initialize password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Initialize security schemes
security = HTTPBearer()

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: str
    email: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a new JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    """Get the current user from the token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = credentials.credentials
        print(f"[DEBUG AUTH] Decoding token: {token[:10]}...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        
        print(f"[DEBUG AUTH] Payload decoded successfully. sub: {user_id}, email: {email}")
        
        if user_id is None:
            print("[DEBUG AUTH] 'sub' claim missing in payload")
            raise credentials_exception
        token_data = TokenData(user_id=user_id, email=email)
    except JWTError as e:
        print(f"[DEBUG AUTH] JWT Decoding Error: {str(e)}")
        raise credentials_exception

    user = session.exec(select(User).where(User.id == uuid.UUID(token_data.user_id))).first()
    if user is None:
        print(f"[DEBUG AUTH] User with ID {token_data.user_id} not found in database")
        raise credentials_exception
    
    print(f"[DEBUG AUTH] User authenticated: {user.email}")
    return user

def verify_token(token: str):
    """Verify a JWT token and return the payload."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")

        if user_id is None or email is None:
            return None

        token_data = TokenData(user_id=user_id, email=email)
        return token_data
    except JWTError:
        return None