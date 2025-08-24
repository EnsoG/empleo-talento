from fastapi import APIRouter, HTTPException, Depends, Query, Path, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.role_position import RolePosition
from schemas.role_position import (
    CreateRolePosition,
    GetRolePositions,
    UpdateRolePosition
)
from utilities import get_current_user

router = APIRouter(prefix="/role-positions", tags=["role-positions"])

@router.get("/", response_model=GetRolePositions)
async def get_role_positions(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetRolePositions:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(RolePosition)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(RolePosition.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Role Positions
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_roles = f_result.scalar()
        # Get Role Positions
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        role_positions = s_result.scalars().all()

        return {
            "total_roles": total_roles,
            "role_positions": role_positions
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_role_position(
    session: SessionDep,
    data: CreateRolePosition,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Role Position
        role_position = RolePosition(**data.model_dump())
        session.add(role_position)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered role position"}
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

@router.put("/{role_id}")
async def update_role_position(
    session: SessionDep,
    role_id: Annotated[int, Path(gt=0)],
    data: UpdateRolePosition,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Role Position Exists
        role_position = await session.get(RolePosition, role_id)
        if not role_position:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Role position does not exists"}
            )
        # Update Role Position
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(role_position, key, value)
        session.add(role_position)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated role position"}
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

@router.delete("/{role_id}")
async def remove_role_position(
    session: SessionDep,
    role_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Role Position Exists
        role_position = await session.get(RolePosition, role_id)
        if not role_position:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Role position does not exists"}
            )
        # Delete Role Position
        await session.delete(role_position)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed role position"}
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