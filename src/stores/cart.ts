import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '../types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<(Product & { quantity: number })[]>([])
  const isDrawerOpen = ref(false)

  // --- NEW: Toast Notification State ---
  const isToastVisible = ref(false)
  const toastMessage = ref('')
  let toastTimeout: ReturnType<typeof setTimeout>

  const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0),
  )

  // NEW: Function to show the sleek notification
  function triggerToast(productName: string) {
    toastMessage.value = `${productName} added to your bag.`
    isToastVisible.value = true

    // Clear any existing timer so it doesn't hide too early if they click fast!
    if (toastTimeout) clearTimeout(toastTimeout)

    // Auto-hide after 3 seconds
    toastTimeout = setTimeout(() => {
      isToastVisible.value = false
    }, 3000)
  }

  function addToCart(product: Product) {
    const existingItem = items.value.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }

    // CRITICAL FIX: We no longer force the drawer open!
    // We trigger the premium toast instead:
    triggerToast(product.title)
  }

  function removeFromCart(productId: number) {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index > -1) items.value.splice(index, 1)
  }

  function clearCart() {
    items.value = []
  }

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
    isToastVisible, // <-- We must export this!
    toastMessage, // <-- We must export this!
    addToCart,
    removeFromCart,
    toggleDrawer,
    closeDrawer,
    clearCart,
  }
})
