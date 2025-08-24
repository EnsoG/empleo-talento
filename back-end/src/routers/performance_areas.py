from fastapi import APIRouter, HTTPException, Depends, Query, Path, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.performance_area import PerformanceArea
from schemas.performance_area import (
    CreateArea,
    GetAreas,
    UpdateArea
)
from utilities import get_current_user

router = APIRouter(prefix="/performance-areas", tags=["performance-areas"])

@router.get("/", response_model=GetAreas)
async def get_areas(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetAreas:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(PerformanceArea)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(PerformanceArea.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Performance Areas
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_areas = f_result.scalar()
        # Get Performance Areas
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        performance_areas = s_result.scalars().all()

        return {
            "total_areas": total_areas,
            "performance_areas": performance_areas
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_area(
    session: SessionDep,
    data: CreateArea,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Performance Area
        performance_area = PerformanceArea(**data.model_dump())
        session.add(performance_area)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered performance area"}
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

@router.put("/{area_id}")
async def update_area(
    session: SessionDep,
    area_id: Annotated[int, Path(gt=0)],
    data: UpdateArea,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Performance Area Exists
        performance_area = await session.get(PerformanceArea, area_id)
        if not performance_area:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Performance area does not exists"}
            )
        # Update Performance Area
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(performance_area, key, value)
        session.add(performance_area)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated performance area"}
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

@router.delete("/{area_id}")
async def remove_area(
    session: SessionDep,
    area_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Performance Area Exists
        performance_area = await session.get(PerformanceArea, area_id)
        if not performance_area:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Performance area does not exists"}
            )
        # Delete Performance Area
        await session.delete(performance_area)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed performance area"}
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