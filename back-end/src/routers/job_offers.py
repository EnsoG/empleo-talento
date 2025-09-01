from fastapi import APIRouter, HTTPException, Query, Path, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from datetime import date
from typing import Annotated, Literal, List, Dict, Any

from config.db import SessionDep
from models.job_offer import JobOffer
from models.codelco_job import CodelcoJob
from models.job_question import JobQuestion
from models.city import City
from models.region import Region
from models.company import Company
from models.company_user import CompanyUser
from models.specific_position import SpecificPosition
from models.generic_position import GenericPosition
from models.job_type import JobType
from models.shift import Shift
from models.job_day import JobDay
from models.postulation import Postulation
from schemas.job_offer import (
    CreateOffer,
    UpdateOffer,
    GetOffers,
    GetOffer,
    GetSummaryOffer,
    OfferStateEnum,
    OfferFeaturedEnum
)
from schemas.job_question import QuestionTypeEnum
from schemas.postulation import PostulationStateEnum
from schemas.extras import UserRoleEnum
from utilities import (
    validate_earlier_date, 
    get_current_user,
    get_optional_user
)

router = APIRouter(prefix="/job-offers", tags=["job-offers"])

SourceType = Literal["portal", "panel"]

@router.get("/", response_model=GetOffers)
async def get_offers(
    session: SessionDep,
    page: Annotated[int, Query(gt=0)] = 1,
    search: Annotated[str | None, Query()] = None,
    region: Annotated[int | None, Query(gt=0)] = None,
    city: Annotated[int | None, Query(gt=0)] = None,
    contract: Annotated[int | None, Query(gt=0)] = None,
    job_type: Annotated[str | None, Query()] = None,
    source: Annotated[SourceType, Query()] = "portal",
    state: Annotated[OfferStateEnum | None, Query()] = None,
    company: Annotated[str | None, Query()] = None,
    company_info: Annotated[bool, Query()] = False,
    current_user: dict | None = Depends(get_optional_user)
) -> GetOffers | JSONResponse:
    try:
        clean_search = search.strip() if search and search.strip() else None
        clean_company = company.strip() if company and company.strip() else None
        base_query = select(JobOffer).outerjoin(JobOffer.city).outerjoin(City.region).outerjoin(JobOffer.job_type).outerjoin(Company)
        # Check Job Offers Source
        if source == "portal":
            base_query = base_query.where(
                JobOffer.state == OfferStateEnum.active,
                JobOffer.publication_date <= date.today(),
                or_(
                    JobOffer.closing_date >= date.today(),
                    JobOffer.closing_date == None
                )
            )
        if source == "panel":
            # Check If User Is Authenticated
            if not current_user:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Not authenticated"}
                )
            # Check User Type/Role
            if current_user.get("user_role") == UserRoleEnum.company_user:
                # Get Company Id By User
                user = await session.get(CompanyUser, current_user.get("sub"))
                base_query = base_query.where(JobOffer.company_id == user.company_id)
        # Check Query Params
        if region:
            base_query = base_query.where(Region.number_region == region)
        if city:
            base_query = base_query.where(JobOffer.city_id == city)
        if clean_search:
            base_query = base_query.where(JobOffer.title.ilike(f"%{clean_search}%"))
        if contract:
            base_query = base_query.where(JobOffer.type_id == contract)
        if job_type:
            base_query = base_query.where(JobType.name.ilike(job_type))
        if state:
            base_query = base_query.where(JobOffer.state == state)
        if clean_company:
            base_query = base_query.where(Company.trade_name.ilike(f"%{clean_company}%"))
        # Get The Total Number Of Offers
        f_query = select(func.count()).select_from(base_query.subquery())
        f_result = await session.execute(f_query)
        total_offers = f_result.scalar()
        # Get Offers With Relationships
        s_query = base_query.options(
            selectinload(JobOffer.performance_area),
            selectinload(JobOffer.city).selectinload(City.region),
            selectinload(JobOffer.contract_type),
            selectinload(JobOffer.job_type),
            selectinload(JobOffer.company).selectinload(Company.company_sector)
        ).offset(5 * (page - 1)).limit(5)
        s_result = await session.execute(s_query)
        offers = s_result.scalars().all()
        # Exclude Company Information If Is Necessary
        if not company_info:
            for offer in offers:
                offer.company = None
        return {
            "total_offers": total_offers,
            "offers": offers
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/latest", response_model=list[GetSummaryOffer], response_model_exclude_unset=True)
async def get_latest(
    session: SessionDep,
    featured: Annotated[bool, Query()] = False
) -> list[GetSummaryOffer]:
    try:
       # Get 5 Latest Job Offers (Featured Or Not)
        featured = 1 if featured else 0
        query = select(JobOffer).options(
            selectinload(JobOffer.city).selectinload(City.region),
            selectinload(JobOffer.company).selectinload(Company.company_sector),
            selectinload(JobOffer.contract_type)
        ).where(
            JobOffer.featured == featured,
            JobOffer.state == OfferStateEnum.active,
            JobOffer.publication_date <= date.today(),
            or_(
                JobOffer.closing_date >= date.today(),
                JobOffer.closing_date == None
            )
        ).order_by(JobOffer.offer_id.desc()) 
        result = await session.execute(query)
        offers = result.scalars().all()
        return offers
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/{offer_id}", response_model=GetOffer)
async def get_by_id(
    session: SessionDep,
    offer_id: Annotated[int, Path(gt=0)],
    company_info: Annotated[bool, Query()] = False,
    question_info: Annotated[bool, Query()] = False
) -> GetOffer | JSONResponse:
    try:
        # Check If Job Offer Exists And Get It
        query = select(JobOffer).options(
            selectinload(JobOffer.performance_area),
            selectinload(JobOffer.city).selectinload(City.region),
            selectinload(JobOffer.contract_type),
            selectinload(JobOffer.job_type),
            selectinload(JobOffer.job_schedule),
            selectinload(JobOffer.shift),
            selectinload(JobOffer.job_day),
            selectinload(JobOffer.job_questions),
            selectinload(JobOffer.specific_position),
            selectinload(JobOffer.company).selectinload(Company.company_sector)
        ).where(JobOffer.offer_id == offer_id)
        result = await session.execute(query)
        offer = result.scalar_one_or_none()
        if not offer:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Job offer does not exists"}
            )
        # Assing Specific Position If Is Necessary
        if offer.specific_position_id:
            offer.position = offer.specific_position.name
        # Exclude Company Information If Is Necessary
        if not company_info:
            offer.company = None
        # Exclude Qiesiton Information If Is Necessary
        if not question_info:
            offer.job_questions = []
        return offer
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_offer(
    session: SessionDep,
    data: CreateOffer,
    current_user: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        base_data = data.model_dump(exclude={
            "questions",
            "generic_position_id"
         })
        # Check Position And Generic Position
        if data.generic_position_id:
            # Check If Generic Position Exists
            position_exists = await session.get(GenericPosition, data.generic_position_id)
            if not position_exists:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"detail": "Generic position does not exists"}
                )
            # Create Specific Position
            specific_position = SpecificPosition(
                name=data.position,
                position_id=data.generic_position_id
            )
            session.add(specific_position)
            await session.flush()
            base_data["position"] = None
            base_data["specific_position_id"]= specific_position.specific_position_id
        # Generate Next Job Offer Code
        result = await session.execute(select(func.count(JobOffer.offer_id)))
        count = result.scalar()
        today = date.today()
        # Create Job Offer
        offer = JobOffer(
            **base_data,
            code= (1000 + count) + today.year + today.month + today.day,
            state=OfferStateEnum.pending,
            featured=OfferFeaturedEnum.not_featured
        )
        # Get Company User To Get Company Id And Add It In Job Offer
        if current_user.get("user_role") == UserRoleEnum.company_user:
            user = await session.get(CompanyUser, current_user.get("sub"))
            offer.company_id = user.company_id
        session.add(offer)
        # Create Salary Question If It's Necessary
        if data.salary:
            await session.flush()
            question = JobQuestion(
                question="¿Cuál es tu pretensión salarial liquida?",
                question_type=QuestionTypeEnum.numeric,
                offer_id=offer.offer_id
            )
            session.add(question)
        # Create Job Question If It's Necessary
        if data.questions:
            await session.flush()
            questions = []
            for q in data.questions:
                questions.append(JobQuestion(
                    question=q.question,
                    question_type=q.question_type,
                    offer_id=offer.offer_id
                ))
            session.add_all(questions)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered job offer"}
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

