from fastapi import APIRouter, HTTPException, Depends, Query, Path, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.company_sector import CompanySector
from schemas.company_sector import (
    CreateSector,
    GetSectors,
    UpdateSector
)
from utilities import get_current_user

router = APIRouter(prefix="/company-sectors", tags=["company-sectors"])

@router.get("/", response_model=GetSectors)
async def get_sectors(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetSectors:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(CompanySector)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(CompanySector.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Company Sectors
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_sectors = f_result.scalar()
        # Get Company Sectors
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        company_sectors = s_result.scalars().all()

        return {
            "total_sectors": total_sectors,
            "company_sectors": company_sectors
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_sector(
    session: SessionDep,
    data: CreateSector,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Company Sector
        company_sector = CompanySector(**data.model_dump())
        session.add(company_sector)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered company sector"}
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

@router.put("/{sector_id}")
async def update_sector(
    session: SessionDep,
    sector_id: Annotated[int, Path(gt=0)],
    data: UpdateSector,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Company Sector Exists
        company_sector = await session.get(CompanySector, sector_id)
        if not company_sector:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company sector does not exists"}
            )
        # Update Company Sector
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(company_sector, key, value)
        session.add(company_sector)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated company sector"}
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

@router.delete("/{sector_id}")
async def remove_sector(
    session: SessionDep,
    sector_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Company Sector Exists
        company_sector = await session.get(CompanySector, sector_id)
        if not company_sector:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Company sector does not exists"}
            )
        # Delete Company Sector
        await session.delete(company_sector)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed company sector"}
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