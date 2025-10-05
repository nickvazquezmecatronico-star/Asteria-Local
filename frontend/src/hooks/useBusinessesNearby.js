import { useState, useEffect } from 'react';
import { businessesAPI, handleApiError } from '../services/api';
import { getBusinessesWithinRadius } from '../utils/geolocation';

export const useBusinessesNearby = (userLocation, radiusKm = 10) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyBusinesses();
    }
  }, [userLocation, radiusKm]);

  const fetchNearbyBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all businesses (we could optimize this with a backend endpoint for nearby businesses)
      const response = await businessesAPI.getAll({ limit: 100 });
      
      // Calculate distances and filter by radius
      const businessesWithDistance = getBusinessesWithinRadius(
        response.data,
        userLocation.lat,
        userLocation.lng,
        radiusKm
      );
      
      setBusinesses(businessesWithDistance);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('Error fetching nearby businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchNearbyBusinesses();
  };

  return {
    businesses,
    loading,
    error,
    refetch,
    total: businesses.length
  };
};

export default useBusinessesNearby;