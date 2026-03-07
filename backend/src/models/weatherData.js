// Store only the latest weather record (no long-term retention)
let currentWeatherData = null;

export const setCurrentWeatherData = (data) => {
  const record = {
    id: Date.now(),
    ...data,
    receivedAt: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
    timestamp: data.timestamp || Math.floor(Date.now() / 1000)
  };

  currentWeatherData = record;
  return record;
};

export const getCurrentWeatherData = () => currentWeatherData;
