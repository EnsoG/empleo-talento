from fastapi import APIRouter, HTTPException, Query, Depends, Path, BackgroundTasks, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from utilities import get_current_user
from config.email.email_utilities import send_sender_contact_email, send_recipient_contact_email
from models.knownledge_level import KnownledgeLevel
from models.language_level import LanguageLevel
from models.region import Region
from models.city import City
from models.contract_type import ContractType
from models.job_type import JobType
from models.shift import Shift
from models.job_day import JobDay
from models.publication_category import PublicationCategory
from models.alert_frequency import AlertFrequency
from schemas.extras import ContactEmail
from schemas.contract_type import GetContracts, CreateContract, UpdateContract
from schemas.job_type import GetJobTypes, CreateJobType, UpdateJobType
from schemas.shift import GetShifts, CreateShift, UpdateShift
from schemas.job_day import GetJobDays, CreateJobDay, UpdateJobDay
from schemas.publication_category import GetPublicationCategories, CreatePublicationCategory, UpdatePublicationCategory

router = APIRouter(prefix="/metadata", tags=["metadata"])

@router.get("/")
async def get_metadata(session: SessionDep):
    try:
        # Get Knownledge Levels
        sd_result = await session.execute(select(KnownledgeLevel))
        knownledge_levels = sd_result.scalars().all()
        # Get Languages Levels
        fe_result = await session.execute(select(LanguageLevel))
        languages_levels = fe_result.scalars().all()
        # Get Regions
        eh_result = await session.execute(select(Region))
        regions = eh_result.scalars().all()

        return {
            "knownledge_levels": knownledge_levels,
            "language_levels": languages_levels,
            "regions": regions
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )
# Contact Emails
@router.post("/contact-emails")
async def send_contact_email(
    data: ContactEmail,
    background_tasks: BackgroundTasks
) -> JSONResponse:
    try:
        # Send Sender Contact Email
        background_tasks.add_task(send_sender_contact_email, data.email, data.full_name)
        # Send Recipient Contact Email
        background_tasks.add_task(send_recipient_contact_email, data)
        return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"detail": "Contact email sent successfully"}
            )
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

