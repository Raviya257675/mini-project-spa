<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const isLoading = ref(true)

// NEW: State to track which image is currently being viewed
const activeImage = ref('')

onMounted(async () => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${route.params.id}`)
    const data = await response.json()
    product.value = data

    // NEW: Set the first image from the gallery as the active image
    activeImage.value = data.images && data.images.length > 0 ? data.images[0] : data.thumbnail
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pb-20">
    <nav
      class="max-w-7xl mx-auto px-4 md:px-8 py-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center"
    >
      <button
        @click="router.push('/')"
        class="text-xs font-bold uppercase tracking-widest hover:text-gray-500 dark:text-gray-300 transition-colors flex items-center gap-2"
      >
        &larr; Back to Studio
      </button>
      <button
        @click="cartStore.toggleDrawer()"
        class="text-xs font-bold uppercase tracking-widest border-b-2 border-black dark:border-white pb-1 dark:text-white"
      >
        Cart ({{ cartStore.totalItems }})
      </button>
    </nav>

    <div v-if="isLoading" class="flex justify-center items-center h-[60vh]">
      <p class="text-xl text-gray-500 font-serif italic dark:text-gray-400">
        Retrieving details...
      </p>
    </div>

    <div v-else-if="product" class="max-w-7xl mx-auto px-4 md:px-8 mt-8 md:mt-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
        <div class="md:sticky md:top-8 h-max">
          <div
            class="aspect-[4/5] w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-8 md:p-16 mb-4 transition-all duration-500"
          >
            <img
              :src="activeImage"
              :alt="product.title"
              class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-opacity duration-300"
            />
          </div>

          <div
            v-if="product.images && product.images.length > 1"
            class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          >
            <button
              v-for="(img, index) in product.images"
              :key="index"
              @click="activeImage = img"
              class="w-20 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-2 border-2 transition-colors duration-300"
              :class="
                activeImage === img
                  ? 'border-black dark:border-white'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              "
            >
              <img
                :src="img"
                class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </button>
          </div>
        </div>

        <div class="flex flex-col justify-center py-8 md:py-16">
          <div class="mb-8">
            <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              {{ product.category }}
            </p>
            <h1
              class="text-4xl md:text-5xl font-serif font-black text-gray-900 dark:text-white leading-tight mb-4"
            >
              {{ product.title }}
            </h1>
            <p class="text-2xl font-serif text-gray-900 dark:text-gray-300 italic mb-8">
              ${{ product.price }}
            </p>
          </div>

          <div class="w-12 h-[1px] bg-black dark:bg-white mb-8"></div>

          <div class="mb-12">
            <h3
              class="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4"
            >
              Description
            </h3>
            <p
              class="text-gray-600 dark:text-gray-400 leading-relaxed font-light text-sm md:text-base"
            >
              {{ product.description }}
            </p>
          </div>

          <div class="flex flex-col gap-4">
            <button
              @click="cartStore.addToCart(product)"
              class="w-full bg-black dark:bg-white text-white dark:text-black py-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
            >
              Add To Cart
            </button>
          </div>

          <div class="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div class="flex justify-between items-center mb-4 cursor-pointer group">
              <h4
                class="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-gray-500 transition-colors"
              >
                Shipping & Returns
              </h4>
              <span class="text-gray-400">+</span>
            </div>
            <div class="flex justify-between items-center cursor-pointer group">
              <h4
                class="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-gray-500 transition-colors"
              >
                Material & Care
              </h4>
              <span class="text-gray-400">+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Hides the scrollbar on the thumbnail strip so it looks super clean */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
