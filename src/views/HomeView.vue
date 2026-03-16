<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Product, ProductResponse } from '../types'
import ProductCard from '../components/ProductCard.vue'

const productsList = ref<Product[]>([])
const isLoading = ref(true)
const searchQuery = ref('') // Stores what the user types

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

// Automatically filters the list whenever the search box changes
const filteredProducts = computed(() => {
  return productsList.value.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>

<template>
  <main class="p-8 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">E-Commerce Store</h1>
      <div class="relative w-full md:w-96">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>

    <div v-if="isLoading" class="text-xl text-blue-500 font-semibold flex justify-center py-12">
      Loading products...
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center py-12 text-gray-500">
      No products found matching "{{ searchQuery }}"
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard v-for="item in filteredProducts" :key="item.id" :product="item" />
    </div>
  </main>
</template>
