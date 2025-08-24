from fastapi import APIRouter, HTTPException, Path, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.candidate import Candidate
from models.candidate_software import CandidateSoftware
from schemas.candidate_software import (
    CreateSoftware,
    UpdateSoftware,
    GetCandidateSoftware
)
from utilities import get_current_user

router = APIRouter(prefix="/candidate-softwares", tags=["candidate-softwares"])

@router.get("/", response_model=list[GetCandidateSoftware])
async def get_by_run(
    session: SessionDep,
    current_user: dict = Depends(get_current_user)
) -> list[GetCandidateSoftware]:
    try:
        # Get Candidate Softwares
        query = select(CandidateSoftware).options(
            selectinload(CandidateSoftware.software),
            selectinload(CandidateSoftware.knownledge_level)
        ).where(CandidateSoftware.candidate_id == current_user.get("sub"))
        result = await session.execute(query)
        softwares = result.scalars().all()
        return softwares
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_software(
    session: SessionDep,
    data: CreateSoftware,
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
        # Check If Candidate Already Had The Software
        query = select(CandidateSoftware).where(
            CandidateSoftware.software_id == data.software_id,
            CandidateSoftware.candidate_id == candidate_id
        )
        result = await session.execute(query)
        software_exists = result.scalar_one_or_none()
        if software_exists:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Candidate already had this software"}
            )
        # Create Candidate Software
        software = CandidateSoftware(
            **data.model_dump(),
            candidate_id=candidate_id
        )
        session.add(software)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered software"}
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

@router.put("/{candidate_software_id}")
async def update_software(
    session: SessionDep,
    candidate_software_id: Annotated[int, Path(gt=0)],
    data: UpdateSoftware,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Software Exists
        software = await session.get(CandidateSoftware, candidate_software_id)
        if not software:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Software does not exists"}
            )
        # Update Candidate Software
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(software, key, value)
        session.add(software)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated software"}
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

@router.delete("/{candidate_software_id}")
async def remove_software(
    session: SessionDep,
    candidate_software_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Software Exists
        software = await session.get(CandidateSoftware, candidate_software_id)
        if not software:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Software does not exists"}
            )
        # Delete Candidate Software
        await session.delete(software)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed software"}
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