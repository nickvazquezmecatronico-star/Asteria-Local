from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

def get_database():
    """Dependency to get database connection"""
    return db

async def init_database():
    """Initialize database with indexes and seed data"""
    try:
        # Create indexes for better performance
        
        # Businesses collection indexes
        await db.businesses.create_index([("category", 1), ("is_active", 1)])
        await db.businesses.create_index([("address.city", 1), ("is_active", 1)])
        await db.businesses.create_index([("rating_average", -1), ("total_reviews", -1)])
        await db.businesses.create_index([("featured_position", 1)])
        await db.businesses.create_index([("name", "text"), ("description", "text")])
        
        # Categories collection indexes
        await db.categories.create_index([("slug", 1)], unique=True)
        await db.categories.create_index([("is_active", 1)])
        
        # Reviews collection indexes
        await db.reviews.create_index([("business_id", 1)])
        await db.reviews.create_index([("created_at", -1)])
        
        print("✅ Database indexes created successfully")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")

async def close_database():
    """Close database connection"""
    client.close()