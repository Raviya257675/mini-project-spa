<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Product, ProductResponse } from '../types'
import ProductCard from '../components/ProductCard.vue'
import { useAuthStore } from '../stores/auth'

const productsList = ref<Product[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('All')
const authStore = useAuthStore()

// --- DARK MODE LOGIC ---
const isDark = ref(localStorage.getItem('theme') === 'dark')

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
// -----------------------

onMounted(async () => {
  // Check theme on load
  if (isDark.value) document.documentElement.classList.add('dark')

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

const uniqueCategories = computed(() => {
  const categories = productsList.value.map((p) => p.category)
  return ['All', ...new Set(categories)]
})

const filteredProducts = computed(() => {
  let filtered = productsList.value
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter((product) => product.category === selectedCategory.value)
  }
  if (searchQuery.value) {
    filtered = filtered.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  return filtered
})
import { useCartStore } from '../stores/cart'
const cartStore = useCartStore()
</script>

<template>
  <main class="p-8 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div class="flex items-center gap-4">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          E-Commerce Store
        </h1>

        <RouterLink
          to="/cart"
          class="px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold shadow-sm transition-colors hover:bg-emerald-200 dark:hover:bg-emerald-800"
        >
          🛒 Cart ({{ cartStore.totalItems }})
        </RouterLink>
        <button
          @click="toggleTheme"
          class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Toggle Dark Mode"
        >
          {{ isDark ? '☀️ Light' : '🌙 Dark' }}
        </button>
        <button
          v-if="authStore.isAuthenticated"
          @click="authStore.logout"
          class="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          Log Out
        </button>
        <RouterLink
          v-else
          to="/login"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Log In
        </RouterLink>
      </div>

      <div class="relative w-full md:w-96">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
        />
      </div>
    </div>

    <div v-if="!isLoading" class="flex flex-wrap gap-2 mb-8">
      <button
        v-for="category in uniqueCategories"
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors',
          selectedCategory === category
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700',
        ]"
      >
        {{ category }}
      </button>
    </div>

    <div v-if="isLoading" class="text-xl text-blue-500 font-semibold flex justify-center py-12">
      Loading products...
    </div>

    <div
      v-else-if="filteredProducts.length === 0"
      class="text-center py-12 text-gray-500 dark:text-gray-400"
    >
      No products found matching your filters.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard v-for="item in filteredProducts" :key="item.id" :product="item" />
    </div>
  </main>
</template>
