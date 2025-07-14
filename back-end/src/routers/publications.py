from fastapi import APIRouter, HTTPException, Path, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.publication import Publication
from schemas.publication import CreatePublication, UpdatePublication
from utilities import get_current_user

router = APIRouter(prefix="/publications")

@router.post("/")
async def create_postulation(
    session: SessionDep,
    data: CreatePublication,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Publication
        publication = Publication(**data.model_dump())
        session.add(publication)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered publication"}
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

@router.put("/{publication_id}")
async def update_publication(
    session: SessionDep,
    publication_id: Annotated[int, Path(gt=0)],
    data: UpdatePublication,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Publication Exists
        publication = await session.get(Publication, publication_id)
        if not publication:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Publication does not exists"}
            )
        # Update Work Experience
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(publication, key, value)
        session.add(publication)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated publication"}
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