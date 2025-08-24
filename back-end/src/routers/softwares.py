from fastapi import APIRouter, HTTPException, Depends, Query, Path, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.software import Software
from schemas.software import (
    CreateSoftware,
    GetSoftwares,
    UpdateSoftware
)
from utilities import get_current_user

router = APIRouter(prefix="/softwares", tags=["softwares"])

@router.get("/", response_model=GetSoftwares)
async def get_softwares(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetSoftwares:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(Software)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(Software.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Softwares
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_softwares = f_result.scalar()
        # Get Softwares
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        softwares = s_result.scalars().all()

        return {
            "total_softwares": total_softwares,
            "softwares": softwares
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_software(
    session: SessionDep,
    data: CreateSoftware,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Software
        software = Software(**data.model_dump())
        session.add(software)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered software"}
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

@router.put("/{software_id}")
async def update_software(
    session: SessionDep,
    software_id: Annotated[int, Path(gt=0)],
    data: UpdateSoftware,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Software Exists
        software = await session.get(Software, software_id)
        if not software:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Software does not exists"}
            )
        # Update Software
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(software, key, value)
        session.add(software)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated software"}
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

@router.delete("/{software_id}")
async def remove_software(
    session: SessionDep,
    software_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Software Exists
        software = await session.get(Software, software_id)
        if not software:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Software does not exists"}
            )
        # Delete Software
        await session.delete(software)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed software"}
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