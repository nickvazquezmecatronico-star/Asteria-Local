from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from services.business_service import BusinessService
from services.category_service import CategoryService
from models.business import BusinessCreate, BusinessUpdate, BusinessResponse
from database import get_database
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/businesses", tags=["businesses"])

def get_business_service(db=Depends(get_database)):
    return BusinessService(db)

def get_category_service(db=Depends(get_database)):
    return CategoryService(db)

@router.get("/", response_model=List[BusinessResponse])
async def get_businesses(
    category: Optional[str] = Query(None, description="Filter by category"),
    city: Optional[str] = Query(None, description="Filter by city"),
    search: Optional[str] = Query(None, description="Search in business names and descriptions"),
    limit: int = Query(20, ge=1, le=100, description="Number of results to return"),
    skip: int = Query(0, ge=0, description="Number of results to skip"),
    business_service: BusinessService = Depends(get_business_service)
):
    """Get businesses with optional filtering and pagination"""
    try:
        businesses = await business_service.get_businesses(
            category=category,
            city=city, 
            search=search,
            limit=limit,
            skip=skip
        )
        return businesses
    except Exception as e:
        logger.error(f"Error getting businesses: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/featured", response_model=List[BusinessResponse])
async def get_featured_businesses(
    limit: int = Query(10, ge=1, le=50, description="Number of featured businesses to return"),
    business_service: BusinessService = Depends(get_business_service)
):
    """Get featured businesses for homepage"""
    try:
        businesses = await business_service.get_featured_businesses(limit=limit)
        return businesses
    except Exception as e:
        logger.error(f"Error getting featured businesses: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{business_id}", response_model=BusinessResponse)
async def get_business(
    business_id: str,
    business_service: BusinessService = Depends(get_business_service)
):
    """Get single business by ID"""
    try:
        business = await business_service.get_business_by_id(business_id)
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        return business
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting business {business_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=BusinessResponse)
async def create_business(
    business_data: BusinessCreate,
    business_service: BusinessService = Depends(get_business_service)
):
    """Create a new business"""
    try:
        business = await business_service.create_business(business_data)
        return business
    except Exception as e:
        logger.error(f"Error creating business: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{business_id}", response_model=BusinessResponse)
async def update_business(
    business_id: str,
    update_data: BusinessUpdate,
    business_service: BusinessService = Depends(get_business_service)
):
    """Update business information"""
    try:
        business = await business_service.update_business(business_id, update_data)
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        return business
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating business {business_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")