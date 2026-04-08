<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-background to-card-hover">
    <Navbar :current-section="currentSection" @switch-section="handleSectionSwitch" />

    <main class="my-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
      <div class="max-w-7xl w-full">
        <!-- Weather Section -->
        <div v-if="currentSection === 'weather'">
          <!-- Header Section -->
          <div class="mb-8 sm:mb-12 text-center">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-2">Wetterdaten</h2>
            <div class="flex items-center justify-center gap-3">
              <span class="text-base sm:text-lg font-semibold text-primary">{{ time }}</span>
              <div class="w-2 h-2 bg-primary rounded-full" :class="{ 'animate-pulse': weatherStore.loading }"></div>
            </div>
            <!-- Status Message -->
            <div v-if="weatherStore.error" class="mt-3 text-status-error text-xs sm:text-sm font-medium">
              Warning: {{ weatherStore.error }}
            </div>
            <div v-else-if="!weatherStore.isDataAvailable" class="mt-3 text-status-warning text-xs sm:text-sm font-medium">
              Warten auf Wetterdaten vom Server...
            </div>
            <div v-else-if="weatherStore.lastUpdated" class="mt-3 text-text-lighter text-xs sm:text-sm">
              aktualisiert: {{ lastUpdateTime }}
            </div>
          </div>

          <!-- Weather Cards Grid -->
          <div v-if="weatherStore.isDataAvailable" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <WeatherCard label="Temperatur" :value="weatherStore.formattedTemperature" />
            <WeatherCard label="Windgeschwindigkeit" :value="weatherStore.formattedWindSpeed" />
            <WeatherCard label="Luftfeuchtigkeit" :value="weatherStore.formattedHumidity" />
            <WeatherCard label="Luftdruck" :value="weatherStore.formattedPressure" />
          </div>

          <!-- Loading State -->
          <div v-else class="flex flex-col items-center justify-center py-8 sm:py-12">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mb-4"></div>
            <p class="text-gray-600 text-sm sm:text-base">Wetterdaten werden geladen...</p>
          </div>
        </div>

        <!-- Project Info Section -->
        <div v-if="currentSection === 'project-info'" class="w-full">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 place-items-center">
            <div class="w-full flex justify-center items-center">
              <div class="w-full max-w-sm">
                <ClockIcon class="w-full h-auto object-contain" />
              </div>
            </div>
            <div class="w-full mt-4 sm:mt-0 flex flex-col justify-center items-center">
              <h3 class="text-xl sm:text-lg md:text-2xl lg:text-3xl font-bold text-text mb-4 text-center sm:text-left">Die Geschichte unserer Hofuhr</h3>
              <p class="text-gray-600 text-base sm:text-sm md:text-base lg:text-lg leading-relaxed text-justify lg:text-center whitespace-pre-line break-words mobile-history-text">
                Die Geschichte der Hofuhr der HTL Spengergasse ist eng mit einem traditionsreichen Wiener Unternehmen verbunden:
                „Ing. Emil Schauer“, gegründet 1839, prägte die Entwicklung der Zeitmessung in Österreich maßgeblich.       

                Besonders bekannt wurde Ing. Emil Schauer durch die Zusammenarbeit mit dem Wiener Stadtbauamt bei der Entwicklung der berühmten „Wiener Würfeluhren“.
                Als Pionier für elektrische Uhrensysteme, öffentliche Großuhrenanlagen und Turmuhren setzte die Firma neue Maßstäbe.
                Dass sich ein Uhrwerk dieses renommierten Herstellers heute in der HTL Spengergasse befindet, verleiht der Hofuhr einen besonderen historischen und kulturellen Wert – ein Wert, der durch dieses Projekt bewahrt wird.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWeatherStore } from '../stores/weatherStore'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import WeatherCard from '../components/WeatherCard.vue'
import ClockIcon from '../assets/icons/ClockIcon.vue'

const weatherStore = useWeatherStore()
const time = ref('HH:MM:SS')
const currentSection = ref('weather') // 'weather' or 'project-info'
let timeInterval = null
let refreshInterval = null

const lastUpdateTime = computed(() => {
  if (!weatherStore.lastUpdated) return ''
  const date = new Date(weatherStore.lastUpdated)
  return date.toLocaleTimeString()
})

function updateTime() {
  const now = new Date()
  time.value = now.toLocaleTimeString()
}

function refreshWeatherData() {
  weatherStore.fetchCurrentWeather()
}

function handleSectionSwitch(section) {
  currentSection.value = section
}

onMounted(() => {
  // Update time every second
  updateTime()
  timeInterval = setInterval(updateTime, 1000)

  // Fetch initial weather data
  refreshWeatherData()

  // Refresh weather data every 60 seconds
  refreshInterval = setInterval(refreshWeatherData, 60000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>
