from fastapi import APIRouter, HTTPException, BackgroundTasks, Query, Depends, Path, status
from fastapi.responses import JSONResponse
from fastapi_mail import MessageSchema, MessageType
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from sqlmodel import select, func, or_
from typing import Annotated

from config.db import SessionDep
from config.email.email_utilities import send_postulation_email_confirmation
from models.postulation import Postulation
from models.job_answer import JobAnswer
from models.job_offer import JobOffer
from models.city import City
from models.company import Company
from models.candidate import Candidate
from schemas.postulation import (
    CreatePostulation,
    GetPostulations,
    UpdatePostulation,
    PostulationStateEnum
)
from utilities import get_current_user

router = APIRouter(prefix="/postulations", tags=["postulations"])

@router.get("/", response_model=GetPostulations)
async def get_by_candidate(
    session: SessionDep,
    page: Annotated[int, Query(gt=0)] = 1,
    current_user: dict = Depends(get_current_user)
) -> GetPostulations:
    try:
        candidate_id = current_user.get("sub")
        base_query = select(Postulation).where(Postulation.candidate_id == candidate_id)
        # Get The Total Number Of Postulations
        f_query = select(func.count()).select_from(base_query.subquery())
        f_result = await session.execute(f_query)
        total_postulations = f_result.scalar()
        # Get Active Postulations
        s_query = base_query.options(
            selectinload(Postulation.job_offer).options(
                selectinload(JobOffer.city).options(
                    selectinload(City.region)
                ),
                selectinload(JobOffer.company).options(
                    selectinload(Company.company_sector)
                ),
                selectinload(JobOffer.contract_type),
            )
        ).order_by(Postulation.postulation_date.desc()).offset(5 * (page - 1)).limit(5)
        s_result = await session.execute(s_query)
        postulations = s_result.scalars().all()
        return {
            "total_postulations": total_postulations,
            "postulations": postulations
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/{offer_id}", response_model=GetPostulations)
async def get_by_offer(
    session: SessionDep,
    offer_id: Annotated[int, Path(gt=0)],
    page: Annotated[int, Query(gt=0)] = 1,
    search: Annotated[str | None, Query()] = None,
    state: Annotated[PostulationStateEnum | None, Query()] = None,
    _: dict = Depends(get_current_user)
) -> GetPostulations | JSONResponse:
    try:
        clean_search = search.strip() if search and search.strip() else None
        # Check If Offer Exists
        offer_exits = await session.get(JobOffer, offer_id)
        if not offer_exits:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Job offer does not exists"}
            )
        # Check Query Params
        base_query = select(Postulation).join(Postulation.candidate).where(Postulation.offer_id == offer_id)
        if clean_search:
            base_query = base_query.where(or_(
                Candidate.name.ilike(f"%{clean_search}%"),
                Candidate.paternal.ilike(f"%{clean_search}%"),
                Candidate.maternal.ilike(f"%{clean_search}%")
            ))
        if state:
            base_query = base_query.where(Postulation.state == state)
        # Get Total Postulations
        f_query = select(func.count()).select_from(base_query.subquery())
        f_result = await session.execute(f_query)
        total_postulations = f_result.scalar()
        # Get Postulations By Offer
        s_query = base_query.options(
            selectinload(Postulation.candidate),
            selectinload(Postulation.job_answers).selectinload(JobAnswer.job_question)
        ).order_by(Postulation.postulation_date.asc()).offset(5 * (page - 1)).limit(5)
        s_result = await session.execute(s_query)
        postulations = s_result.scalars().all()
        return {
            "total_postulations": total_postulations,
            "postulations": postulations
        }
    except Exception as ex:
        print(ex)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_postulation(
     session: SessionDep,
     background_tasks: BackgroundTasks,
     data: CreatePostulation,
     current_user: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        candidate_id = current_user.get("sub")
        # Check If Candidate Already Apply To This Offer
        query = select(Postulation).where(
            Postulation.offer_id == data.offer_id,
            Postulation.candidate_id == candidate_id
        )
        result = await session.execute(query)
        applied_already = result.scalar_one_or_none()
        if applied_already:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Candidate applied already to this job offer"}
            )
        # Create Postulation
        postulation = Postulation(
            **data.model_dump(), 
            state=PostulationStateEnum.postulate,
            candidate_id=candidate_id
        )
        session.add(postulation)
        # Check If Postulation Have Answers And Register
        if data.answers:
            await session.flush()
            answers = []
            for a in data.answers:
                answers.append(JobAnswer(
                    answer=a.answer,
                    question_id=a.question_id,
                    postulation_id=postulation.postulation_id
                ))
                session.add_all(answers)
        await session.commit()
         # Get Job Offer
        offer = await session.get(JobOffer, data.offer_id)
        # Send Postulation Email Confirmation
        background_tasks.add_task(send_postulation_email_confirmation, offer.title)
        # Send Confirmation Email
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully registered postulation"}
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

@router.put("/{postulation_id}")
async def update_study(
    session: SessionDep,
    postulation_id: Annotated[int, Path(gt=0)],
    data: UpdatePostulation,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Postulation Exists
        postulation = await session.get(Postulation, postulation_id)
        if not postulation:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Postulation does not exists"}
            )
        # Update Postulation
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(postulation, key, value)
        session.add(postulation)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated postulation"}
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