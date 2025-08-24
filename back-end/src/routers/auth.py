import uuid
from fastapi import APIRouter, HTTPException, Response, BackgroundTasks, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlmodel import select, or_
from datetime import datetime, timedelta, timezone

from config.db import SessionDep
from config.settings import get_settings
from config.email.email_utilities import (
    send_register_email,
    send_reset_password_email,
    send_change_password_email
)
from models.candidate import Candidate
from models.company import Company
from models.company_user import CompanyUser
from models.admin_user import AdminUser
from models.candidate_position_preference import CandidatePositionPreference
from models.password_reset import PasswordReset
from schemas.auth import Login, LoginOAuth
from schemas.candidate import CreateCandidate
from schemas.company import CreateCompany
from schemas.company_user import UserStateEnum, UserPositionEnum
from schemas.extras import (
    UserRoleEnum,
    RequestResetPassword,
    ChangePassword
)
from utilities import (
    get_password_hash, 
    validate_password_hash,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/auth", tags=["auth"])

user_role_map = {
    UserRoleEnum.candidate: Candidate,
    UserRoleEnum.company_user: CompanyUser,
    UserRoleEnum.admin: AdminUser
}
settings = get_settings()

@router.post("/register-candidate")
async def register_candidate(
    session: SessionDep, 
    background_tasks: BackgroundTasks,
    data: CreateCandidate
) -> JSONResponse:
    try:
        email = data.email
        # Check If Candidate Exists
        query = select(Candidate).where(Candidate.email == email)
        result = await session.execute(query)
        candidate_exist = result.scalar_one_or_none()
        if candidate_exist:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Candidate already exists"}
            )
        # Create Candidate
        password = data.password
        hashed_password = get_password_hash(password)
        candidate = Candidate(**data.model_dump(
            exclude={"password"}),
            password=hashed_password
        )
        session.add(candidate)
        await session.flush()
        # Create Candidate Position Preferece Base Configuration
        position_preference = CandidatePositionPreference(candidate_id=candidate.candidate_id)
        session.add(position_preference)
        await session.commit()
        # Send Register Mail
        background_tasks.add_task(send_register_email, email, password, "candidate")
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered candidate"}
        )
    except IntegrityError as ex:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="An integrity error occurred. This may be due to a foreign key constraint violation or a data integrity issue. Please verify the data and try again"
        )
    except Exception as ex:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/register-company")
async def register_company(
    session: SessionDep,
    background_tasks: BackgroundTasks,
    data: CreateCompany
) -> JSONResponse:
    try:
        # Check If Company Exists
        query = select(Company).where(or_(
            Company.rut == data.rut,
            Company.email == data.email
        ))
        result = await session.execute(query)
        company_exist = result.scalar_one_or_none()
        if company_exist:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Company already exists"}
            )
        # Create Company
        company = Company(**data.model_dump(exclude={"company_user"}))
        session.add(company)
        await session.flush()
        # Check If Company User Exists
        email = data.company_user.email
        query = select(CompanyUser).where(CompanyUser.email == email)
        result = await session.execute(query)
        user_exist = result.scalar_one_or_none()
        if user_exist:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "User already exists"}
            )
        # Create Company User
        password = data.company_user.password
        hashed_password = get_password_hash(password)
        user = CompanyUser(
            **data.company_user.model_dump(exclude={"password"}),
            position=UserPositionEnum.founder,
            password=hashed_password,
            state=UserStateEnum.verify,
            company_id=company.company_id
        )
        session.add(user)
        await session.commit()
        # Send Register Mail
        background_tasks.add_task(send_register_email, email, password, "company")
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered company"}
        )
    except IntegrityError as ex:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="An integrity error occurred. This may be due to a foreign key constraint violation or a data integrity issue. Please verify the data and try again"
        )
    except Exception as ex:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/login")
