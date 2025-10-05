import { useState, useEffect } from 'react';
import { businessesAPI, handleApiError } from '../services/api';

export const useFeaturedBusinesses = (limit = 10) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedBusinesses();
  }, [limit]);

  const fetchFeaturedBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await businessesAPI.getFeatured(limit);
      
      // Transform data to match frontend expectations
      const transformedBusinesses = response.data.map((business, index) => ({
        id: business.id,
        name: business.name,
        rating: business.rating_average,
        reviews: business.total_reviews,
        category: business.category,
        neighborhood: business.address.neighborhood,
        image: business.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop&crop=center',
        price: business.price_range,
        services: business.services,
        phone: business.phone,
        position: business.featured_position || index + 1,
        medal: business.featured_position === 1 ? '🥇' : 
               business.featured_position === 2 ? '🥈' : 
               business.featured_position === 3 ? '🥉' : ''
      }));
      
      setBusinesses(transformedBusinesses);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('Error fetching featured businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    businesses,
    loading,
    error,
    refetch: fetchFeaturedBusinesses
  };
};

export const useBusinessSearch = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (searchTerm, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await businessesAPI.search(searchTerm, filters);
      
      const transformedBusinesses = response.data.map(business => ({
        id: business.id,
        name: business.name,
        rating: business.rating_average,
        reviews: business.total_reviews,
        category: business.category,
        neighborhood: business.address.neighborhood,
        image: business.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop&crop=center',
        price: business.price_range,
        services: business.services,
        phone: business.phone
      }));
      
      setBusinesses(transformedBusinesses);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('Error searching businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    businesses,
    loading,
    error,
    search
  };
};

export default { useFeaturedBusinesses, useBusinessSearch };