import re
import bcrypt
import jwt
from fastapi import HTTPException, Request, status
from datetime import date, datetime, timedelta, timezone

from config.settings import get_settings

ALGORITHM="HS256"
settings = get_settings()

# General Functions
def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def validate_password_hash(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=6)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=ALGORITHM)

def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Not authenticated"
        )
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token"
            )
        return payload
    except (jwt.ExpiredSignatureError, jwt.PyJWTError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid token or has expired"
        )

def get_optional_user(request: Request) -> dict | None:
    token = request.cookies.get("access_token")
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if not sub:
            return None
        return payload
    except (jwt.ExpiredSignatureError, jwt.PyJWTError):
        return None

# Validation Functions
def validate_run_format(run: str) -> bool:
    run = run.replace('.', '').replace(' ', '')
    
    if not re.match(r'^\d{7,8}-[0-9kK]{1}$', run):
        return False
    
    body, dv = run.split('-')
    total = 0
    multiplier = 2
    for i in range(len(body)-1, -1, -1):
        total += int(body[i]) * multiplier
        multiplier = multiplier + 1 if multiplier < 7 else 2
    
    expected = 11 - (total % 11)
    if expected == 11:
        expected = 0
    elif expected == 10:
        expected = 'k'
    
    return str(dv).lower() == str(expected).lower()

def validate_empty_string(value: str) -> bool:
    if isinstance(value, str):
        return value.strip() != ""
    return True

def validate_legal_age(birth_date: date | None) -> bool:
    if not birth_date:
        return True
    today = date.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age >= 18

def validate_phone_format(phone: str | None) -> bool:
    if not phone or re.match(r"^(?:\+?56)?9\d{8}$", phone):
        return True
    else:
        return False

def validate_password(password: str) -> bool:
    return len(password) >= 6 and password.isalnum()

def validate_earlier_date(start_date: date | None, end_date: date | None):
    if start_date is None and end_date is None:
        return True
    if end_date is None:
        return True
    if start_date is not None and end_date is not None:
        return start_date < end_date
    return False