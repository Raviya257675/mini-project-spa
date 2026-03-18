<script setup lang="ts">
import { RouterView } from 'vue-router'
import Chatbot from './components/Chatbot.vue'
import CartDrawer from './components/CartDrawer.vue' // <-- 1. Import the new drawer
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <RouterView />

    <CartDrawer />

    <div class="fixed bottom-6 right-6 z-50">
      <Chatbot />
    </div>
  </div>
</template>
