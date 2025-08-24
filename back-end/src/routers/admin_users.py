from fastapi import APIRouter, HTTPException, Depends, Path, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.admin_user import AdminUser
from schemas.admin_user import GetAdmin, UpdateAdmin
from utilities import get_current_user

router = APIRouter(prefix="/admin-users", tags=["admin-users"])

@router.get("/{admin_id}", response_model=GetAdmin)
async def get_admin(
    session: SessionDep,
    admin_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> GetAdmin | JSONResponse:
    try:
        # Get Admin User By Id
        user = await session.get(AdminUser, admin_id)
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

@router.put("/{admin_id}")
async def update_admin(
    session: SessionDep,
    admin_id: Annotated[int, Path(gt=0)],
    data: UpdateAdmin,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Admin User Exists
        admin = await session.get(AdminUser, admin_id)
        if not admin:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "User does not exists"}
            )
        # Update Admin User
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(admin, key, value)
        session.add(admin)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated admin user"}
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