import os
import json
from fastapi import APIRouter, HTTPException, Depends, Path, Query, UploadFile, File, Form, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from uuid import uuid4
from typing import Annotated

from config.db import SessionDep
from models.company_plan import CompanyPlan
from schemas.company_plan import GetCompanyPlans
from schemas.extras import CreatePlan, UpdatePlan, GetPlan
from utilities import get_current_user

router = APIRouter(prefix="/company-plans", tags=["company-plans"])
# Size Is Set In 1 MB
PHOTO_MAX_SIZE = 1 * 1024 * 1024

@router.get("/", response_model=GetCompanyPlans)
async def get_company_plans(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetCompanyPlans:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(CompanyPlan)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(CompanyPlan.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Company Plans
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_plans = f_result.scalar()
        # Get Company Plans
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        company_plans = s_result.scalars().all()
        return {
            "total_plans": total_plans,
            "company_plans": company_plans
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/{plan_id}", response_model=GetPlan)
async def get_by_id(
    session: SessionDep,
    plan_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> GetPlan | JSONResponse:
    try:
        # Check If Company Plan Exists
        company_plan = await session.get(CompanyPlan, plan_id)
        if not company_plan:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company plan does not exists"}
            )
        return company_plan
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_company_plan(
    session: SessionDep,
    payload: str = Form(...),
    photo: UploadFile = File(...),
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Des-Serielize Payload
        data_dict = json.loads(payload)
        data = CreatePlan(**data_dict)
        # Check Photo Validations
        if photo.content_type != "image/jpeg":
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The file type must be .jpg"}
            )
        file_content = await photo.read()
        if len(file_content) > PHOTO_MAX_SIZE:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The file size must be a maximum of 1 MB"}
            )
        # Create Photo Path And Save It
        filename = f"{uuid4().hex}_{photo.filename}"
        file_path = os.path.join("src/uploads/plan_photos", filename)
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        # Create Company Plan
        company_plan = CompanyPlan(
            **data.model_dump(exclude={"photo"}),
            photo=filename if photo else None
        )
        session.add(company_plan)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered company plan"}
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

@router.put("/{plan_id}")
async def update_company_plan(
    session: SessionDep,
    plan_id: Annotated[int, Path(gt=0)],
    payload: str = Form(...),
    photo: UploadFile | None = File(None),
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Des-Serielize Payload
        data_dict = json.loads(payload)
        data = UpdatePlan(**data_dict)
        # Check If Company Plan Exists
        company_plan = await session.get(CompanyPlan, plan_id)
        if not company_plan:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company plan does not exists"}
            )
        # Check Photo Validations
        if photo:
            if photo.content_type != "image/jpeg":
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"detail": "The file type must be .jpg"}
                )
            file_content = await photo.read()
            if len(file_content) > PHOTO_MAX_SIZE:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"detail": "The file size must be a maximum of 1 MB"}
                )
            # Check If Company Plan Already Had Photo And Remove
            if company_plan.photo:
                old_photo_path = os.path.join("src/uploads/plan_photos", company_plan.photo)
                if os.path.exists(old_photo_path):
                    os.remove(old_photo_path)
            # Update Photo Path And Save It
            filename = f"{uuid4().hex}_{photo.filename}"
            file_path = os.path.join("src/uploads/plan_photos", filename)
            with open(file_path, "wb") as buffer:
                buffer.write(file_content)
            company_plan.photo = filename
        # Update Candidate Plan
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(company_plan, key, value)
        session.add(company_plan)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated company plan"}
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

@router.delete("/{plan_id}")
async def remove_company_plan(
    session: SessionDep,
    plan_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Company Plan Exists
        company_plan = await session.get(CompanyPlan, plan_id)
        if not company_plan:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company plan does not exists"}
            )
        # Check If Company Plan Has Photo And Delete It
        if company_plan.photo:
            os.remove(os.path.join("src/uploads/plan_photos", company_plan.photo))
        # Delete Company Plan
        await session.delete(company_plan)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed company plan"}
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