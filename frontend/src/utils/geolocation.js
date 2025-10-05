/**
 * Geolocation utilities for Asteria Local
 */

// Default coordinates for Tampico area if geolocation fails
export const DEFAULT_COORDINATES = {
  lat: 22.2354,
  lng: -97.8606
};

/**
 * Get user's current position using browser geolocation API
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada en este navegador'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let errorMessage = 'Error obteniendo ubicación';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point  
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number}
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string}
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}km`;
};

/**
 * Check if coordinates are within Tampico metropolitan area
 * @param {number} lat 
 * @param {number} lng 
 * @returns {boolean}
 */
export const isWithinTampicoArea = (lat, lng) => {
  // Tampico metropolitan area boundaries (approximate)
  const bounds = {
    north: 22.35,
    south: 22.15,
    east: -97.75,
    west: -97.95
  };
  
  return lat >= bounds.south && 
         lat <= bounds.north && 
         lng >= bounds.west && 
         lng <= bounds.east;
};

/**
 * Get businesses within a certain radius of a point
 * @param {Array} businesses - Array of businesses with coordinates
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Array} Businesses within radius with distance added
 */
export const getBusinessesWithinRadius = (businesses, userLat, userLng, radiusKm = 10) => {
  return businesses
    .map(business => ({
      ...business,
      distance: calculateDistance(
        userLat, 
        userLng, 
        business.address?.coordinates?.lat || business.lat, 
        business.address?.coordinates?.lng || business.lng
      )
    }))
    .filter(business => business.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};