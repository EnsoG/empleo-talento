from fastapi import APIRouter, HTTPException, Depends, Query, Path, status
from fastapi.responses import JSONResponse
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from config.db import SessionDep
from models.job_schedule import JobSchedule
from schemas.job_schedule import (
    CreateSchedule,
    GetSchedules,
    UpdateSchedule
)
from utilities import get_current_user

router = APIRouter(prefix="/job-schedules", tags=["job-schedules"])

@router.get("/", response_model=GetSchedules)
async def get_schedules(
    session: SessionDep,
    page: Annotated[int | None, Query(gt=0)] = None,
    search: Annotated[str | None , Query()] = None
) -> GetSchedules:
    try:
        clean_search = search.strip() if search and search.strip() else None
        base_query = select(JobSchedule)
        # Check Query Params
        if clean_search:
            base_query = base_query.where(JobSchedule.name.ilike(f"%{clean_search}%"))
        # Get The Total Number Of Job Schedules
        f_query = select(func.count()).select_from(base_query)
        f_result = await session.execute(f_query)
        total_schedules = f_result.scalar()
        # Get Job Schedules
        if page:
            base_query = base_query.offset(5 * (page - 1)).limit(5)
        s_query = base_query
        s_result = await session.execute(s_query)
        schedules = s_result.scalars().all()

        return {
            "total_schedules": total_schedules,
            "job_schedules": schedules
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.post("/")
async def create_schedule(
    session: SessionDep,
    data: CreateSchedule,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Create Job Schedule
        schedule = JobSchedule(**data.model_dump())
        session.add(schedule)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Successfully registered schedule"}
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

@router.put("/{schedule_id}")
async def update_schedule(
    session: SessionDep,
    schedule_id: Annotated[int, Path(gt=0)],
    data: UpdateSchedule,
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Job Schedule Exists
        schedule = await session.get(JobSchedule, schedule_id)
        if not schedule:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Schedule does not exists"}
            )
        # Update Job Schedule
        upated_data = data.model_dump(exclude_unset=True)
        for key, value in upated_data.items():
            setattr(schedule, key, value)
        session.add(schedule)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully updated schedule"}
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

@router.delete("/{schedule_id}")
async def remove_software(
    session: SessionDep,
    schedule_id: Annotated[int, Path(gt=0)],
    _: dict = Depends(get_current_user)
) -> JSONResponse:
    try:
        # Check If Job Schedule Exists
        schedule = await session.get(JobSchedule, schedule_id)
        if not schedule:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Schedule does not exists"}
            )
        # Delete Job Schedule
        await session.delete(schedule)
        await session.commit()
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"detail": "Successfully removed schedule"}
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