import express from 'express';
import {
  receiveWeatherData,
  getCurrentWeather
} from '../controllers/weatherController.js';

const router = express.Router();

/**
 * POST /api/weather/data
 * Receives weather data from ESP32
 * Body: { temperature, humidity, pressure, ... }
 */
router.post('/data', receiveWeatherData);

/**
 * GET /api/weather/current
 * Returns the latest weather data
 */
router.get('/current', getCurrentWeather);

export default router;
