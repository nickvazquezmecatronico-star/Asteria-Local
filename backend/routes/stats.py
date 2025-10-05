from fastapi import APIRouter, Depends, HTTPException
from database import get_database
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/stats", tags=["statistics"])

@router.get("/")
async def get_platform_stats(db=Depends(get_database)):
    """Get platform statistics for homepage"""
    try:
        # Count total businesses
        total_businesses = await db.businesses.count_documents({"is_active": True})
        
        # Count total reviews
        total_reviews = await db.reviews.count_documents({})
        
        # Count cities (distinct)
        cities = await db.businesses.distinct("address.city", {"is_active": True})
        total_cities = len(cities)
        
        # Calculate average rating across all businesses
        pipeline = [
            {"$match": {"is_active": True, "total_reviews": {"$gt": 0}}},
            {"$group": {
                "_id": None,
                "avg_platform_rating": {"$avg": "$rating_average"}
            }}
        ]
        
        result = await db.businesses.aggregate(pipeline).to_list(1)
        avg_rating = round(result[0]["avg_platform_rating"], 1) if result else 0.0
        
        return {
            "total_businesses": total_businesses,
            "total_reviews": total_reviews,
            "total_cities": total_cities,
            "average_rating": avg_rating,
            "cities": cities
        }
        
    except Exception as e:
        logger.error(f"Error getting platform stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")