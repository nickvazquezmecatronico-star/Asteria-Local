import { useState, useEffect } from 'react';
import { getCurrentPosition, DEFAULT_COORDINATES } from '../utils/geolocation';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = async (useFallback = true) => {
    setLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      setLocation(position);
      return position;
    } catch (err) {
      setError(err.message);
      
      if (useFallback) {
        // For demo purposes, use Tampico coordinates
        const defaultLocation = {
          ...DEFAULT_COORDINATES,
          accuracy: 100,
          demo: true
        };
        setLocation(defaultLocation);
        return defaultLocation;
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const resetLocation = () => {
    setLocation(null);
    setError(null);
  };

  return {
    location,
    loading,
    error,
    getLocation,
    resetLocation,
    hasLocation: !!location
  };
};

export default useGeolocation;