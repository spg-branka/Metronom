import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// FRONTEND-ONLY MODE: Backend disabled for frontend development
// Uncomment the API calls below when ready to integrate with backend

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Generate random weather data for frontend development
const generateMockWeatherData = () => {
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
    if (!currentWeather.value) return '--°C'
    return `${currentWeather.value.temperature.toFixed(1)}°C`
  })

  const formattedHumidity = computed(() => {
    if (!currentWeather.value) return '--'
    return `${currentWeather.value.humidity.toFixed(0)}%`
  })

  const formattedPressure = computed(() => {
    if (!currentWeather.value) return '-- hPa'
    return `${currentWeather.value.pressure.toFixed(1)} hPa`
  })

  const formattedWindSpeed = computed(() => {
    if (!currentWeather.value) return '-- km/h'
    return `${currentWeather.value.wind_speed.toFixed(1)} km/h`
  })

  // Automatically regenerate mock weather data every 5 seconds
  setInterval(() => {
    currentWeather.value = generateMockWeatherData()
    lastUpdated.value = new Date()
  }, 5000)

  // Helper to generate fresh mock data
  const generateFreshMockData = () => {
    return generateMockWeatherData()
  }

  // Methods (DISABLED - Backend not running)
  const fetchCurrentWeather = async () => {
    // BACKEND DISABLED FOR FRONTEND DEVELOPMENT
    // Uncomment below to enable API calls:
    /*
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/weather/current`)

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        currentWeather.value = data.data
        lastUpdated.value = new Date()
        return data.data
      } else {
        error.value = data.error || 'Failed to fetch weather data'
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching weather:', err)
    } finally {
      loading.value = false
    }
    */

    // Mock implementation - remove when backend is ready
    console.log('📌 Using mock weather data (backend disabled)')
    
    // Generate fresh mock data to simulate changing conditions
    const freshData = generateFreshMockData()
    currentWeather.value = freshData
    lastUpdated.value = new Date()
    
    // Simulate network delay
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 300)
    
    return freshData
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