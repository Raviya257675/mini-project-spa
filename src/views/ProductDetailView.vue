<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '../types'

const route = useRoute()
const product = ref<Product | null>(null)
const isLoading = ref(true)

// When the page loads, fetch the single product using the ID from the URL
onMounted(async () => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${route.params.id}`)
    product.value = await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="p-8 max-w-4xl mx-auto">
    <div v-if="isLoading" class="text-xl text-blue-500 font-semibold text-center py-12">
      Loading details...
    </div>

    <div
      v-else-if="product"
      class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row"
    >
      <div class="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
        <img
          :src="product.thumbnail"
          :alt="product.title"
          class="max-w-full h-auto object-contain drop-shadow-md"
        />
      </div>

      <div class="p-8 md:w-1/2 flex flex-col justify-center">
        <p class="text-sm text-blue-500 font-bold uppercase tracking-widest mb-2">
          {{ product.category }}
        </p>
        <h1 class="text-3xl font-extrabold text-gray-900 mb-4">{{ product.title }}</h1>
        <p class="text-gray-600 mb-6 leading-relaxed">{{ product.description }}</p>

        <div class="text-4xl font-black text-emerald-600 mb-8">${{ product.price }}</div>

        <RouterLink
          to="/"
          class="inline-block text-center bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          &larr; Back to Store
        </RouterLink>
      </div>
    </div>
  </main>
</template>
