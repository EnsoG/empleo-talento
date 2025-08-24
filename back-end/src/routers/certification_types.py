from fastapi import APIRouter, HTTPException, Depends, Query, Path, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.certification_type import CertificationType
from schemas.certification_type import (
    CreateCertificationType,
    GetCertificationTypes,
    UpdateCertificationType
)
from utilities import get_current_user

router = APIRouter(prefix="/certification-types", tags=["certification-types"])

@router.get("/", response_model=GetCertificationTypes)
async def get_certification_types(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetCertificationTypes:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(CertificationType)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(CertificationType.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Certification Types
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_types = f_result.scalar()
        # Get Certification Types
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        certification_types = s_result.scalars().all()

        return {
            "total_types": total_types,
            "certification_types": certification_types
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_certification_type(
    session: SessionDep,
    data: CreateCertificationType,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Certification Type
        certification_type = CertificationType(**data.model_dump())
        session.add(certification_type)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered certification type"}
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

@router.put("/{certification_type_id}")
async def update_certification_type(
    session: SessionDep,
    certification_type_id: Annotated[int, Path(gt=0)],
    data: UpdateCertificationType,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Certification Type Exists
        certification_type = await session.get(CertificationType, certification_type_id)
        if not certification_type:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Certification type does not exists"}
            )
        # Update Certification Type
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(certification_type, key, value)
        session.add(certification_type)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated certification type"}
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

@router.delete("/{certification_type_id}")
async def remove_certification_type(
    session: SessionDep,
    certification_type_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Certification Type Exists
        certification_type = await session.get(CertificationType, certification_type_id)
        if not certification_type:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Certification type does not exists"}
            )
        # Delete Certification Type
        await session.delete(certification_type)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed certification type"}
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