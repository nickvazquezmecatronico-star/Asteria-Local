from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Category(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    slug: str
    icon: str  # Lucide icon name
    description: Optional[str] = ""
    business_count: int = Field(default=0)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CategoryCreate(BaseModel):
    name: str
    slug: str
    icon: str
    description: Optional[str] = ""

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    icon: str
    description: str
    business_count: int
    is_active: bool
    
    @classmethod
    def from_mongo(cls, category_doc):
        """Convert MongoDB document to CategoryResponse"""
        if category_doc:
            category_doc["id"] = str(category_doc["_id"])
            return cls(**category_doc)
        return None