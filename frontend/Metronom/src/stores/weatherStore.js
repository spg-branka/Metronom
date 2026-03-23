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
    timestamp: Math.floor(Date.now() / 1000),
    receivedAt: new Date().toISOString()
  }
}

export const useWeatherStore = defineStore('weather', () => {
  // State
  const currentWeather = ref(null)
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

  // Methods
  const fetchCurrentWeather = async (options = {}) => {
    const {
      apiBaseUrl = API_BASE_URL
    } = options

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

      return null
    } finally {
      loading.value = false
    }
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
    fetchCurrentWeather
  }
})