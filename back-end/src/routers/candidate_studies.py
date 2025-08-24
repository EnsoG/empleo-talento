from fastapi import APIRouter, HTTPException, Path, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlmodel import select
from typing import Annotated

from config.db import SessionDep
from models.candidate import Candidate
from models.candidate_study import CandidateStudy
from schemas.candidate_study import CreateStudy, UpdateStudy, GetStudy
from utilities import get_current_user

router = APIRouter(prefix="/candidate-studies", tags=["candidate-studies"])

@router.get("/", response_model=list[GetStudy])
async def get_by_candidate(
    session: SessionDep,
    current_user: dict = Depends(get_current_user)
) -> list[GetStudy]:
    try:
        # Get Candidate Studies
        query = select(CandidateStudy).where(
            CandidateStudy.candidate_id == current_user.get("sub")
        ).order_by(CandidateStudy.start_date.desc())
        result = await session.execute(query)
        studies = result.scalars().all()
        return studies
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_study(
    session: SessionDep,
    data: CreateStudy,
    current_user: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        candidate_id = current_user.get("sub")
        # Check If Candidate Exists
        candidate_exist = await session.get(Candidate, candidate_id)
        if not candidate_exist:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Candidate does not exists"}
            )
        # Create Candidate Study
        study = CandidateStudy(
            **data.model_dump(),
            candidate_id=candidate_id
        )
        session.add(study)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered study"}
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

@router.put("/{study_id}")
async def update_study(
    session: SessionDep,
    study_id: Annotated[int, Path(gt=0)],
    data: UpdateStudy,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Study Exists
        study = await session.get(CandidateStudy, study_id)
        if not study:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Study does not exists"}
            )
        # Update Candidate Study
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(study, key, value)
        session.add(study)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated study"}
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

@router.delete("/{study_id}")
async def remove_study(
    session: SessionDep,
    study_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Study Exists
        study = await session.get(CandidateStudy, study_id)
        if not study:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Study does not exists"}
            )
        # Delete Candidate Study
        await session.delete(study)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed study"}
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