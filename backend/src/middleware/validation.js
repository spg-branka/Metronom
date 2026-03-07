export const validateWeatherData = (data) => {
  const errors = [];

  // Required fields
  const requiredFields = ['temperature', 'wind_speed', 'humidity', 'pressure'];
  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate types and ranges
  if (typeof data.temperature !== 'number') {
    errors.push('Temperature must be a number');
  } else if (data.temperature < -20 || data.temperature > 45) {
    errors.push('Temperature out of range (-20 to 45°C)');
  }

  if (typeof data.humidity !== 'number') {
    errors.push('Humidity must be a number');
  } else if (data.humidity < 0 || data.humidity > 100) {
    errors.push('Humidity must be between 0 and 100');
  }

  if (typeof data.pressure !== 'number') {
    errors.push('Pressure must be a number');
  } else if (data.pressure < 960 || data.pressure > 1070) {
    errors.push('Pressure out of range (960 to 1070 hPa)');
  }

  if (typeof data.wind_speed !== 'number') {
    errors.push('Wind speed must be a number');
  } else if (data.wind_speed < 0 || data.wind_speed > 150) {
    errors.push('Wind speed out of range (0 to 150 km/h)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
