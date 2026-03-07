import {
  setCurrentWeatherData,
  getCurrentWeatherData
} from '../models/weatherData.js';
import { validateWeatherData } from '../middleware/validation.js';
import { AppError } from '../middleware/errorHandler.js';

export const receiveWeatherData = (req, res, next) => {
  try {
    const data = req.body;

    // Validate incoming data
    const validation = validateWeatherData(data);
    if (!validation.isValid) {
      throw new AppError(validation.errors.join('; '), 400);
    }

    // Store only the latest record
    const record = setCurrentWeatherData(data);

    res.status(201).json({
      success: true,
      message: 'Weather data received successfully',
      data: {
        id: record.id,
        receivedAt: new Date(record.receivedAt * 1000).toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentWeather = (req, res, next) => {
  try {
    const data = getCurrentWeatherData();

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'No weather data available yet',
        message: 'Please wait for ESP32 to send data'
      });
    }

    res.json({
      success: true,
      data: {
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure,
        wind_speed: data.wind_speed || null,
        wind_direction: data.wind_direction || null,
        rainfall: data.rainfall || null,
        solar_radiation: data.solar_radiation || null,
        uv_index: data.uv_index || null,
        timestamp: data.timestamp,
        receivedAt: new Date(data.receivedAt * 1000).toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

