from fastapi import APIRouter, HTTPException, Depends, Query, Path, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.language import Language
from schemas.language import (
    CreateLanguage,
    GetLanguages,
    UpdateLanguage
)
from utilities import get_current_user

router = APIRouter(prefix="/languages", tags=["languages"])

@router.get("/", response_model=GetLanguages)
async def get_languages(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetLanguages:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(Language)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(Language.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Languages
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_languages = f_result.scalar()
        # Get Languages
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        languages = s_result.scalars().all()

        return {
            "total_languages": total_languages,
            "languages": languages
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_language(
    session: SessionDep,
    data: CreateLanguage,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Language
        language = Language(**data.model_dump())
        session.add(language)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered language"}
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

@router.put("/{language_id}")
async def update_language(
    session: SessionDep,
    language_id: Annotated[int, Path(gt=0)],
    data: UpdateLanguage,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Language Exists
        language = await session.get(Language, language_id)
        if not language:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Language does not exists"}
            )
        # Update Language
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(language, key, value)
        session.add(language)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated language"}
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

@router.delete("/{language_id}")
async def remove_language(
    session: SessionDep,
    language_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Language Exists
        language = await session.get(Language, language_id)
        if not language:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Language does not exists"}
            )
        # Delete Language
        await session.delete(language)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed language"}
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