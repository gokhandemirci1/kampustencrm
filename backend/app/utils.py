from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Şifre doğrulama"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Şifre hashleme"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    """JWT token oluştur"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def parse_prices(prices_str: str) -> list[float]:
    """Fiyat string'ini parse et"""
    try:
        import json
        parsed = json.loads(prices_str)
        if isinstance(parsed, list):
            return [float(p) for p in parsed if p]
        return [float(parsed)] if parsed else []
    except (json.JSONDecodeError, ValueError):
        # Comma-separated string ise
        prices = [float(p.strip()) for p in prices_str.split(',') if p.strip()]
        return prices

