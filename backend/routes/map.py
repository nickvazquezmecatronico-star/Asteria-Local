from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from services.business_service import BusinessService
from database import get_database
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/map", tags=["map"])

def get_business_service(db=Depends(get_database)):
    return BusinessService(db)

@router.get("/pins")
async def get_map_pins(
    category: Optional[str] = Query(None, description="Filter by category"),
    city: Optional[str] = Query(None, description="Filter by city"),
    business_service: BusinessService = Depends(get_business_service)
):
    """Get aggregated map pins data for visualization"""
    try:
        pins = await business_service.get_map_pins(category=category, city=city)
        return pins
    except Exception as e:
        logger.error(f"Error getting map pins: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")