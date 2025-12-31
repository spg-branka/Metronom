<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  if (router.currentRoute.value.path === '/') {
    router.push('/dashboard')
  }
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
