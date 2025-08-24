import os
import json
from fastapi import APIRouter, HTTPException, Path, Depends, File, Form, Query, UploadFile, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from uuid import uuid4
from typing import Annotated, Literal

from config.db import SessionDep
from models.publication import Publication
from schemas.publication import (
    CreatePublication,
    UpdatePublication,
    GetPublication,
    GetPublications,
    PublicationStateEnum
)
from utilities import get_current_user

router = APIRouter(prefix="/publications", tags=["publications"])
# Size Is Set In 1 MB
IMAGE_MAX_SIZE = 1 * 1024 * 1024
SourceType = Literal["portal", "panel"]

@router.get("/", response_model=GetPublications)
async def get_publications(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None,
    category: Annotated[int | None, Query(gt=0)] = None,
    state: Annotated[PublicationStateEnum | None, Query()] = None,
    source: Annotated[SourceType, Query()] = "portal"
) -> GetPublications:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(Publication)
        # Check Publications Source
        if source == "portal":
            base_query = base_query.where(
                Publication.state == PublicationStateEnum.active
            ).order_by(Publication.creation_date.desc())
        # Check Query Params
        if clean_search:
            base_query = base_query.where(Publication.title.ilike(f"%{clean_search}%"))
        if category:
            base_query = base_query.where(Publication.category_id == category)
        if state:
            base_query = base_query.where(Publication.state == state)
        # Get The Total Number Of Publications
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_publications = f_result.scalar()
        # Get Publications
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query.options(selectinload(Publication.publication_category))
        s_result = await session.execute(s_query)
        publications = s_result.scalars().all()
        return {
            "total_publications": total_publications,
            "publications": publications
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/{publication_id}", response_model=GetPublication)
async def get_by_id(
    session: SessionDep,
    publication_id: Annotated[int, Path(gt=0)]
) -> GetPublication | JSONResponse:
    try:
        # Check If Publication Exists
        query = select(Publication).where(
            Publication.publication_id == publication_id
        ).options(selectinload(Publication.publication_category))
        result = await session.execute(query)
        publication = result.scalar_one_or_none()
        if not publication:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Publication does not exists"}
            )
        return publication
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_postulation(
    session: SessionDep,
    payload: str = Form(...),
    image: UploadFile = File(...),
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Des-Serielize Payload
        data_dict = json.loads(payload)
        data = CreatePublication(**data_dict)
        # Check Image Validations
        if image.content_type != "image/jpeg":
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The file type must be .jpg"}
            )
        file_content = await image.read()
        if len(file_content) > IMAGE_MAX_SIZE:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The file size must be a maximum of 1 MB"}
            )
        # Ensure Upload Directory Exists
        os.makedirs("src/uploads/publication_images", exist_ok=True)
        # Create Image Path And Save It
        filename = f"{uuid4().hex}_{image.filename}"
        file_path = os.path.join("src/uploads/publication_images", filename)
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        # Create Publication
        publication = Publication(
            **data.model_dump(),
            image=filename
        )
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
    payload: str = Form(...),
    image: UploadFile | None = File(None),
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Des-Serielize Payload
        data_dict = json.loads(payload)
        data = UpdatePublication(**data_dict)
        # Check If Publication Exists
        publication = await session.get(Publication, publication_id)
        if not publication:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Publication does not exists"}
            )
        # Check Image Validations
        if image:
            if image.content_type != "image/jpeg":
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"detail": "The file type must be .jpg"}
                )
            file_content = await image.read()
            if len(file_content) > IMAGE_MAX_SIZE:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"detail": "The file size must be a maximum of 1 MB"}
                )
            # Ensure Upload Directory Exists
            os.makedirs("src/uploads/publication_images", exist_ok=True)
            # Check If Publication Already Had Image And Remove It
            if publication.image:
                old_photo_path = os.path.join("src/uploads/publication_images", publication.image)
                if os.path.exists(old_photo_path):
                    os.remove(old_photo_path)
            # Update Image Path And Save It
            filename = f"{uuid4().hex}_{image.filename}"
            file_path = os.path.join("src/uploads/publication_images", filename)
            with open(file_path, "wb") as buffer:
                buffer.write(file_content)
            publication.image = filename
        # Update Publication
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
        print(ex)
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.delete("/{publication_id}")
async def remove_publication(
    session: SessionDep,
    publication_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Publication Exists
        publication = await session.get(Publication, publication_id)
        if not publication:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Publication plan does not exists"}
            )
        # Check If Publication Has Image And Delete It
        if publication.image:
            # Ensure Upload Directory Exists
            os.makedirs("src/uploads/publication_images", exist_ok=True)
            os.remove(os.path.join("src/uploads/publication_images", publication.image))
        # Delete Publication
        await session.delete(publication)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed publication"}
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