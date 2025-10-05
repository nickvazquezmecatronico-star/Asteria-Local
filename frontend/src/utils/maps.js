/**
 * Maps and location utilities for Asteria Local
 */

/**
 * Open location in Google Maps
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude  
 * @param {string} name - Location name (optional)
 */
export const openInGoogleMaps = (lat, lng, name = '') => {
  const baseUrl = 'https://www.google.com/maps';
  
  if (name) {
    // If we have a name, search for it
    const searchQuery = encodeURIComponent(name);
    const url = `${baseUrl}/search/${searchQuery}/@${lat},${lng},15z`;
    window.open(url, '_blank');
  } else {
    // Just open coordinates
    const url = `${baseUrl}/@${lat},${lng},15z`;
    window.open(url, '_blank');
  }
};

/**
 * Get directions to a location
 * @param {number} destLat - Destination latitude
 * @param {number} destLng - Destination longitude
 * @param {string} destName - Destination name (optional)
 * @param {object} origin - Origin coordinates (optional)
 */
export const getDirections = (destLat, destLng, destName = '', origin = null) => {
  let url = 'https://www.google.com/maps/dir/';
  
  if (origin) {
    // From specific origin
    url += `${origin.lat},${origin.lng}/`;
  } else {
    // From current location (Google Maps will ask for permission)
    url += 'Current+Location/';
  }
  
  if (destName) {
    const encodedName = encodeURIComponent(destName);
    url += `${encodedName}/@${destLat},${destLng}`;
  } else {
    url += `${destLat},${destLng}`;
  }
  
  window.open(url, '_blank');
};

/**
 * Share location using Web Share API or fallback to copy
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} name - Location name
 * @param {string} address - Location address (optional)
 */
export const shareLocation = async (lat, lng, name, address = '') => {
  const googleMapsUrl = `https://www.google.com/maps/@${lat},${lng},15z`;
  const shareText = `📍 ${name}${address ? `\n${address}` : ''}\n${googleMapsUrl}`;
  
  // Try Web Share API first (mobile devices)
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Ubicación: ${name}`,
        text: shareText,
        url: googleMapsUrl
      });
      return { success: true, method: 'native' };
    } catch (error) {
      // User cancelled or error occurred, fall back to clipboard
    }
  }
  
  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(shareText);
    return { success: true, method: 'clipboard' };
  } catch (error) {
    // Clipboard API failed, try legacy method
    const textArea = document.createElement('textarea');
    textArea.value = shareText;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: true, method: 'legacy' };
    } catch (legacyError) {
      document.body.removeChild(textArea);
      return { success: false, error: 'No se pudo compartir la ubicación' };
    }
  }
};

/**
 * Calculate estimated travel time (basic estimation)
 * @param {number} distance - Distance in kilometers
 * @param {string} mode - Transport mode: 'driving', 'walking', 'transit'
 * @returns {string} Estimated time
 */
export const estimateTime = (distance, mode = 'driving') => {
  const speeds = {
    driving: 40, // km/h average city speed
    walking: 5,  // km/h average walking speed
    transit: 25  // km/h average public transport
  };
  
  const speed = speeds[mode] || speeds.driving;
  const timeHours = distance / speed;
  const timeMinutes = Math.round(timeHours * 60);
  
  if (timeMinutes < 60) {
    return `${timeMinutes} min`;
  } else {
    const hours = Math.floor(timeMinutes / 60);
    const minutes = timeMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
};

/**
 * Get area boundaries for Tampico metropolitan area
 * @returns {object} Boundaries object
 */
export const getTampicoAreaBounds = () => {
  return {
    north: 22.35,
    south: 22.15,
    east: -97.75,
    west: -97.95,
    center: { lat: 22.25, lng: -97.85 }
  };
};

/**
 * Format coordinates for display
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (lat, lng) => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

/**
 * Open location in different map apps
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} name - Location name
 * @param {string} app - App preference: 'google', 'apple', 'waze'
 */
export const openInMapApp = (lat, lng, name = '', app = 'google') => {
  const encodedName = encodeURIComponent(name);
  
  switch (app) {
    case 'apple':
      // Apple Maps (iOS)
      const appleUrl = `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}`;
      window.open(appleUrl);
      break;
      
    case 'waze':
      // Waze
      const wazeUrl = `waze://ul?ll=${lat},${lng}&q=${encodedName}`;
      window.open(wazeUrl);
      break;
      
    case 'google':
    default:
      // Google Maps (default)
      openInGoogleMaps(lat, lng, name);
      break;
  }
};