@router.put("/finish/{offer_id}")
async def finish_offer(
    session: SessionDep,
    offer_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Job Offer Exists
        offer = await session.get(JobOffer, offer_id)
        if not offer:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Job offer does not exists"}
            )
        # Update Job Offer State
        offer.state = OfferStateEnum.finished
        # Get Postulation Candidates
        query = select(Postulation).where(Postulation.offer_id == offer_id)
        result = await session.execute(query)
        candidates = result.scalars().all()
        # Update Candidate States
        for candidate in candidates:
            if candidate.state not in [PostulationStateEnum.contracted, PostulationStateEnum.not_selected]:
                candidate.state = PostulationStateEnum.not_selected
        session.add_all([*candidates, offer])
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Job offer finished successfully"}
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

@router.put("/{offer_id}")
async def update_offer(
    session: SessionDep,
    offer_id: Annotated[int, Path(gt=0)],
    data: UpdateOffer,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Job Offer Exists
        offer = await session.get(JobOffer, offer_id)
        if not offer:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Job offer does not exists"}
            )
        # Check 'closing_date' If It's Necessary
        if data.closing_date:
            if not validate_earlier_date(offer.publication_date, data.closing_date):
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"detail": "The closing date must be greater than the publication date"}
                )
        # Update Job Offer
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(offer, key, value)
        session.add(offer)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated job offer"}
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
