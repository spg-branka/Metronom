<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Navbar />

    <main class="flex-1 px-6 py-12 flex flex-col items-center">
      <div class="max-w-7xl w-full">
        <!-- Header Section -->
        <div class="mb-12 text-center">
          <h2 class="text-4xl font-bold text-text mb-2">Live Weather Data</h2>
          <div class="flex items-center justify-center gap-3">
            <span class="text-lg font-semibold text-primary">{{ time }}</span>
            <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>

        <!-- Weather Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <WeatherCard label="Temperatur" :value="temperature" icon="/src/assets/icons/thermometer.png" />
          <WeatherCard label="Windgeschwindigkeit" :value="windSpeed" icon="/src/assets/icons/fan.png" />
          <WeatherCard label="Luftfeuchtigkeit" :value="humidity" icon="/src/assets/icons/drop.png" />
          <WeatherCard label="Luftdruck" :value="pressure" icon="/src/assets/icons/barometer.png" />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import WeatherCard from '../components/WeatherCard.vue'

const temperature = ref('25°C')
const windSpeed = ref('20 km/h')
const humidity = ref('40%')
const pressure = ref('1 bar')

const time = ref('HH:MM:SS')

function updateTime() {
  const now = new Date()
  time.value = now.toLocaleTimeString()
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>
