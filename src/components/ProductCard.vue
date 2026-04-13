<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import type { Product } from '../types'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

// --- WISHLIST LOGIC ---
// Dynamically check if this specific product is in the user's wishlist
const isFavorited = computed(() => authStore.isInWishlist(props.product.id))

const handleWishlistClick = () => {
  if (!authStore.isAuthenticated) {
    alert("Please sign in to save items to your wishlist.")
    router.push('/login')
    return
  }
  authStore.toggleWishlist(props.product)
}
</script>

<template>
  <div class="group flex flex-col cursor-pointer relative">
    
    <div
      class="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 overflow-hidden mb-4 flex items-center justify-center p-6"
    >
      <button 
        @click.prevent="handleWishlistClick"
        class="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
      >
        <svg 
          :class="['w-4 h-4 transition-colors', isFavorited ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300']" 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </button>

      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      <div
        class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 z-20"
      >
        <button
          @click.prevent="cartStore.addToCart(product)"
          class="flex-1 bg-black text-white py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
        >
          Add To Cart
        </button>
        <RouterLink
          :to="`/product/${product.id}`"
          class="flex-1 bg-white text-black py-3 text-center text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-black hover:bg-gray-100 transition-colors shadow-lg"
        >
          Details
        </RouterLink>
      </div>
      
      <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
    </div>

    <div class="flex justify-between items-start mt-2 px-1">
      <div>
        <h3
          class="font-bold text-sm md:text-base uppercase tracking-wide text-gray-900 dark:text-white line-clamp-1 pr-4"
        >
          {{ product.title }}
        </h3>
        <p class="text-xs text-gray-500 mt-1 capitalize">{{ product.category }}</p>
      </div>
      <p class="font-serif font-bold text-lg md:text-xl text-gray-900 dark:text-white">
        ${{ product.price }}
      </p>
    </div>
  </div>
</template>