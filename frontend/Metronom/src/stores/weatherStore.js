import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Kept for local development fallback and tests.
export const generateMockWeatherData = () => {
  return {
    temperature: Math.random() * 60 - 20, // Random temperature between -20 and 40
    humidity: Math.random() * 50 + 30, // Random humidity between 30% and 80%
    pressure: 960 + Math.random() * 110, // Random pressure between 960-1070 hPa
    wind_speed: Math.random() * 100, // 0 to 100 km/h
    wind_direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
    rainfall: Math.random() * 10, // 0 to 10 mm
    solar_radiation: Math.random() * 1000, // 0 to 1000 W/m²
    uv_index: Math.floor(Math.random() * 12), // 0 to 11
    timestamp: Math.floor(Date.now() / 1000),
    receivedAt: new Date().toISOString()
  }
}

// Initial mock data
const MOCK_WEATHER_DATA = generateMockWeatherData()

export const useWeatherStore = defineStore('weather', () => {
  // State
  const currentWeather = ref(MOCK_WEATHER_DATA)
  const loading = ref(false)
  const error = ref(null)
  const lastUpdated = ref(new Date())

  // Computed
  const isDataAvailable = computed(() => currentWeather.value !== null)

  const formattedTemperature = computed(() => {
    if (!currentWeather.value || typeof currentWeather.value.temperature !== 'number') return '--°C'
    return `${currentWeather.value.temperature.toFixed(1)}°C`
  })

  const formattedHumidity = computed(() => {
    if (!currentWeather.value || typeof currentWeather.value.humidity !== 'number') return '--'
    return `${currentWeather.value.humidity.toFixed(0)}%`
  })

  const formattedPressure = computed(() => {
    if (!currentWeather.value || typeof currentWeather.value.pressure !== 'number') return '-- hPa'
    return `${currentWeather.value.pressure.toFixed(1)} hPa`
  })

  const formattedWindSpeed = computed(() => {
    if (!currentWeather.value || typeof currentWeather.value.wind_speed !== 'number') return '-- km/h'
    return `${currentWeather.value.wind_speed.toFixed(1)} km/h`
  })

  // Helper to generate fresh mock data
  const generateFreshMockData = () => {
    return generateMockWeatherData()
  }

  // Methods
  const fetchCurrentWeather = async (options = {}) => {
    const {
      useBackend = true,
      apiBaseUrl = API_BASE_URL,
      fallbackToMock = true
    } = options

    if (!useBackend) {
      const freshData = generateFreshMockData()
      currentWeather.value = freshData
      lastUpdated.value = new Date()
      return freshData
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${apiBaseUrl}/weather/current`)

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        currentWeather.value = data.data
        lastUpdated.value = new Date()
        return data.data
      } else {
        throw new Error(data.error || 'Failed to fetch weather data')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching weather:', err)

      if (fallbackToMock) {
        const freshData = generateFreshMockData()
        currentWeather.value = freshData
        lastUpdated.value = new Date()
        return freshData
      }

      return null
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Optional: Add a method to manually refresh with new mock data
  const refreshMockData = () => {
    currentWeather.value = generateFreshMockData()
    lastUpdated.value = new Date()
    return currentWeather.value
  }

  return {
    // State
    currentWeather,
    loading,
    error,
    lastUpdated,

    // Computed
    isDataAvailable,
    formattedTemperature,
    formattedHumidity,
    formattedPressure,
    formattedWindSpeed,

    // Methods
    fetchCurrentWeather,
    clearError,
    refreshMockData
  }
})