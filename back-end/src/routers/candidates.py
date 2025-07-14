import os
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from uuid import uuid4

from config.db import SessionDep
from models.candidate import Candidate
from schemas.candidate import UpdateCandidate, GetCandidate
from utilities import get_current_user

router = APIRouter(prefix="/candidates")

RESUME_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}
# Size Is Set In 5 MB
RESUME_MAX_SIZE = 5 * 1024 * 1024
# Size Is Set In 1 MB
PHOTO_MAX_SIZE = 1 * 1024 * 1024

@router.get("/", response_model=GetCandidate)
async def get_candidate(
    session: SessionDep,
    current_user: dict = Depends(get_current_user)
) -> GetCandidate | JSONResponse:
    try:
        # Check If Candidate Exists
        candidate = await session.get(Candidate, current_user.get("sub"))
        if not candidate:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Candidate does not exists"}
            )
        return candidate
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.put("/")
async def update_candidate(
    session: SessionDep,
    data: UpdateCandidate,
    current_user: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Exists
        candidate = await session.get(Candidate, current_user.get("sub"))
        if not candidate:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Candidate does not exists"}
            )
        # Update Candidate
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(candidate, key, value)
        session.add(candidate)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated candidate"}
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

@router.put("/update-resume")
async def update_resume(
    session: SessionDep,
    resume: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Exists
        candidate = await session.get(Candidate, current_user.get("sub"))
        if not candidate:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Candidate does not exists"}
            )
        # Check File Content Type
        if resume.content_type not in RESUME_CONTENT_TYPES:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The file type must be .pdf or .docx"}
            )
        # Check File Size
        file_content = await resume.read()
        if len(file_content) > RESUME_MAX_SIZE:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The file size must be a maximum of 1 MB"}
            )
        # Check If Candidate Already Had Resume And Remove
        if candidate.resume:
            old_resume_path = os.path.join("src/uploads/resumes", candidate.resume)
            if os.path.exists(old_resume_path):
                os.remove(old_resume_path)
        # Update Resume Path And Save It
        filename = f"{uuid4().hex}_{resume.filename}"
        file_path = os.path.join("src/uploads/resumes", filename)
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        candidate.resume = filename
        session.add(candidate)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated candidate resume"}
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

@router.put("/update-photo")
async def update_photo(
    session: SessionDep,
    photo: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Exists
        candidate = await session.get(Candidate, current_user.get("sub"))
        if not candidate:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Candidate does not exists"}
            )
        # Check File Content Type
        if photo.content_type != "image/jpeg":
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The file type must be .jpg"}
            )
        # Check File Size
        file_content = await photo.read()
        if len(file_content) > PHOTO_MAX_SIZE:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "The file size must be a maximum of 1 MB"}
            )
        # Check If Candidate Already Had Photo And Remove
        if candidate.photo:
            old_photo_path = os.path.join("src/uploads/photos", candidate.photo)
            if os.path.exists(old_photo_path):
                os.remove(old_photo_path)
        # Update Photo Path And Save It
        filename = f"{uuid4().hex}_{photo.filename}"
        file_path = os.path.join("src/uploads/photos", filename)
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        candidate.photo = filename
        session.add(candidate)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated candidate photo"}
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