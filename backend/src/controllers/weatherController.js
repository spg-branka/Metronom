import { validateWeatherData } from '../middleware/validation.js';
import { AppError } from '../middleware/errorHandler.js';
import { getCachedData, setCachedData } from '../models/weatherData.js';

const ESP32_URL = process.env.ESP32_URL || 'http://localhost:8080';
const ESP32_TIMEOUT_MS = 5000;

/**
 * Fetches current weather data from ESP32 and returns it to frontend
 * Acts as a gateway/proxy with validation, error handling, and 30-second caching
 */
export const getCurrentWeather = async (req, res, next) => {
  try {
    // Check cache first
    const cached = getCachedData();
    if (cached) {
      console.log('✓ Returning cached weather data');
      return res.json({
        success: true,
        data: cached,
        cached: true
      });
    }

    console.log('⟳ Cache expired, fetching fresh data from ESP32...');

    // Fetch data from ESP32 with explicit timeout cancellation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ESP32_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(`${ESP32_URL}/data`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new AppError(`ESP32 returned status ${response.status}`, 502);
    }

    const rawData = await response.json();

    // Validate ESP32 data
    const validation = validateWeatherData(rawData);
    if (!validation.isValid) {
      throw new AppError(`Invalid data from ESP32: ${validation.errors.join('; ')}`, 502);
    }

    // Format and cache the data
    const formattedData = {
      temperature: rawData.temperature,
      humidity: rawData.humidity,
      pressure: rawData.pressure,
      wind_speed: rawData.wind_speed || null,
      wind_direction: rawData.wind_direction || null,
      rainfall: rawData.rainfall || null,
      solar_radiation: rawData.solar_radiation || null,
      uv_index: rawData.uv_index || null,
      timestamp: rawData.timestamp || Math.floor(Date.now() / 1000),
      fetchedAt: new Date().toISOString()
    };

    // Store in cache
    const cachedData = setCachedData(formattedData);

    // Return to frontend
    res.json({
      success: true,
      data: cachedData,
      cached: false
    });
  } catch (error) {
    // Handle fetch errors (ESP32 offline, network issues, etc.)
    if (error.name === 'AbortError') {
      return next(new AppError('ESP32 request timed out', 504));
    }

    // Built-in fetch network failures are usually surfaced as TypeError
    if (error instanceof TypeError || error?.cause?.code === 'ECONNREFUSED') {
      return next(new AppError('ESP32 weather station is unreachable', 503));
    }

    next(error);
  }
};

