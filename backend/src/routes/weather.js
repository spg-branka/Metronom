import express from 'express';
import {
  getCurrentWeather
} from '../controllers/weatherController.js';

const router = express.Router();

/**
 * GET /api/weather/current
 * Fetches current weather data from ESP32
 * Backend acts as gateway with validation and error handling
 */
router.get('/current', getCurrentWeather);

export default router;
