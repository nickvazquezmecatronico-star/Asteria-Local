from pydantic import BaseModel, Field
from typing import List, Optional
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

class Review(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    business_id: PyObjectId
    user_name: str
    user_email: str
    rating: int = Field(..., ge=1, le=5)  # 1-5 stars
    comment: Optional[str] = ""
    images: List[str] = Field(default_factory=list)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ReviewCreate(BaseModel):
    business_id: str
    user_name: str
    user_email: str
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = ""
    images: List[str] = Field(default_factory=list)

class ReviewResponse(BaseModel):
    id: str
    business_id: str
    user_name: str
    rating: int
    comment: str
    images: List[str]
    is_verified: bool
    created_at: datetime
    
    @classmethod
    def from_mongo(cls, review_doc):
        """Convert MongoDB document to ReviewResponse"""
        if review_doc:
            review_doc["id"] = str(review_doc["_id"])
            review_doc["business_id"] = str(review_doc["business_id"])
            return cls(**review_doc)
        return None