async def login(
    response: Response,
    session: SessionDep,
    data: Login
) -> JSONResponse:
    try:
        # Get User Type
        user_role = data.user_role
        user_model: Candidate | CompanyUser | AdminUser = user_role_map.get(user_role)
        # Check User Credentials
        email = data.email
        query = select(user_model).where(user_model.email == email)
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        if not user or not validate_password_hash(data.password, user.password):
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Invalid email or password"}
            )
        # Check 'Verify' Or 'Inactive' Company User State
        if user_role == UserRoleEnum.company_user and user.state != UserStateEnum.active:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Invalid email or password"}
            )
        # Update Last Connection, (Only For Candidate)
        if user_role == UserRoleEnum.candidate:
            user.last_connection = datetime.now()
            session.add(user)
            await session.commit()
        # Set User Id And Position (Last For Company User)
        position = None
        if user_role == UserRoleEnum.candidate:
            sub = user.candidate_id
        elif user_role == UserRoleEnum.admin:
            sub = user.admin_id
        else:
            sub = user.user_id
            position = UserPositionEnum.founder if user.position == UserPositionEnum.founder else UserPositionEnum.staff
        # Define Data To Encode
        to_encode = {
            "sub": str(sub),
            "email": user.email,
            "user_role": user_role,
            "user_position": position
        }
        access_token = create_access_token(to_encode)
        response = JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successful login"}
        )
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="none"
        )
        return response
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/login/oauth")
async def login_oauth(
    response: Response,
    session: SessionDep,
    data: LoginOAuth
) -> JSONResponse:
    try:
        email = data.email
        # Get Candidate
        query = select(Candidate).where(Candidate.email == email)
        result = await session.execute(query)
        candidate = result.scalar_one_or_none()
        now = datetime.now()
        if not candidate:
            # Register New Candidate
            new_candidate = Candidate(
                **data.model_dump(),
                last_connection=now
            )
            session.add(new_candidate)
            await session.flush()
            # Create Candidate Position Preferece Base Configuration
            position_preference = CandidatePositionPreference(candidate_id=new_candidate.candidate_id)
            session.add(position_preference)
        else:
            # Update Last Connection
            candidate.last_connection = now
            session.add(candidate)
        await session.commit()
        # Define Data To Encode
        to_encode = {
            "sub": str(candidate.candidate_id if candidate else new_candidate.candidate_id),
            "email": email,
            "user_role": UserRoleEnum.candidate,
            "user_position": None
        }
        access_token = create_access_token(to_encode)
        response = JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successful login"}
        )
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="none"
        )
        return response
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/check-auth")
async def check_auth(curret_user: dict = Depends(get_current_user)):
    return curret_user

@router.post("/logout")
async def logout(
    response: Response,
    _: dict = Depends(get_current_user)
) -> Response:
    try:
        # Remove Access Token
        response.delete_cookie(
            key="access_token",
            httponly=True,
            secure=True,
            samesite="none"
        )
        response.status_code = status.HTTP_200_OK
        return response
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/forget-password")
async def request_reset_password(
    session: SessionDep,
    background_tasks: BackgroundTasks,
    data: RequestResetPassword
) -> JSONResponse:
    try:
        email = data.email
        user_role = data.user_role
        # Get User Rol
        user_model: Candidate | CompanyUser = user_role_map.get(user_role)
        # Check If User Exits
        query = select(user_model).where(
            user_model.email == email,
            user_model.password != None
        )
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        if not user:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "User does not exists"}
            )
        # Check If User Already Request Reset Password Before
        now = datetime.now(timezone.utc)
        conditions = [
            PasswordReset.used == 0,
            PasswordReset.expiration_date > now
        ]
        if user_role == UserRoleEnum.candidate:
            conditions.append(PasswordReset.candidate_id == user.candidate_id)
        if user_role == UserRoleEnum.company_user:
            conditions.append(PasswordReset.user_id == user.user_id)
        query = select(PasswordReset).where(*conditions)
        result = await session.execute(query)
        prev_request = result.scalar_one_or_none()
        if prev_request:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "User already had a request to reset password"}
            )
        # Create Reset Token And Password Reset Request
        reset_token = str(uuid.uuid4())
        password_reset = PasswordReset(
            token=reset_token,
            expiration_date=now + timedelta(minutes=15),
            candidate_id=user.candidate_id if user_role == UserRoleEnum.candidate else None,
            user_id=user.user_id if user_role == UserRoleEnum.company_user else None
        )
        session.add(password_reset)
        await session.commit()
        # Send Email With Reset Password URL
        reset_url = f"{settings.front_end_domain}/auth/change-password?token={reset_token}"
        background_tasks.add_task(send_reset_password_email, email, reset_url)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Password reset request accepted"}
        )
    except IntegrityError as ex:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="An integrity error occurred. This may be due to a foreign key constraint violation or a data integrity issue. Please verify the data and try again"
        )
    except Exception as ex:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.put("/change-password")
async def change_password(
    session: SessionDep,
    background_tasks: BackgroundTasks,
    data: ChangePassword
) -> JSONResponse:
    try:
        now = datetime.now(timezone.utc)
        password = data.password
        # Check If Password Request Exists
        query = select(PasswordReset).where(PasswordReset.token == data.token)
        result = await session.execute(query)
        password_reset = result.scalar_one_or_none()
        if not password_reset:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Password reset request does not exists"}
            )
        # Check Password Reset Integrity
        expiration_aware = password_reset.expiration_date.replace(tzinfo=timezone.utc)
        if expiration_aware < now or password_reset.used == 1:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Invalid password reset request"}
            )
        # Get User By ID And Change Password
        if password_reset.candidate_id:
            user = await session.get(Candidate, password_reset.candidate_id)
        if password_reset.user_id:
            user = await session.get(CompanyUser, password_reset.user_id)
        if password_reset.admin_id:
            user = await session.get(AdminUser, password_reset.admin_id)
        hashed_password = get_password_hash(password)
        user.password = hashed_password
        # Change Password Reset "used" Field State
        password_reset.used = 1
        session.add_all([user, password_reset])
        await session.commit()
        # Send New Password Email
        background_tasks.add_task(send_change_password_email, user.email, password)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Password updated successfully"}
        )
    except IntegrityError as ex:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="An integrity error occurred. This may be due to a foreign key constraint violation or a data integrity issue. Please verify the data and try again"
        )
    except Exception as ex:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )