from fastapi import APIRouter, HTTPException, Path, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.candidate_certification import CandidateCertification
from models.candidate import Candidate
from schemas.candidate_certification import (
    CreateCertification, 
    UpdateCertification, 
    GetCertification
)
from utilities import get_current_user

router = APIRouter(prefix="/candidate-certifications", tags=["candidate-certifications"])

@router.get("/", response_model=list[GetCertification])
async def get_by_run(
    session: SessionDep,
    current_user: dict = Depends(get_current_user)
) -> list[GetCertification]:
    try:
        # Get Candidate Certifications
        query = select(CandidateCertification).options(
            selectinload(CandidateCertification.certification_type)
        ).where(CandidateCertification.candidate_id == current_user.get("sub"))
        result = await session.execute(query)
        certifications = result.scalars().all()
        return certifications
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_certification(
    session: SessionDep,
    data: CreateCertification,
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
        # Create Candidate Certification
        certiticaction = CandidateCertification(
            **data.model_dump(),
            candidate_id=candidate_id
        )
        session.add(certiticaction)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered certification"}
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

@router.put("/{certification_id}")
async def update_certification(
    session: SessionDep,
    certification_id: Annotated[int, Path(gt=0)],
    data: UpdateCertification,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Certification Exists
        certification = await session.get(CandidateCertification, certification_id)
        if not certification:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Certification does not exists"}
            )
        # Update Candidate Certification
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(certification, key, value)
        session.add(certification)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated certification"}
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

@router.delete("/{certification_id}")
async def remove_certification(
    session: SessionDep,
    certification_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Certification Exists
        certification = await session.get(CandidateCertification, certification_id)
        if not certification:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Certification does not exists"}
            )
        # Delete Candidate Certification
        await session.delete(certification)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed certification"}
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