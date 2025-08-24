from fastapi import APIRouter, HTTPException, BackgroundTasks, Path, Depends, Query, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func, or_
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.company_user import CompanyUser
from schemas.company_user import (
    UpdateUser,
    CreateUser,
    GetCompanyUser,
    GetStaff,
    UserStateEnum
)
from utilities import get_current_user, get_password_hash

router = APIRouter(prefix="/company-users", tags=["company-users"])

@router.get("/", response_model=GetCompanyUser)
async def get_user(
    session: SessionDep,
    current_user: dict = Depends(get_current_user)
) -> GetCompanyUser | JSONResponse:
    try:
        # Get Company User By Id
        user = await session.get(CompanyUser, current_user.get("sub"))
        if not user:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "User does not exists"}
            )
        return user
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/staff", response_model=GetStaff)
async def get_staff(
    session: SessionDep,
    page: Annotated[int, Query(gt=0)] = 1,
    search: Annotated[str | None , Query()] = None,
    position: Annotated[str | None, Query()] = None,
    state: Annotated[UserStateEnum | None, Query(ge=0)] = None,
    current_user: dict = Depends(get_current_user)
) -> GetStaff:
    try:
        clean_search = search.strip() if search and search.strip() else None
        # Get Company Id By Company User
        user = await session.get(CompanyUser, current_user.get("sub"))
        base_query = select(CompanyUser).where(CompanyUser.company_id == user.company_id)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(or_(
                CompanyUser.name.ilike(f"%{clean_search}%"),
                CompanyUser.paternal.ilike(f"%{clean_search}%"),
                CompanyUser.maternal.ilike(f"%{clean_search}%")
            ))
        if position:
            base_query = base_query.where(CompanyUser.position.ilike(position))
        if state:
            base_query = base_query.where(CompanyUser.state == state)
        # Get The Total Number Of Staff
        f_query = select(func.count()).select_from(base_query.subquery())
        f_result = await session.execute(f_query)
        total_staff = f_result.scalar()
        # Get Company Staff
        s_query = base_query.offset(5 * (page - 1)).limit(5)
        s_result = await session.execute(s_query)
        staff = s_result.scalars().all()

        return {
            "total_staff": total_staff,
            "staff": staff
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_user(
    session: SessionDep,
    background_trasks: BackgroundTasks,
    data: CreateUser,
    current_user: dict = Depends(get_current_user),
):
    try:
        email = data.email
        # Check If Company User Already Exists
        f_query = select(CompanyUser).where(CompanyUser.email == data.email)
        f_result = await session.execute(f_query)
        user_exist = f_result.scalar_one_or_none()
        if user_exist:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "User already exists"}
            )
        # Get Company Id By Founder
        founder = await session.get(CompanyUser, current_user.get("sub"))
        # Create Company User
        password = data.password
        hashed_password = get_password_hash(password)
        user = CompanyUser(
            **data.model_dump(exclude={"password"}),
            password=hashed_password,
            state=UserStateEnum.inactive,
            company_id=founder.company_id
        )
        session.add(user)
        await session.commit()
        # Send Registration Email
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered user"}
        )
    except IntegrityError as ex:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="An integrity error occurred. This may be due to a foreign key constraint violation or a data integrity issue. Please verify the data and try again"
        )
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.put("/{user_id}")
async def update_user(
    session: SessionDep,
    user_id: Annotated[int, Path(gt=0)],
    data: UpdateUser,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Company User Exists
        user = await session.get(CompanyUser, user_id)
        if not user:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company user does not exists"}
            )
        # Update Company User
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(user, key, value)
        session.add(user)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated company user"}
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