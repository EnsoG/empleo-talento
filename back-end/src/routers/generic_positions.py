from fastapi import APIRouter, HTTPException, Depends, Query, Path, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from typing import Annotated

from config.db import SessionDep
from models.generic_position import GenericPosition
from schemas.generic_position import (
    CreateGenericPosition,
    GetGenericPositions,
    UpdateGenericPosition
)
from utilities import get_current_user

router = APIRouter(prefix="/generic-positions", tags=["generic-positions"])

@router.get("/", response_model=GetGenericPositions)
async def get_generic_positions(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetGenericPositions:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(GenericPosition)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(GenericPosition.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Generic Positions
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_positions = f_result.scalar()
        # Get Generic Positions
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query.options(selectinload(GenericPosition.role_position))
        s_result = await session.execute(s_query)
        generic_positions = s_result.scalars().all()
        return {
            "total_positions": total_positions,
            "generic_positions": generic_positions
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_generic_position(
    session: SessionDep,
    data: CreateGenericPosition,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Generic Position
        generic_position = GenericPosition(**data.model_dump())
        session.add(generic_position)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered generic position"}
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

@router.put("/{position_id}")
async def update_generic_position(
    session: SessionDep,
    position_id: Annotated[int, Path(gt=0)],
    data: UpdateGenericPosition,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Generic Position Exists
        generic_position = await session.get(GenericPosition, position_id)
        if not generic_position:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Generic position does not exists"}
            )
        # Update Generic Position
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(generic_position, key, value)
        session.add(generic_position)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated generic position"}
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

@router.delete("/{position_id}")
async def remove_generic_position(
    session: SessionDep,
    position_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Generic Position Exists
        generic_position = await session.get(GenericPosition, position_id)
        if not generic_position:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Generic position does not exists"}
            )
        # Delete Generic Position
        await session.delete(generic_position)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed generic position"}
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