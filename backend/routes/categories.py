from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from services.category_service import CategoryService
from services.business_service import BusinessService
from models.category import CategoryCreate, CategoryResponse
from models.business import BusinessResponse
from database import get_database
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/categories", tags=["categories"])

def get_category_service(db=Depends(get_database)):
    return CategoryService(db)

def get_business_service(db=Depends(get_database)):
    return BusinessService(db)

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    category_service: CategoryService = Depends(get_category_service)
):
    """Get all categories with business counts"""
    try:
        categories = await category_service.get_all_categories()
        return categories
    except Exception as e:
        logger.error(f"Error getting categories: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/popular", response_model=List[CategoryResponse])
async def get_popular_categories(
    limit: int = Query(10, ge=1, le=20, description="Number of popular categories to return"),
    category_service: CategoryService = Depends(get_category_service)
):
    """Get most popular categories by business count"""
    try:
        categories = await category_service.get_popular_categories(limit=limit)
        return categories
    except Exception as e:
        logger.error(f"Error getting popular categories: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{category_slug}", response_model=CategoryResponse)
async def get_category(
    category_slug: str,
    category_service: CategoryService = Depends(get_category_service)
):
    """Get category by slug"""
    try:
        category = await category_service.get_category_by_slug(category_slug)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting category {category_slug}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{category_slug}/businesses", response_model=List[BusinessResponse])
async def get_businesses_by_category(
    category_slug: str,
    limit: int = Query(20, ge=1, le=100, description="Number of businesses to return"),
    business_service: BusinessService = Depends(get_business_service)
):
    """Get businesses in a specific category"""
    try:
        businesses = await business_service.get_businesses_by_category(category_slug, limit=limit)
        return businesses
    except Exception as e:
        logger.error(f"Error getting businesses for category {category_slug}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=CategoryResponse)
async def create_category(
    category_data: CategoryCreate,
    category_service: CategoryService = Depends(get_category_service)
):
    """Create a new category"""
    try:
        category = await category_service.create_category(category_data)
        return category
    except Exception as e:
        logger.error(f"Error creating category: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")