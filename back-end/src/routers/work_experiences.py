from fastapi import APIRouter, HTTPException, Path, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlmodel import select
from typing import Annotated

from config.db import SessionDep
from models.candidate import Candidate
from models.work_experience import WorkExperience
from schemas.work_experience import CreateExperience, UpdateExperience, GetExperience
from utilities import get_current_user

router = APIRouter(prefix="/work-experiences", tags=["work-experiences"])

@router.get("/", response_model=list[GetExperience])
async def get_by_run(
    session: SessionDep,
    current_user: dict = Depends(get_current_user)
) -> list[GetExperience]:
    try:
        # Get Candidate Studies
        query = select(WorkExperience).where(WorkExperience.candidate_id == current_user.get("sub"))
        result = await session.execute(query)
        experiences = result.scalars().all()
        return experiences
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_experience(
    session: SessionDep,
    data: CreateExperience,
    current_user: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        candidate_id = current_user.get("sub")
        # Check If Candidate Exists
        candidate = await session.get(Candidate, candidate_id)
        if not candidate:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Candidate does not exists"}
            )
        # Create Work Experience
        experience = WorkExperience(
            **data.model_dump(),
            candidate_id=candidate_id
        )
        session.add(experience)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered work experience"}
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

@router.put("/{experience_id}")
async def update_experience(
    session: SessionDep,
    experience_id: Annotated[int, Path(gt=0)],
    data: UpdateExperience,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Work Experience Exists
        experience = await session.get(WorkExperience, experience_id)
        if not experience:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Work experience does not exists"}
            )
        # Update Work Experience
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(experience, key, value)
        session.add(experience)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated work experience"}
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

@router.delete("/{experience_id}")
async def remove_experience(
    session: SessionDep,
    experience_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Work Experience Exists
        experience = await session.get(WorkExperience, experience_id)
        if not experience:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Work experience does not exists"}
            )
        # Delete Work Experience
        await session.delete(experience)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed work experience"}
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