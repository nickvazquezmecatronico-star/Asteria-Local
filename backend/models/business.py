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
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")
        return field_schema

class Address(BaseModel):
    street: str
    neighborhood: str
    city: str  # Tampico, Madero, Altamira
    coordinates: dict = Field(default_factory=lambda: {"lat": 0.0, "lng": 0.0})

class BusinessHours(BaseModel):
    open: Optional[str] = None
    close: Optional[str] = None
    closed: bool = False

class WeeklyHours(BaseModel):
    monday: BusinessHours = BusinessHours()
    tuesday: BusinessHours = BusinessHours()
    wednesday: BusinessHours = BusinessHours()
    thursday: BusinessHours = BusinessHours()
    friday: BusinessHours = BusinessHours()
    saturday: BusinessHours = BusinessHours()
    sunday: BusinessHours = BusinessHours()

class Business(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: Optional[str] = ""
    category: str
    subcategory: Optional[str] = ""
    
    # Contact & Location
    phone: str
    whatsapp: Optional[str] = ""
    email: Optional[str] = ""
    website: Optional[str] = ""
    address: Address
    
    # Business Info
    images: List[str] = Field(default_factory=list)
    price_range: str = Field(default="$$")  # $, $$, $$$, $$$$
    services: List[str] = Field(default_factory=list)
    hours: WeeklyHours = Field(default_factory=WeeklyHours)
    
    # Ratings & Reviews
    rating_average: float = Field(default=0.0)
    total_reviews: int = Field(default=0)
    
    # Status
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    featured_position: Optional[int] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class BusinessCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    category: str
    subcategory: Optional[str] = ""
    phone: str
    whatsapp: Optional[str] = ""
    email: Optional[str] = ""
    website: Optional[str] = ""
    address: Address
    images: List[str] = Field(default_factory=list)
    price_range: str = Field(default="$$")
    services: List[str] = Field(default_factory=list)

class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    address: Optional[Address] = None
    images: Optional[List[str]] = None
    price_range: Optional[str] = None
    services: Optional[List[str]] = None
    is_active: Optional[bool] = None

class BusinessResponse(BaseModel):
    id: str
    name: str
    description: str
    category: str
    subcategory: str
    phone: str
    whatsapp: str
    email: str
    website: str
    address: Address
    images: List[str]
    price_range: str
    services: List[str]
    rating_average: float
    total_reviews: int
    is_active: bool
    is_verified: bool
    featured_position: Optional[int]
    created_at: datetime
    
    @classmethod
    def from_mongo(cls, business_doc):
        """Convert MongoDB document to BusinessResponse"""
        if business_doc:
            business_doc["id"] = str(business_doc["_id"])
            return cls(**business_doc)
        return None