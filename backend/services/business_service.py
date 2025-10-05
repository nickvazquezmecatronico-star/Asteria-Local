from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.business import Business, BusinessCreate, BusinessUpdate, BusinessResponse
from models.review import ReviewResponse
import logging

logger = logging.getLogger(__name__)

class BusinessService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.businesses

    async def create_business(self, business_data: BusinessCreate) -> BusinessResponse:
        """Create a new business"""
        business = Business(**business_data.dict())
        result = await self.collection.insert_one(business.dict(by_alias=True, exclude_unset=True))
        
        # Retrieve the created business
        created_business = await self.collection.find_one({"_id": result.inserted_id})
        return BusinessResponse.from_mongo(created_business)

    async def get_business_by_id(self, business_id: str) -> Optional[BusinessResponse]:
        """Get business by ID"""
        try:
            business = await self.collection.find_one({"_id": ObjectId(business_id)})
            return BusinessResponse.from_mongo(business)
        except Exception as e:
            logger.error(f"Error getting business {business_id}: {e}")
            return None

    async def get_businesses(
        self, 
        category: Optional[str] = None,
        city: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 20,
        skip: int = 0
    ) -> List[BusinessResponse]:
        """Get businesses with filters"""
        
        # Build query
        query = {"is_active": True}
        
        if category:
            query["category"] = category
            
        if city:
            query["address.city"] = city
            
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]

        # Execute query with pagination
        cursor = self.collection.find(query).skip(skip).limit(limit)
        businesses = await cursor.to_list(length=limit)
        
        return [BusinessResponse.from_mongo(business) for business in businesses]

    async def get_featured_businesses(self, limit: int = 10) -> List[BusinessResponse]:
        """Get featured businesses for homepage"""
        
        # Sort by featured_position (ascending, nulls last), then by rating
        pipeline = [
            {"$match": {"is_active": True}},
            {"$addFields": {
                "sort_position": {
                    "$ifNull": ["$featured_position", 9999]
                }
            }},
            {"$sort": {
                "sort_position": 1,
                "rating_average": -1,
                "total_reviews": -1
            }},
            {"$limit": limit}
        ]
        
        cursor = self.collection.aggregate(pipeline)
        businesses = await cursor.to_list(length=limit)
        
        return [BusinessResponse.from_mongo(business) for business in businesses]

    async def get_businesses_by_category(self, category_name: str, limit: int = 100) -> List[BusinessResponse]:
        """Get businesses by category name"""
        
        query = {
            "is_active": True,
            "category": category_name
        }
        
        cursor = self.collection.find(query).sort("rating_average", -1).limit(limit)
        businesses = await cursor.to_list(length=limit)
        
        return [BusinessResponse.from_mongo(business) for business in businesses]

    async def update_business(self, business_id: str, update_data: BusinessUpdate) -> Optional[BusinessResponse]:
        """Update business"""
        try:
            update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
            update_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.update_one(
                {"_id": ObjectId(business_id)}, 
                {"$set": update_dict}
            )
            
            if result.modified_count:
                updated_business = await self.collection.find_one({"_id": ObjectId(business_id)})
                return BusinessResponse.from_mongo(updated_business)
            return None
        except Exception as e:
            logger.error(f"Error updating business {business_id}: {e}")
            return None

    async def update_business_rating(self, business_id: str):
        """Recalculate and update business rating based on reviews"""
        try:
            # Calculate average rating from reviews
            pipeline = [
                {"$match": {"business_id": ObjectId(business_id)}},
                {"$group": {
                    "_id": None,
                    "avg_rating": {"$avg": "$rating"},
                    "total_reviews": {"$sum": 1}
                }}
            ]
            
            result = await self.db.reviews.aggregate(pipeline).to_list(1)
            
            if result:
                avg_rating = round(result[0]["avg_rating"], 1)
                total_reviews = result[0]["total_reviews"]
            else:
                avg_rating = 0.0
                total_reviews = 0

            # Update business
            await self.collection.update_one(
                {"_id": ObjectId(business_id)},
                {"$set": {
                    "rating_average": avg_rating,
                    "total_reviews": total_reviews,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            logger.info(f"Updated rating for business {business_id}: {avg_rating} ({total_reviews} reviews)")
            
        except Exception as e:
            logger.error(f"Error updating business rating {business_id}: {e}")

    async def get_map_pins(self, category: Optional[str] = None, city: Optional[str] = None):
        """Get aggregated map data for pins"""
        
        # Build match stage
        match_stage = {"is_active": True}
        if category:
            match_stage["category"] = category
        if city:
            match_stage["address.city"] = city

        pipeline = [
            {"$match": match_stage},
            {"$group": {
                "_id": {
                    "category": "$category",
                    "neighborhood": "$address.neighborhood",
                    "lat": "$address.coordinates.lat",
                    "lng": "$address.coordinates.lng"
                },
                "count": {"$sum": 1},
                "avg_lat": {"$avg": "$address.coordinates.lat"},
                "avg_lng": {"$avg": "$address.coordinates.lng"}
            }},
            {"$project": {
                "_id": 0,
                "category": "$_id.category",
                "neighborhood": "$_id.neighborhood",
                "lat": "$avg_lat",
                "lng": "$avg_lng",
                "count": 1
            }}
        ]
        
        cursor = self.collection.aggregate(pipeline)
        pins = await cursor.to_list(length=100)
        
        return pins

from datetime import datetime