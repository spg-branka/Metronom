/**
 * Weather Data Cache
 * 
 * Caches data from ESP32 for 30 seconds to reduce load on ESP32
 * and improve response times when multiple users access the site
 */

const CACHE_DURATION = 30 * 1000; // 30 seconds in milliseconds

let cachedData = null;
let cacheTimestamp = null;

/**
 * Check if cached data is still valid
 */
export const isCacheValid = () => {
  if (!cachedData || !cacheTimestamp) {
    return false;
  }
  
  const now = Date.now();
  const age = now - cacheTimestamp;
  
  return age < CACHE_DURATION;
};

/**
 * Get cached weather data if valid, otherwise returns null
 */
export const getCachedData = () => {
  if (isCacheValid()) {
    return cachedData;
  }
  return null;
};

/**
 * Store fresh weather data in cache
 */
export const setCachedData = (data) => {
  cachedData = {
    ...data,
    cachedAt: new Date().toISOString()
  };
  cacheTimestamp = Date.now();
  return cachedData;
};

/**
 * Clear the cache (useful for testing or manual refresh)
 */
export const clearCache = () => {
  cachedData = null;
  cacheTimestamp = null;
};
