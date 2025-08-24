import os
import pdfkit
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Path, status
from fastapi.responses import JSONResponse, StreamingResponse
from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from jinja2 import Environment, FileSystemLoader
from io import BytesIO
from typing import Annotated
from uuid import uuid4

from config.db import SessionDep
from config.settings import get_settings
from models.candidate import Candidate
from models.candidate_certification import CandidateCertification
from models.candidate_software import CandidateSoftware
from models.candidate_language import CandidateLanguage
from models.candidate_position_preference import CandidatePositionPreference
from models.city import City
from schemas.candidate import UpdateCandidate, GetCandidate
from schemas.candidate_position_preference import GetPositionPreference, UpdatePositionPreference
from utilities import get_current_user

router = APIRouter(prefix="/candidates", tags=["candidates"])
template_dir = Environment(loader=FileSystemLoader("src/templates/cv"))
settings = get_settings()

WKHTMLTOPDF_PATH = settings.wkhtmltopdf_exe_path
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

@router.get("/resume/{candidate_id}")
async def get_resume(
    session: SessionDep,
    candidate_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
):
    try:
        # Check If Candidate Exists
        query = select(Candidate).options(
            selectinload(Candidate.work_experiences),
            selectinload(Candidate.candidate_studies),
            selectinload(Candidate.candidate_certifications).options(
                selectinload(CandidateCertification.certification_type)
            ),
            selectinload(Candidate.candidate_softwares).options(
                selectinload(CandidateSoftware.software),
                selectinload(CandidateSoftware.knownledge_level)
            ),
            selectinload(Candidate.candidate_languages).options(
                selectinload(CandidateLanguage.language),
                selectinload(CandidateLanguage.language_level)
            )
        ).where(Candidate.candidate_id == candidate_id)
        result = await session.execute(query)
        candidate = result.scalar_one_or_none()
        if not candidate:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Candidate does not exists"}
            )
        # Set Resume HTML Template
        template = template_dir.get_template("cv.html")
        html_content = template.render(candidate=candidate)
        # Generate PDF
        config = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_PATH) if WKHTMLTOPDF_PATH else None
        pdf_bytes = pdfkit.from_string(html_content, False, configuration=config)
        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=cv.pdf"}
        )
    except Exception as ex:
        print(ex)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/position-preferences/{candidate_id}", response_model=GetPositionPreference)
async def get_position_preferences(
    session: SessionDep,
    candidate_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> GetPositionPreference:
    try:
        # Get Candidate Position Preferences By Candidate
        query = select(CandidatePositionPreference).options(
            selectinload(CandidatePositionPreference.generic_position),
            selectinload(CandidatePositionPreference.performance_area),
            selectinload(CandidatePositionPreference.contract_type),
            selectinload(CandidatePositionPreference.job_type),
            selectinload(CandidatePositionPreference.city).options(
                selectinload(City.region)
            )
        ).where(candidate_id==candidate_id)
        result = await session.execute(query)
        position_preference = result.scalar_one_or_none()
        print(position_preference)
        return position_preference
    except Exception as ex:
        print(ex)
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
        # Ensure Upload Directory Exists
        os.makedirs("src/uploads/resumes", exist_ok=True)
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
        # Ensure Upload Directory Exists
        os.makedirs("src/uploads/photos", exist_ok=True)
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
        print(ex)
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.put("/position-preferences/{preference_id}")
async def update_position_preferences(
    session: SessionDep,
    preference_id: Annotated[int, Path(gt=0)],
    data: UpdatePositionPreference,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Candidate Position Preference Exists
        position_preference = await session.get(CandidatePositionPreference, preference_id)
        if not position_preference:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Candidate position preferences does not exists"}
            )
        # Update Candidate Position Preference
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(position_preference, key, value)
        session.add(position_preference)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated candidate position preferences"}
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