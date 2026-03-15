<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Product, ProductResponse } from '../types'

// This creates a reactive variable to hold our data. It starts as an empty array.
const productsList = ref<Product[]>([])
const isLoading = ref(true)

// onMounted runs this fetch logic the moment the page loads
onMounted(async () => {
  try {
    const response = await fetch('https://dummyjson.com/products')
    const data: ProductResponse = await response.json()
    productsList.value = data.products
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="p-8 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">E-Commerce Store</h1>

    <div v-if="isLoading" class="text-xl text-blue-500 font-semibold">Loading products...</div>

    <ul v-else class="space-y-2">
      <li
        v-for="item in productsList"
        :key="item.id"
        class="p-4 bg-white shadow rounded-lg border border-gray-200"
      >
        <span class="font-bold text-lg">{{ item.title }}</span> -
        <span class="text-green-600">${{ item.price }}</span>
      </li>
    </ul>
  </main>
</template>
