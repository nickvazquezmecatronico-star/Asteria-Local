import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API response error:', error);
    return Promise.reject(error);
  }
);

// Business API
export const businessesAPI = {
  getFeatured: (limit = 10) => 
    apiClient.get(`/businesses/featured?limit=${limit}`),
  
  getAll: (params = {}) => 
    apiClient.get('/businesses/', { params }),
  
  getById: (businessId) => 
    apiClient.get(`/businesses/${businessId}`),
  
  getByCategory: (categorySlug, limit = 20) => 
    apiClient.get(`/categories/${categorySlug}/businesses?limit=${limit}`),
  
  search: (searchTerm, filters = {}) => 
    apiClient.get('/businesses/', { 
      params: { search: searchTerm, ...filters } 
    }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => 
    apiClient.get('/categories/'),
  
  getPopular: (limit = 10) => 
    apiClient.get(`/categories/popular?limit=${limit}`),
  
  getBySlug: (slug) => 
    apiClient.get(`/categories/${slug}`),
};

// Map API
export const mapAPI = {
  getPins: (filters = {}) => 
    apiClient.get('/map/pins', { params: filters }),
};

// Statistics API
export const statsAPI = {
  getPlatformStats: () => 
    apiClient.get('/stats/'),
};

// Reviews API (for future use)
export const reviewsAPI = {
  getByBusiness: (businessId) => 
    apiClient.get(`/businesses/${businessId}/reviews`),
  
  create: (businessId, reviewData) => 
    apiClient.post(`/businesses/${businessId}/reviews`, reviewData),
};

// Generic error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.status, error.response.data);
    return {
      message: error.response.data?.detail || 'Error del servidor',
      status: error.response.status
    };
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network Error:', error.request);
    return {
      message: 'Error de conexión. Verifica tu internet.',
      status: 0
    };
  } else {
    // Something else happened
    console.error('Request Error:', error.message);
    return {
      message: 'Error inesperado',
      status: -1
    };
  }
};

export default apiClient;