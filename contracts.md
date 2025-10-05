# Asteria Local - Backend Implementation Contracts

## 📋 API Contracts & Integration Plan

### 🎯 Current Frontend Mock Data (to be replaced)

**File: `/app/frontend/src/data/mockData.js`**

#### Categories Data
```javascript
categories = [
  { id, name, icon, count }
]
```

#### Top Businesses Data
```javascript
topBusinesses = [
  {
    id, name, rating, reviews, category, neighborhood, 
    image, price, services, phone, position, medal
  }
]
```

#### Map Pins Data
```javascript
mapPins = [
  { id, category, lat, lng, count }
]
```

---

## 🗄️ MongoDB Models & Collections

### 1. **businesses** Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  subcategory: String,
  
  // Contact & Location
  phone: String,
  whatsapp: String,
  email: String,
  website: String,
  address: {
    street: String,
    neighborhood: String,
    city: String, // Tampico, Madero, Altamira
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Business Info
  images: [String], // URLs
  price_range: String, // $, $$, $$$, $$$$
  services: [String], // ["Delivery", "Pet Friendly", "24 Horas"]
  hours: {
    monday: { open: String, close: String, closed: Boolean },
    // ... for each day
  },
  
  // Ratings & Reviews
  rating_average: Number, // calculated field
  total_reviews: Number,
  
  // Status
  is_active: Boolean,
  is_verified: Boolean,
  featured_position: Number, // for top rankings
  
  // Timestamps
  created_at: Date,
  updated_at: Date
}
```

### 2. **categories** Collection
```javascript
{
  _id: ObjectId,
  name: String, // "Restaurantes"
  slug: String, // "restaurantes" 
  icon: String, // Lucide icon name
  description: String,
  business_count: Number, // calculated field
  is_active: Boolean
}
```

### 3. **reviews** Collection
```javascript
{
  _id: ObjectId,
  business_id: ObjectId,
  user_name: String,
  user_email: String,
  rating: Number, // 1-5
  comment: String,
  images: [String],
  is_verified: Boolean,
  created_at: Date
}
```

### 4. **users** Collection (Future - Basic structure)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  role: String, // "user", "business_owner", "admin"
  created_at: Date
}
```

---

## 🔧 FastAPI Endpoints

### Base URL: `/api`

#### 🏢 **Business Endpoints**

**GET `/api/businesses`**
- Query params: `?category=&city=&limit=&skip=&search=`
- Returns: List of businesses with pagination
- Frontend usage: Replace `topBusinesses` mock data

**GET `/api/businesses/featured`**
- Returns: Top rated businesses for homepage
- Frontend usage: "Top de la semana" section

**GET `/api/businesses/{business_id}`**
- Returns: Single business with full details
- Frontend usage: Business detail modals/pages

**POST `/api/businesses`** (Future)
- Creates new business listing
- Frontend usage: "Registrar negocio" form

#### 📂 **Category Endpoints**

**GET `/api/categories`**
- Returns: All categories with business counts
- Frontend usage: Replace `categories` mock data

**GET `/api/categories/{category_slug}/businesses`**
- Returns: Businesses in specific category
- Frontend usage: Category filtering

#### 🗺️ **Map Endpoints**

**GET `/api/map/pins`**
- Query params: `?category=&city=`
- Returns: Aggregated location data for map
- Frontend usage: Replace `mapPins` mock data

#### 📊 **Statistics Endpoints**

**GET `/api/stats`**
- Returns: Platform statistics (total businesses, reviews, cities)
- Frontend usage: Hero section statistics

#### ⭐ **Review Endpoints**

**GET `/api/businesses/{business_id}/reviews`**
- Returns: Reviews for specific business
- Frontend usage: Business detail reviews

**POST `/api/businesses/{business_id}/reviews`** (Future)
- Creates new review
- Frontend usage: Review submission forms

---

## 🔗 Frontend Integration Plan

### Files to Update:

#### 1. **Remove Mock Data**
- Delete `/app/frontend/src/data/mockData.js`
- Replace with API calls using axios

#### 2. **Create API Service**
```javascript
// /app/frontend/src/services/api.js
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export const businessesAPI = {
  getFeatured: () => axios.get(`${API_BASE}/businesses/featured`),
  getByCategory: (category) => axios.get(`${API_BASE}/categories/${category}/businesses`),
  // ... more methods
};

export const categoriesAPI = {
  getAll: () => axios.get(`${API_BASE}/categories`),
};

export const mapAPI = {
  getPins: (filters) => axios.get(`${API_BASE}/map/pins`, { params: filters }),
};
```

#### 3. **Update Components**
- `Categories.js`: Use `categoriesAPI.getAll()`
- `TopBusinesses.js`: Use `businessesAPI.getFeatured()`
- `MapView.js`: Use `mapAPI.getPins()`
- `Hero.js`: Use statistics API for numbers

#### 4. **Add Loading States**
- Skeleton components for loading
- Error handling for failed requests
- Retry mechanisms

---

## 📈 Business Logic

### Rating Calculation
- Recalculate `rating_average` when reviews are added
- Update `total_reviews` count
- Cache calculations for performance

### Search Functionality
- Text search in business names and descriptions
- Category filtering
- Location-based filtering (city/neighborhood)
- Price range filtering

### Featured Business Logic
- Algorithm to determine "Top de la semana"
- Based on: recent reviews, rating, activity
- Manual featured positioning for premium businesses

---

## 🚀 Implementation Order

1. **MongoDB Models** - Define schemas and collections
2. **Basic CRUD Endpoints** - Businesses and categories
3. **Data Migration** - Convert mock data to database
4. **Frontend Integration** - Replace mock with API calls
5. **Advanced Features** - Search, filtering, map integration
6. **Testing & Optimization** - Performance and reliability

---

## 🌟 Future Enhancements

- User authentication & profiles  
- Business owner dashboard
- Review moderation system
- Photo uploads & management
- Push notifications
- Advanced analytics
- Premium business listings
- Multi-city expansion system