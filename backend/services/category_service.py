from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.category import Category, CategoryCreate, CategoryResponse
import logging

logger = logging.getLogger(__name__)

class CategoryService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.categories

    async def create_category(self, category_data: CategoryCreate) -> CategoryResponse:
        """Create a new category"""
        category = Category(**category_data.dict())
        result = await self.collection.insert_one(category.dict(by_alias=True, exclude_unset=True))
        
        # Retrieve the created category
        created_category = await self.collection.find_one({"_id": result.inserted_id})
        return CategoryResponse.from_mongo(created_category)

    async def get_all_categories(self) -> List[CategoryResponse]:
        """Get all active categories with business counts"""
        
        # Aggregate to get business counts
        pipeline = [
            {"$match": {"is_active": True}},
            {"$lookup": {
                "from": "businesses",
                "let": {"category_name": "$name"},
                "pipeline": [
                    {"$match": {
                        "$expr": {"$eq": ["$category", "$$category_name"]},
                        "is_active": True
                    }},
                    {"$count": "count"}
                ],
                "as": "business_counts"
            }},
            {"$addFields": {
                "business_count": {
                    "$ifNull": [{"$arrayElemAt": ["$business_counts.count", 0]}, 0]
                }
            }},
            {"$project": {
                "business_counts": 0
            }},
            {"$sort": {"name": 1}}
        ]
        
        cursor = self.collection.aggregate(pipeline)
        categories = await cursor.to_list(length=100)
        
        return [CategoryResponse.from_mongo(category) for category in categories]

    async def get_category_by_slug(self, slug: str) -> Optional[CategoryResponse]:
        """Get category by slug"""
        category = await self.collection.find_one({"slug": slug, "is_active": True})
        return CategoryResponse.from_mongo(category)

    async def update_category_counts(self):
        """Update business counts for all categories"""
        try:
            categories = await self.collection.find({"is_active": True}).to_list(length=100)
            
            for category in categories:
                # Count businesses in this category
                business_count = await self.db.businesses.count_documents({
                    "category": category["name"],
                    "is_active": True
                })
                
                # Update the category
                await self.collection.update_one(
                    {"_id": category["_id"]},
                    {"$set": {"business_count": business_count}}
                )
                
            logger.info("Updated business counts for all categories")
            
        except Exception as e:
            logger.error(f"Error updating category counts: {e}")

    async def get_popular_categories(self, limit: int = 10) -> List[CategoryResponse]:
        """Get most popular categories by business count"""
        
        pipeline = [
            {"$match": {"is_active": True}},
            {"$lookup": {
                "from": "businesses",
                "let": {"category_name": "$name"},
                "pipeline": [
                    {"$match": {
                        "$expr": {"$eq": ["$category", "$$category_name"]},
                        "is_active": True
                    }},
                    {"$count": "count"}
                ],
                "as": "business_counts"
            }},
            {"$addFields": {
                "business_count": {
                    "$ifNull": [{"$arrayElemAt": ["$business_counts.count", 0]}, 0]
                }
            }},
            {"$project": {
                "business_counts": 0
            }},
            {"$sort": {"business_count": -1}},
            {"$limit": limit}
        ]
        
        cursor = self.collection.aggregate(pipeline)
        categories = await cursor.to_list(length=limit)
        
        return [CategoryResponse.from_mongo(category) for category in categories]