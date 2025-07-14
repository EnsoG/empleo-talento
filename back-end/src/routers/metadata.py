from fastapi import APIRouter, HTTPException, Query,status
from sqlmodel import select
from typing import Annotated

from config.db import SessionDep
from models.knownledge_level import KnownledgeLevel
from models.language import Language
from models.language_level import LanguageLevel
from models.certification_type import CertificationType
from models.contract_type import ContractType
from models.region import Region
from models.city import City
from models.company_sector import CompanySector
from models.generic_position import GenericPosition
from models.performance_area import PerformanceArea
from models.job_schedule import JobSchedule

router = APIRouter(prefix="/metadata")

@router.get("/")
async def get_metadata(session: SessionDep):
    try:
        # Get Knownledge Levels
        sd_result = await session.execute(select(KnownledgeLevel))
        knownledge_levels = sd_result.scalars().all()
        # Get Languages
        td_result = await session.execute(select(Language))
        languages = td_result.scalars().all()
        # Get Languages Levels
        fe_result = await session.execute(select(LanguageLevel))
        languages_levels = fe_result.scalars().all()
        # Get Certification Types
        sx_result = await session.execute(select(CertificationType))
        certification_types = sx_result.scalars().all()
        # Get Contract Types
        sn_result = await session.execute(select(ContractType))
        contract_types = sn_result.scalars().all()
        # Get Regions
        eh_result = await session.execute(select(Region))
        regions = eh_result.scalars().all()

        return {
            "knownledge_levels": knownledge_levels,
            "languages": languages,
            "language_levels": languages_levels,
            "certification_types": certification_types,
            "contract_types": contract_types,
            "regions": regions
        }
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

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

@router.get("/company-sectors", response_model=list[CompanySector])
async def get_sectors(session: SessionDep) -> list[CompanySector]:
    try:
        query = select(CompanySector)
        result = await session.execute(query)
        sectors = result.scalars().all()

        return sectors
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/generic-positions", response_model=list[GenericPosition])
async def get_generic_positions(session: SessionDep) -> list[GenericPosition]:
    try:
        query = select(GenericPosition)
        result = await session.execute(query)
        positions = result.scalars().all()

        return positions
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )

@router.get("/performance-areas", response_model=list[PerformanceArea])
async def get_performance_areas(session: SessionDep) -> list[PerformanceArea]:
    try:
        query = select(PerformanceArea)
        result = await session.execute(query)
        areas = result.scalars().all()

        return areas
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred on the server"
        )