# City Table
@router.get("/cities", response_model=list[City])
async def get_cities(
    session: SessionDep,
    region: Annotated[int, Query(gt=0)]
) -> list[City]:
    try:
        query = select(City).where(City.region_id == region)
        result = await session.execute(query)
        cities = result.scalars().all()

        return cities
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )
# Contract Type Table
@router.get("/contract-types", response_model=GetContracts)
async def get_contract_types(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetContracts:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(ContractType)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(ContractType.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Contract Types
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_contracts = f_result.scalar()
        # Get Contract Types
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        contract_types = s_result.scalars().all()

        return {
            "total_contracts": total_contracts,
            "contract_types": contract_types
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/contract-types")
async def create_contract_type(
    session: SessionDep,
    data: CreateContract,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Contract Type
        contract_type = ContractType(**data.model_dump())
        session.add(contract_type)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered contract type"}
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

@router.put("/contract-types/{type_id}")
async def update_contract_type(
    session: SessionDep,
    type_id: Annotated[int, Path(gt=0)],
    data: UpdateContract,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Contract Type Exists
        contract_type = await session.get(ContractType, type_id)
        if not contract_type:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Contract type does not exists"}
            )
        # Update Contract Type
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(contract_type, key, value)
        session.add(contract_type)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated contract type"}
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

@router.delete("/contract-types/{type_id}")
async def remove_contract_type(
    session: SessionDep,
    type_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Contract Type Exists
        contract_type = await session.get(ContractType, type_id)
        if not contract_type:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Contract type does not exists"}
            )
        # Delete Contract Type
        await session.delete(contract_type)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed contract type"}
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
# Job Type Table
@router.get("/job-types", response_model=GetJobTypes)
async def get_job_types(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetJobTypes:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(JobType)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(JobType.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Job Types
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_types = f_result.scalar()
        # Get Job Types
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        job_types = s_result.scalars().all()

        return {
            "total_types": total_types,
            "job_types": job_types
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/job-types")
async def create_job_type(
    session: SessionDep,
    data: CreateJobType,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Job Type
        job_type = JobType(**data.model_dump())
        session.add(job_type)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered job type"}
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

@router.put("/job-types/{job_type_id}")
async def update_job_type(
    session: SessionDep,
    job_type_id: Annotated[int, Path(gt=0)],
    data: UpdateJobType,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Job Type Exists
        job_type = await session.get(JobType, job_type_id)
        if not job_type:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Job type does not exists"}
            )
        # Update Job Type
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(job_type, key, value)
        session.add(job_type)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated job type"}
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

@router.delete("/job-types/{job_type_id}")
async def remove_job_type(
    session: SessionDep,
    job_type_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Contract Type Exists
        job_type = await session.get(JobType, job_type_id)
        if not job_type:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Job type does not exists"}
            )
        # Delete Job Type
        await session.delete(job_type)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed job type"}
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
# Shift Table
@router.get("/shifts", response_model=GetShifts)
async def get_shifts(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetShifts:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(Shift)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(Shift.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Shifts
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_shifts = f_result.scalar()
        # Get Job Types
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        shifts = s_result.scalars().all()

        return {
            "total_shifts": total_shifts,
            "shifts": shifts
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/shifts")
async def create_shift(
    session: SessionDep,
    data: CreateShift,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Shift
        shift = Shift(**data.model_dump())
        session.add(shift)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered shift"}
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

@router.put("/shifts/{shift_id}")
async def update_shift(
    session: SessionDep,
    shift_id: Annotated[int, Path(gt=0)],
    data: UpdateShift,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Shift Exists
        shift = await session.get(Shift, shift_id)
        if not shift:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Shift does not exists"}
            )
        # Update Shift
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(shift, key, value)
        session.add(shift)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated shift"}
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

@router.delete("/shifts/{shift_id}")
async def remove_shift(
    session: SessionDep,
    shift_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Shift Exists
        shift = await session.get(Shift, shift_id)
        if not shift:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Shift does not exists"}
            )
        # Delete Shift
        await session.delete(shift)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed shift"}
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
# Job Day Table
@router.get("/job-days", response_model=GetJobDays)
async def get_job_days(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetJobDays:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(JobDay)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(JobDay.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Job Days
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_days = f_result.scalar()
        # Get Job Days
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        job_days = s_result.scalars().all()

        return {
            "total_days": total_days,
            "job_days": job_days
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/job-days")
async def create_job_day(
    session: SessionDep,
    data: CreateJobDay,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Job Day
        job_day = JobDay(**data.model_dump())
        session.add(job_day)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered job day"}
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

@router.put("/job-days/{day_id}")
async def update_job_day(
    session: SessionDep,
    day_id: Annotated[int, Path(gt=0)],
    data: UpdateJobDay,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Job Day Exists
        job_day = await session.get(JobDay, day_id)
        if not job_day:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Job day does not exists"}
            )
        # Update Job Day
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(job_day, key, value)
        session.add(job_day)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated job day"}
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

@router.delete("/job-days/{day_id}")
async def remove_shift(
    session: SessionDep,
    day_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Job Day Exists
        job_day = await session.get(JobDay, day_id)
        if not job_day:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Job day does not exists"}
            )
        # Delete Job Day
        await session.delete(job_day)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed job day"}
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
# Publication Category Table
@router.get("/publication-categories", response_model=GetPublicationCategories)
async def get_publication_categories(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetPublicationCategories:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(PublicationCategory)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(PublicationCategory.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Publication Categories
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_categories = f_result.scalar()
        # Get Job Days
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        publication_categories = s_result.scalars().all()

        return {
            "total_categories": total_categories,
            "publication_categories": publication_categories
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/publication-categories")
async def create_publication_category(
    session: SessionDep,
    data: CreatePublicationCategory,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Publication Category
        publication_category = PublicationCategory(**data.model_dump())
        session.add(publication_category)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered publication category"}
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

@router.put("/publication-categories/{category_id}")
async def update_publication_category(
    session: SessionDep,
    category_id: Annotated[int, Path(gt=0)],
    data: UpdatePublicationCategory,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Publication Category Exists
        publication_category = await session.get(PublicationCategory, category_id)
        if not publication_category:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Publication category does not exists"}
            )
        # Update Publication Category
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(publication_category, key, value)
        session.add(publication_category)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated publication category"}
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

@router.delete("/publication-categories/{category_id}")
async def remove_publication_category(
    session: SessionDep,
    category_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Publication Category Exists
        publication_category = await session.get(PublicationCategory, category_id)
        if not publication_category:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Publication category does not exists"}
            )
        # Delete Publication Category
        await session.delete(publication_category)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed publication category"}
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
# Alert Frequency Table
@router.get("/alert-frequencies", response_model=list[AlertFrequency])
async def get_alert_frequencies(session: SessionDep) -> list[AlertFrequency]:
    try:
        # Get Alert Frequencies
        query = select(AlertFrequency)
        result = await session.execute(query)
        alert_frequencies = result.scalars().all()
        return alert_frequencies
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )