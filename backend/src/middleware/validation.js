const pickFirstDefined = (data, keys) => {
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null) {
      return data[key];
    }
  }

  return undefined;
};

const toFiniteNumber = value => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const normalizeTimestamp = value => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const numeric = toFiniteNumber(value);
  if (numeric !== undefined) {
    return Math.floor(numeric);
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const compactUtcPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  const normalizedString = compactUtcPattern.test(value) ? value.replace(' ', 'T') + 'Z' : value;
  const parsed = Date.parse(normalizedString);

  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return Math.floor(parsed / 1000);
};

export const normalizeWeatherData = data => {
  return {
    temperature: toFiniteNumber(pickFirstDefined(data, ['temperature', 'temp'])),
    humidity: toFiniteNumber(pickFirstDefined(data, ['humidity', 'hum'])),
    pressure: toFiniteNumber(pickFirstDefined(data, ['pressure', 'pres'])),
    wind_speed: toFiniteNumber(pickFirstDefined(data, ['wind_speed', 'windSpeed', 'wind'])),
    wind_direction: pickFirstDefined(data, ['wind_direction', 'windDirection']),
    rainfall: toFiniteNumber(pickFirstDefined(data, ['rainfall', 'rain'])),
    solar_radiation: toFiniteNumber(pickFirstDefined(data, ['solar_radiation', 'solarRadiation'])),
    uv_index: toFiniteNumber(pickFirstDefined(data, ['uv_index', 'uvIndex'])),
    timestamp: normalizeTimestamp(pickFirstDefined(data, ['timestamp', 'time'])),
    firmware_version: pickFirstDefined(data, ['firmware_version', 'version', 'v'])
  };
};

export const validateWeatherData = (data) => {
  const errors = [];
  const normalizedData = normalizeWeatherData(data);

  // Required fields
  const requiredFields = ['temperature', 'humidity', 'pressure', 'wind_speed'];
  requiredFields.forEach(field => {
    if (normalizedData[field] === undefined || normalizedData[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate types and ranges
  if (normalizedData.temperature !== undefined && typeof normalizedData.temperature !== 'number') {
    errors.push('Temperature must be a number');
  } else if (normalizedData.temperature !== undefined && (normalizedData.temperature < -20 || normalizedData.temperature > 45)) {
    errors.push('Temperature out of range (-20 to 45°C)');
  }

  if (normalizedData.humidity !== undefined && typeof normalizedData.humidity !== 'number') {
    errors.push('Humidity must be a number');
  } else if (normalizedData.humidity !== undefined && (normalizedData.humidity < 0 || normalizedData.humidity > 100)) {
    errors.push('Humidity must be between 0 and 100');
  }

  if (normalizedData.pressure !== undefined && typeof normalizedData.pressure !== 'number') {
    errors.push('Pressure must be a number');                                   //change to 960 later
  } else if (normalizedData.pressure !== undefined && (normalizedData.pressure < 0 || normalizedData.pressure > 1070)) {
    errors.push('Pressure out of range (0 to 1070 hPa)');
  }

  if (normalizedData.wind_speed !== undefined && typeof normalizedData.wind_speed !== 'number') {
    errors.push('Wind speed must be a number');
  } else if (normalizedData.wind_speed !== undefined && (normalizedData.wind_speed < 0 || normalizedData.wind_speed > 150)) {
    errors.push('Wind speed out of range (0 to 150 km/h)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedData
  };
};
