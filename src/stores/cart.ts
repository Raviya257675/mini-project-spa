import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '../types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<(Product & { quantity: number })[]>([])
  const isDrawerOpen = ref(false) // NEW: Tracks if drawer is open

  const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0),
  )

  function addToCart(product: Product) {
    const existingItem = items.value.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
    isDrawerOpen.value = true // NEW: Automatically open drawer when adding an item!
  }

  function removeFromCart(productId: number) {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index > -1) items.value.splice(index, 1)
  }

  function clearCart() {
    items.value = []
  }
  // NEW: Drawer controls
  function toggleDrawer() {
    isDrawerOpen.value = !isDrawerOpen.value
  }

  function closeDrawer() {
    isDrawerOpen.value = false
  }

  return {
    items,
    totalItems,
    totalPrice,
    isDrawerOpen,
    addToCart,
    removeFromCart,
    toggleDrawer,
    closeDrawer,
    clearCart,
  }
})
