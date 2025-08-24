from fastapi import APIRouter, HTTPException, Path, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from typing import Annotated

from config.db import SessionDep
from models.candidate import Candidate
from models.candidate_language import CandidateLanguage
from schemas.candidate_language import (
    CreateLanguage,
    UpdateLanguage,
    GetCandidateLanguage
)
from utilities import get_current_user

router = APIRouter(prefix="/candidate-languages", tags=["candidate-languages"])

@router.get("/", response_model=list[GetCandidateLanguage])
async def get_by_run(
    session: SessionDep,
    curret_user: dict = Depends(get_current_user)
) -> list[GetCandidateLanguage]:
    try:
        # Get Candidate Languages
        query = select(CandidateLanguage).options(
            selectinload(CandidateLanguage.language_level),
            selectinload(CandidateLanguage.language)
        ).where(CandidateLanguage.candidate_id == curret_user.get("sub"))
        result = await session.execute(query)
        languages = result.scalars().all()
        return languages
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_language(
    session: SessionDep,
    data: CreateLanguage,
    curret_user: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        candidate_id = curret_user.get("sub")
        # Check If Candidate Exists
        candidate_exist = await session.get(Candidate, candidate_id)
        if not candidate_exist:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Candidate does not exists"}
            )
        # Check If Candidate Already Had The Language
        query = select(CandidateLanguage).where(
            CandidateLanguage.candidate_id == candidate_id,
            CandidateLanguage.language_id == data.language_id
        )
        result = await session.execute(query)
        language_exists = result.scalar_one_or_none()
        if language_exists:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Candidate already had this language"}
            )
        # Create Candidate Language
        language = CandidateLanguage(
            **data.model_dump(),
            candidate_id=candidate_id
        )
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

@router.put("/{candidate_language_id}")
async def update_language(
    session: SessionDep,
    candidate_language_id: Annotated[int, Path(gt=0)],
    data: UpdateLanguage,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Language Exists
        language = await session.get(CandidateLanguage, candidate_language_id)
        if not language:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Language does not exists"}
            )
        # Update Candidate Language
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

@router.delete("/{candidate_language_id}")
async def remove_language(
    session: SessionDep,
    candidate_language_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Language Exists
        language = await session.get(CandidateLanguage, candidate_language_id)
        if not language:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Language does not exists"}
            )
        # Delete Candidate Language
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