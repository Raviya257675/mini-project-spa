<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Product, ProductResponse } from '../types'
import ProductCard from '../components/ProductCard.vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const productsList = ref<Product[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('All')

const authStore = useAuthStore()
const cartStore = useCartStore()

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
</script>

<template>
  <main class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <nav
      class="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center py-6 px-4 md:px-8 border-b border-gray-200 dark:border-gray-800"
    >
      <h1
        class="text-2xl md:text-3xl font-serif font-black tracking-widest text-gray-900 dark:text-white uppercase mb-4 lg:mb-0"
      >
        E-Buy
      </h1>

      <div class="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search collection..."
          class="w-40 md:w-48 pb-1 bg-transparent text-sm border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors"
        />

        <button
          @click="toggleTheme"
          class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors"
        >
          {{ isDark ? 'Light' : 'Dark' }}
        </button>
        <RouterLink
          to="/login"
          v-if="!authStore.isAuthenticated"
          class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors"
        >
          Sign In
        </RouterLink>
        <button
          v-else
          @click="authStore.logout"
          class="text-xs md:text-sm font-semibold tracking-widest uppercase text-red-600 hover:text-red-400"
        >
          Log Out
        </button>
        <RouterLink
          to="/cart"
          class="text-xs md:text-sm font-semibold tracking-widest uppercase border-b-2 border-black dark:border-white pb-1 hover:text-gray-500 dark:text-gray-300"
        >
          Cart ({{ cartStore.totalItems }})
        </RouterLink>
      </div>
    </nav>

    <div
      class="relative w-full h-[60vh] md:h-[70vh] bg-gray-100 mb-16 overflow-hidden flex items-center justify-center group"
    >
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
        class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
        alt="Fashion Model"
      />
      <div class="absolute inset-0 bg-black/40"></div>

      <div class="relative z-10 text-center px-4 mt-8">
        <p
          class="text-white tracking-[0.3em] text-xs md:text-sm mb-4 uppercase font-semibold drop-shadow-md"
        >
          The New Collection
        </p>
        <h2
          class="text-5xl md:text-8xl font-serif font-bold text-white uppercase tracking-tight drop-shadow-lg mb-8"
        >
          Dress Your<br />Elegance
        </h2>
        <button
          class="bg-white text-black px-10 py-4 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300"
        >
          Explore Now
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div class="flex flex-col items-center mb-16">
        <h3
          class="text-2xl md:text-3xl font-serif font-bold mb-8 tracking-wide uppercase dark:text-white"
        >
          New Arrivals
        </h3>
        <div v-if="!isLoading" class="flex flex-wrap justify-center gap-3 md:gap-4">
          <button
            v-for="category in uniqueCategories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 md:px-6 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest border transition-colors',
              selectedCategory === category
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                : 'bg-transparent text-gray-500 border-gray-300 hover:border-black dark:text-gray-400 dark:border-gray-700 dark:hover:border-white',
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div
        v-if="isLoading"
        class="text-xl text-gray-500 font-serif italic text-center py-12 dark:text-gray-400"
      >
        Curating collection...
      </div>
      <div
        v-else-if="filteredProducts.length === 0"
        class="text-center py-12 text-gray-500 font-serif dark:text-gray-400"
      >
        No pieces found matching your criteria.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductCard v-for="item in filteredProducts" :key="item.id" :product="item" />
      </div>
    </div>
  </main>
</template>
