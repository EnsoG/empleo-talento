import os
from fastapi import APIRouter, HTTPException, UploadFile, File, Path, Query, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from typing import Annotated
from uuid import uuid4

from config.db import SessionDep
from models.company import Company
from models.company_user import CompanyUser
from schemas.company import (
    GetCompany,
    GetCompanies,
    GetCompanyWithState,
    UpdateCompany,
    UpdateCompanyState
)
from schemas.company_user import UserPositionEnum, UserStateEnum
from schemas.extras import UserRoleEnum
from utilities import get_current_user

router = APIRouter(prefix="/companies", tags=["companies"])

LOGO_CONTENT_TYPES = {
    "image/jpeg",
    "image/svg",
    "image/png"
}
# Size Is Set In 1 MB
LOGO_MAX_SIZE = 1 * 1024 * 1024

@router.get("/", response_model=GetCompanies)
async def get_companies(
    session: SessionDep,
    page: Annotated[int, Query(gt=0)] = 1,
    search: Annotated[str | None, Query()] = None,
    state: Annotated[UserStateEnum | None, Query(ge=0)] = None,
    _: dict = Depends(get_current_user)
) -> GetCompanies:
    try:
        clean_search = search.strip() if search and search.strip() else None
        # Get Company Founder User (To Get Company State)
        f_query = select(
                CompanyUser.company_id,
                CompanyUser.state
            ).where(CompanyUser.position == UserPositionEnum.founder).subquery()
        base_query = select(Company, f_query.c.state).outerjoin(
            f_query, Company.company_id == f_query.c.company_id
        )
        # Check Query Params
        if clean_search:
            base_query = base_query.where(Company.trade_name.ilike(f"%{clean_search}%"))
        if state is not None:
            base_query = base_query.where(f_query.c.state == state)
        # Get Total Companies
        s_query = select(func.count()).select_from(base_query.subquery())
        s_result = await session.execute(s_query)
        total_companies = s_result.scalar()
        # Get Companies
        t_query = base_query.offset(5 * (page - 1)).limit(5)
        t_result = await session.execute(t_query)
        rows = t_result.all()

        companies = []
        for company, state in rows:
            companies.append(
                GetCompanyWithState(
                    company_id=company.company_id,
                    rut=company.rut,
                    legal_name=company.legal_name,
                    trade_name=company.trade_name,
                    web=company.web,
                    email=company.email,
                    description=company.description,
                    phone=company.phone,
                    logo=company.logo,
                    sector_id=company.sector_id,
                    state=state,
                )
            )
        return {
            "total_companies": total_companies,
            "companies": companies
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/by-user", response_model=GetCompany)
async def get_by_user(
    session: SessionDep,
    current_user: dict = Depends(get_current_user)
) -> GetCompany | JSONResponse:
    try:
        # Check User Role
        if current_user.get("user_role") != UserRoleEnum.company_user:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The user cannot have associated companies"}
            )
        # Get Company By User
        query = select(Company).join(
            CompanyUser, Company.company_id == CompanyUser.company_id
        ).options(
            selectinload(Company.company_sector)
        ).where(CompanyUser.user_id == current_user.get("sub"))
        result = await session.execute(query)
        company = result.scalar_one_or_none()
        # Check If Company Exists
        if not company:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company does not exists"}
            )

        return company
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/{company_id}", response_model=GetCompanyWithState)
async def get_by_id(
    session: SessionDep,
    company_id: Annotated[int, Path(gt=0)]
) -> GetCompanyWithState | JSONResponse:
    try:
        # Get Company Founder User (To Get Company State)
        f_query = select(
                CompanyUser.company_id,
                CompanyUser.state
            ).where(CompanyUser.position == UserPositionEnum.founder).subquery()
        # Get Company
        s_query = select(Company, f_query.c.state).outerjoin(
            f_query, Company.company_id == f_query.c.company_id
        ).options(
            selectinload(Company.company_sector)
        ).where(Company.company_id == company_id)
        result = await session.execute(s_query)
        row = result.one_or_none()
        if not row:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company does not exists"}
            )
        company, state = row
        return GetCompanyWithState(
            company_id=company.company_id,
            rut=company.rut,
            legal_name=company.legal_name,
            trade_name=company.trade_name,
            web=company.web,
            email=company.email,
            description=company.description,
            phone=company.phone,
            logo=company.logo,
            company_sector=company.company_sector.model_dump() if company.company_sector else None,
            state=state,
        )
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.put("/update-logo")
async def update_photo(
    session: SessionDep,
    logo: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Get Company User
        user = await session.get(CompanyUser, current_user.get("sub"))
        # Check If Company Exists
        company = await session.get(Company, user.company_id)
        if not company:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company does not exists"}
            )
        # Check File Content Type
        if logo.content_type not in LOGO_CONTENT_TYPES:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The file type must be .jpg, .svg or .png"}
            )
        # Check File Size
        file_content = await logo.read()
        if len(file_content) > LOGO_MAX_SIZE:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The file size must be a maximum of 1 MB"}
            )
        # Ensure Upload Directory Exists
        os.makedirs("src/uploads/logos", exist_ok=True)
        # Check If Company Already Had Logo And Remove
        if company.logo:
            old_logo_path = os.path.join("src/uploads/logos", company.logo)
            if os.path.exists(old_logo_path):
                os.remove(old_logo_path)
        # Update Logo Path And Save It
        filename = f"{uuid4().hex}_{logo.filename}"
        file_path = os.path.join("src/uploads/logos", filename)
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        company.logo = filename
        session.add(company)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated company logo"}
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

@router.put("/update-state/{company_id}")
async def update_state(
    session: SessionDep,
    company_id: Annotated[int, Path(gt=0)],
    data: UpdateCompanyState,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Company Exists
        company_exits = await session.get(Company, company_id)
        if not company_exits:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company does not exists"}
            )
        # Get Company Users
        query = select(CompanyUser).where(CompanyUser.company_id == company_id)
        result = await session.execute(query)
        users = result.scalars().all()
        # Check State To Update
        if data.state == UserStateEnum.verify:
            for user in users:
                if user.position == UserPositionEnum.founder:
                    user.state = 0
                else:
                    user.state = 2
        else:
            for user in users:
                user.state = data.state
        session.add_all(users)
        await session.commit()
    except IntegrityError as ex:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="An integrity error occurred. This may be due to a foreign key constraint violation or a data integrity issue. Please verify the data and try again"
        )
    except Exception as ex:
        print(ex)
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.put("/{company_id}")
async def update_company(
    session: SessionDep,
    data: UpdateCompany,
    company_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Company Exists
        company = await session.get(Company, company_id)
        if not company:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company does not exists"}
            )
        # Update Company
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(company, key, value)
        session.add(company)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated company"}
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