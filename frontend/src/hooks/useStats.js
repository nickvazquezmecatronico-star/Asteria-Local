import { useState, useEffect } from 'react';
import { statsAPI, handleApiError } from '../services/api';

export const usePlatformStats = () => {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalReviews: 0,
    totalCities: 0,
    averageRating: 0,
    cities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await statsAPI.getPlatformStats();
      
      // Transform data to match frontend expectations
      setStats({
        totalBusinesses: response.data.total_businesses,
        totalReviews: response.data.total_reviews,
        totalCities: response.data.total_cities,
        averageRating: response.data.average_rating,
        cities: response.data.cities
      });
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('Error fetching platform stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

export default usePlatformStats;