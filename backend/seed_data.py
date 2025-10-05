import asyncio
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Seed data
categories_data = [
    {
        "name": "Restaurantes",
        "slug": "restaurantes", 
        "icon": "Utensils",
        "description": "Encuentra los mejores restaurantes de la zona",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Farmacias",
        "slug": "farmacias",
        "icon": "Pill", 
        "description": "Farmacias y servicios de salud cercanos",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Ferreterías",
        "slug": "ferreterias",
        "icon": "Wrench",
        "description": "Todo para construcción y reparaciones",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Cafés",
        "slug": "cafes",
        "icon": "Coffee",
        "description": "Los mejores cafés y lugares para trabajar",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Veterinarias",
        "slug": "veterinarias",
        "icon": "Heart",
        "description": "Cuidado profesional para tus mascotas",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Tiendas",
        "slug": "tiendas",
        "icon": "ShoppingBag",
        "description": "Tiendas de conveniencia y retail",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Talleres",
        "slug": "talleres",
        "icon": "Car",
        "description": "Talleres mecánicos y servicios automotrices",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Salones",
        "slug": "salones",
        "icon": "Scissors",
        "description": "Salones de belleza y estética",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Educación",
        "slug": "educacion",
        "icon": "GraduationCap",
        "description": "Centros educativos y academias",
        "is_active": True,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Inmobiliaria",
        "slug": "inmobiliaria",
        "icon": "Home",
        "description": "Servicios inmobiliarios y bienes raíces",
        "is_active": True,
        "created_at": datetime.utcnow()
    }
]

