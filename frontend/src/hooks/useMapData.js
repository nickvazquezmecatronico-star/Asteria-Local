import { useState, useEffect } from 'react';
import { mapAPI, handleApiError } from '../services/api';

export const useMapData = (filters = {}) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMapPins();
  }, [filters.category, filters.city]);

  const fetchMapPins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mapAPI.getPins(filters);
      
      // Transform data to match frontend expectations
      const transformedPins = response.data.map((pin, index) => ({
        id: index + 1,
        category: pin.category,
        lat: pin.lat,
        lng: pin.lng,
        count: pin.count
      }));
      
      setPins(transformedPins);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('Error fetching map pins:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    pins,
    loading,
    error,
    refetch: fetchMapPins
  };
};

export default useMapData;