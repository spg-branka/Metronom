<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-background to-card-hover">
    <Navbar :current-section="currentSection" @switch-section="handleSectionSwitch" />

    <main class="my-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
      <div class="max-w-7xl w-full">
        <!-- Weather Section -->
        <div v-if="currentSection === 'weather'">
          <!-- Header Section -->
          <div class="mb-8 sm:mb-12 text-center">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-2">Test-Wetterdaten</h2>
            <div class="flex items-center justify-center gap-3">
              <span class="text-base sm:text-lg font-semibold text-primary">{{ time }}</span>
              <div class="w-2 h-2 bg-primary rounded-full" :class="{ 'animate-pulse': weatherStore.loading }"></div>
            </div>
            <!-- Status Message -->
            <div v-if="weatherStore.error" class="mt-3 text-status-error text-xs sm:text-sm font-medium">
              ⚠️ {{ weatherStore.error }}
            </div>
            <div v-else-if="!weatherStore.isDataAvailable" class="mt-3 text-status-warning text-xs sm:text-sm font-medium">
              ⏳ Warte auf Wetterdaten vom Server...
            </div>
            <div v-else-if="weatherStore.lastUpdated" class="mt-3 text-text-lighter text-xs sm:text-sm">
              aktualisiert: {{ lastUpdateTime }}
            </div>
          </div>

          <!-- Weather Cards Grid -->
          <div v-if="weatherStore.isDataAvailable" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <WeatherCard label="Temperatur" :value="weatherStore.formattedTemperature" icon="/src/assets/icons/thermometer.png" />
            <WeatherCard label="Windgeschwindigkeit" :value="weatherStore.formattedWindSpeed" icon="/src/assets/icons/fan.png" />
            <WeatherCard label="Luftfeuchtigkeit" :value="weatherStore.formattedHumidity" icon="/src/assets/icons/drop.png" />
            <WeatherCard label="Luftdruck" :value="weatherStore.formattedPressure" icon="/src/assets/icons/barometer.png" />
          </div>

          <!-- Download Section -->
          <!-- <div v-if="weatherStore.isDataAvailable" class="mt-8 sm:mt-12 text-center">
            <div class="bg-card rounded-lg shadow-md p-4 sm:p-6 max-w-md mx-auto">
              <h3 class="text-lg sm:text-xl font-semibold text-text mb-3 sm:mb-4">Wetterdaten herunterladen</h3>
              <p class="text-text-light text-sm sm:text-base mb-3 sm:mb-4">Lorem ipsum dolor sit amet.</p>
              <button
                @click="downloadWeatherData"
                class="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                JSON herunterladen
              </button>
            </div>
          </div> -->

          <!-- Loading State -->
          <div v-else class="flex flex-col items-center justify-center py-8 sm:py-12">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mb-4"></div>
            <p class="text-gray-600 text-sm sm:text-base">Verbindung zum Server wird hergestellt...</p>
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
            <div class="w-full flex flex-col justify-center items-center">
              <h3 class="text-xl sm:text-lg md:text-2xl lg:text-3xl font-bold text-text mb-4">Die Geschichte unserer Hofuhr</h3>
              <p class="text-gray-600 text-base sm:text-sm md:text-base lg:text-lg leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere reprehenderit impedit rerum necessitatibus quas amet iste, odio culpa, veritatis, ipsum totam aut voluptatem! Alias tempore, dignissimos voluptate, eaque necessitatibus reprehenderit excepturi quis dolore labore accusantium repellat corporis ratione nihil aperiam. Officiis accusamus sunt, eius similique commodi animi ea cumque veniam.
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

function downloadWeatherData() {
  if (!weatherStore.currentWeather) return

  const dataStr = JSON.stringify(weatherStore.currentWeather, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

  const exportFileDefaultName = `weather-data-${new Date().toISOString().split('T')[0]}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

function switchToWeather() {
  currentSection.value = 'weather'
}

function switchToProjectInfo() {
  currentSection.value = 'project-info'
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

  // Refresh weather data every 30 seconds (adjust as needed)
  refreshInterval = setInterval(refreshWeatherData, 30000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>