businesses_data = [
    {
        "name": "Restaurante El Huasteco",
        "description": "Auténtica comida tradicional tamaulipeca con más de 30 años de experiencia. Especialistas en cabrito, carne asada y mariscos frescos.",
        "category": "Restaurantes",
        "subcategory": "Comida Mexicana",
        "phone": "+52 833 123 4567",
        "whatsapp": "+52 833 123 4567",
        "email": "contacto@elhuasteco.com",
        "website": "www.elhuasteco.com",
        "address": {
            "street": "Av. Universidad #234",
            "neighborhood": "Centro",
            "city": "Tampico",
            "coordinates": {"lat": 22.2354, "lng": -97.8606}
        },
        "images": ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop&crop=center"],
        "price_range": "$$$",
        "services": ["Delivery", "Pet Friendly", "Estacionamiento"],
        "rating_average": 4.8,
        "total_reviews": 324,
        "is_active": True,
        "is_verified": True,
        "featured_position": 1,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "name": "Café Madero",
        "description": "Coffee shop especializado en café de altura con ambiente acogedor para trabajar y relajarse. WiFi gratuito y terraza al aire libre.",
        "category": "Cafés",
        "subcategory": "Coffee Shop",
        "phone": "+52 833 234 5678",
        "whatsapp": "+52 833 234 5678",
        "email": "hola@cafemadero.com",
        "website": "",
        "address": {
            "street": "Calle Madero #156",
            "neighborhood": "Zona Dorada",
            "city": "Tampico",
            "coordinates": {"lat": 22.2486, "lng": -97.8642}
        },
        "images": ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop&crop=center"],
        "price_range": "$$",
        "services": ["WiFi", "Terraza", "Postres"],
        "rating_average": 4.7,
        "total_reviews": 198,
        "is_active": True,
        "is_verified": True,
        "featured_position": 2,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "name": "Farmacia San Rafael",
        "description": "Farmacia con servicio 24 horas y delivery gratuito. Amplio surtido en medicamentos y productos de cuidado personal.",
        "category": "Farmacias",
        "subcategory": "Farmacia General",
        "phone": "+52 833 345 6789",
        "whatsapp": "+52 833 345 6789",
        "email": "info@farmaciasanrafael.com",
        "website": "",
        "address": {
            "street": "Boulevard Altamira #789",
            "neighborhood": "Las Flores",
            "city": "Altamira",
            "coordinates": {"lat": 22.2567, "lng": -97.8532}
        },
        "images": ["https://images.unsplash.com/photo-1576671081837-49000212a370?w=300&h=200&fit=crop&crop=center"],
        "price_range": "$",
        "services": ["24 Horas", "Delivery", "Consulta"],
        "rating_average": 4.6,
        "total_reviews": 156,
        "is_active": True,
        "is_verified": True,
        "featured_position": 3,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "name": "Veterinaria Pets Care",
        "description": "Clínica veterinaria con servicios completos: consultas, cirugías, urgencias 24hrs, estética canina y hotel para mascotas.",
        "category": "Veterinarias",
        "subcategory": "Clínica Veterinaria",
        "phone": "+52 833 456 7890",
        "whatsapp": "+52 833 456 7890",
        "email": "citas@petscare.com",
        "website": "www.petscare.com",
        "address": {
            "street": "Av. Unidad Nacional #456",
            "neighborhood": "Unidad Nacional",
            "city": "Ciudad Madero",
            "coordinates": {"lat": 22.2412, "lng": -97.8567}
        },
        "images": ["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop&crop=center"],
        "price_range": "$$",
        "services": ["Urgencias", "Estética", "Hotel", "Cirugías"],
        "rating_average": 4.9,
        "total_reviews": 87,
        "is_active": True,
        "is_verified": True,
        "featured_position": 4,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "name": "Ferretería El Martillo",
        "description": "Ferretería completa con más de 25 años en el mercado. Herramientas, materiales de construcción y asesoría especializada.",
        "category": "Ferreterías",
        "subcategory": "Ferretería General",
        "phone": "+52 833 567 8901",
        "whatsapp": "+52 833 567 8901",
        "email": "ventas@elmartillo.com",
        "website": "",
        "address": {
            "street": "Calle Escolleras #321",
            "neighborhood": "Escolleras",
            "city": "Tampico",
            "coordinates": {"lat": 22.2298, "lng": -97.8734}
        },
        "images": ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center"],
        "price_range": "$$",
        "services": ["Entrega", "Asesoría", "Crédito"],
        "rating_average": 4.5,
        "total_reviews": 203,
        "is_active": True,
        "is_verified": True,
        "featured_position": 5,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    # Negocios adicionales sin featured position
    {
        "name": "Taller Automotriz López",
        "description": "Taller mecánico especializado en transmisiones automáticas, frenos y servicio general. 15 años de experiencia.",
        "category": "Talleres",
        "subcategory": "Mecánica General",
        "phone": "+52 833 678 9012",
        "whatsapp": "+52 833 678 9012",
        "email": "",
        "website": "",
        "address": {
            "street": "Av. Industrial #567",
            "neighborhood": "Industrial",
            "city": "Altamira",
            "coordinates": {"lat": 22.2445, "lng": -97.8456}
        },
        "images": ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop&crop=center"],
        "price_range": "$$",
        "services": ["Diagnóstico", "Garantía", "Refacciones"],
        "rating_average": 4.3,
        "total_reviews": 142,
        "is_active": True,
        "is_verified": False,
        "featured_position": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "name": "Salón Belleza Total",
        "description": "Salón de belleza integral: cortes, peinados, coloración, tratamientos capilares, manicure y pedicure. Ambiente relajante.",
        "category": "Salones",
        "subcategory": "Salón de Belleza",
        "phone": "+52 833 789 0123",
        "whatsapp": "+52 833 789 0123",
        "email": "citas@bellezatotal.com",
        "website": "",
        "address": {
            "street": "Calle Hidalgo #890",
            "neighborhood": "Centro",
            "city": "Ciudad Madero",
            "coordinates": {"lat": 22.2578, "lng": -97.8623}
        },
        "images": ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop&crop=center"],
        "price_range": "$$",
        "services": ["Cortes", "Color", "Manicure", "Tratamientos"],
        "rating_average": 4.4,
        "total_reviews": 98,
        "is_active": True,
        "is_verified": True,
        "featured_position": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "name": "Pizzería Don Giuseppe",
        "description": "Auténtica pizza italiana con ingredientes importados. Horno de leña y ambiente familiar. También pasta fresca y ensaladas.",
        "category": "Restaurantes",
        "subcategory": "Pizza Italiana",
        "phone": "+52 833 890 1234",
        "whatsapp": "+52 833 890 1234",
        "email": "ordenes@dongiuseppe.com",
        "website": "",
        "address": {
            "street": "Av. Ejército Mexicano #234",
            "neighborhood": "Estadio",
            "city": "Tampico",
            "coordinates": {"lat": 22.2389, "lng": -97.8512}
        },
        "images": ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop&crop=center"],
        "price_range": "$$$",
        "services": ["Delivery", "Para Llevar", "Terraza"],
        "rating_average": 4.6,
        "total_reviews": 267,
        "is_active": True,
        "is_verified": True,
        "featured_position": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

reviews_data = [
    # Reviews para El Huasteco
    {
        "business_id": None,  # Will be set after business creation
        "user_name": "María González",
        "user_email": "maria.g@email.com",
        "rating": 5,
        "comment": "Excelente comida tradicional, el cabrito está delicioso y el servicio es muy bueno. Definitivamente regresaré.",
        "images": [],
        "is_verified": True,
        "created_at": datetime.utcnow()
    },
    {
        "business_id": None,
        "user_name": "Carlos Méndez", 
        "user_email": "carlos.m@email.com",
        "rating": 5,
        "comment": "El mejor restaurante de comida regional en Tampico. Los precios son justos y las porciones generosas.",
        "images": [],
        "is_verified": True,
        "created_at": datetime.utcnow()
    }
]

async def seed_database():
    """Seed the database with initial data"""
    try:
        print("🌱 Starting database seeding...")
        
        # Clear existing data
        await db.categories.delete_many({})
        await db.businesses.delete_many({})
        await db.reviews.delete_many({})
        print("🗑️ Cleared existing data")
        
        # Insert categories
        if categories_data:
            result = await db.categories.insert_many(categories_data)
            print(f"✅ Inserted {len(result.inserted_ids)} categories")
        
        # Insert businesses
        if businesses_data:
            result = await db.businesses.insert_many(businesses_data)
            business_ids = result.inserted_ids
            print(f"✅ Inserted {len(business_ids)} businesses")
            
            # Insert sample reviews for first business
            if reviews_data and business_ids:
                for review in reviews_data:
                    review["business_id"] = business_ids[0]  # El Huasteco
                
                await db.reviews.insert_many(reviews_data)
                print(f"✅ Inserted {len(reviews_data)} reviews")
        
        # Update category business counts
        categories = await db.categories.find({}).to_list(length=100)
        for category in categories:
            count = await db.businesses.count_documents({
                "category": category["name"], 
                "is_active": True
            })
            await db.categories.update_one(
                {"_id": category["_id"]},
                {"$set": {"business_count": count}}
            )
        
        print("✅ Updated category business counts")
        print("🎉 Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())