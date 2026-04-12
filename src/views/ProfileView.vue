<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

// Template specific user data
const userName = ref('M.G Ravindu Deepaka')

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

onMounted(() => {
  if (isDark.value) document.documentElement.classList.add('dark')
})

// --- STRICT TYPESCRIPT INTERFACE ---
interface Order {
  id: string
  date: string
  status: string
  productName: string
  image: string
  price: number
  reviewed: boolean
}

const orders = ref<Order[]>([
  {
    id: 'ORD-2026-8891',
    date: 'April 01, 2026',
    status: 'Processing',
    productName: 'Matte Black French Press',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=500&auto=format&fit=crop',
    price: 85.0,
    reviewed: false,
  },
  {
    id: 'ORD-2026-7432',
    date: 'March 24, 2026',
    status: 'Delivered',
    productName: 'Minimalist Ceramic Vase',
    image:
      'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=500&auto=format&fit=crop',
    price: 120.0,
    reviewed: false,
  },
  {
    id: 'ORD-2026-5109',
    date: 'February 14, 2026',
    status: 'Delivered',
    productName: 'Velvet Lounge Chair',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500&auto=format&fit=crop',
    price: 850.0,
    reviewed: true,
  },
])

// --- REVIEW MODAL STATE ---
const showReviewModal = ref(false)
const selectedOrder = ref<any>(null)
const reviewForm = ref({ rating: 5, text: '' })

const openReviewModal = (order: any) => {
  selectedOrder.value = order
  showReviewModal.value = true
}

const submitProductReview = () => {
  if (!reviewForm.value.text) return

  // 100% Type-Safe approach
  const orderToUpdate = orders.value.find((o) => o.id === selectedOrder.value.id)
  if (orderToUpdate) {
    orderToUpdate.reviewed = true
  }

  reviewForm.value = { rating: 5, text: '' }
  showReviewModal.value = false
  alert('Thank you! 100 Reward Points have been added to your account.')
}
</script>

<template>
  <main
    class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 relative pb-20"
  >
    <nav
      class="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center py-6 px-4 md:px-8 border-b border-gray-200 dark:border-gray-800 relative z-50 bg-gray-50 dark:bg-gray-950"
    >
      <button
        @click="router.push('/')"
        class="text-2xl md:text-3xl font-serif font-black tracking-widest text-gray-900 dark:text-white uppercase mb-4 lg:mb-0"
      >
        E-Buy
      </button>

      <div class="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        <button
          @click="toggleTheme"
          class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors"
        >
          {{ isDark ? 'Light' : 'Dark' }}
        </button>

        <button
          @click="router.push('/')"
          class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors"
        >
          Home
        </button>

        <button
          v-if="!authStore.isAuthenticated"
          @click="router.push('/login')"
          class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors"
        >
          Sign In
        </button>
        <template v-else>
          <button
            @click="router.push('/profile')"
            class="text-xs md:text-sm font-semibold tracking-widest uppercase text-black dark:text-white border-b-2 border-black dark:border-white pb-1"
          >
            Profile
          </button>
          <button
            @click="authStore.logout"
            class="text-xs md:text-sm font-semibold tracking-widest uppercase text-red-600 hover:text-red-400 transition-colors"
          >
            Log Out
          </button>
        </template>

        <button
          @click="cartStore.toggleDrawer()"
          class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors"
        >
          Cart ({{ cartStore.totalItems }})
        </button>
      </div>
    </nav>

    <div
      class="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12"
    >
      <div class="lg:col-span-4 lg:col-start-1">
        <div
          class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-sm shadow-sm flex flex-col items-center text-center sticky top-8"
        >
          <div
            class="w-32 h-32 rounded-full p-1 border-2 border-gray-100 dark:border-gray-800 mb-6 relative group cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
              class="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-[0.98]"
              alt="Profile Avatar"
            />
            <div
              class="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"
            ></div>

            <div
              class="absolute inset-1 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </div>
          </div>

          <h2 class="text-xl font-serif font-bold text-gray-900 dark:text-white mb-1 tracking-wide">
            {{ userName }}
          </h2>
          <p
            class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-1"
          >
            <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Premium Member
          </p>

          <div
            class="w-full bg-gray-50 dark:bg-gray-950 py-4 rounded-sm border border-gray-100 dark:border-gray-800 mb-8 text-center relative overflow-hidden"
          >
            <div
              class="absolute -right-4 -top-4 w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full blur-xl opacity-50"
            ></div>

            <p
              class="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1 relative z-10"
            >
              Reward Balance
            </p>
            <p
              class="text-2xl font-serif font-black text-gray-900 dark:text-white flex items-center justify-center gap-2 relative z-10"
            >
              <span class="text-yellow-500 drop-shadow-sm text-xl">✦</span> 350
            </p>
          </div>

          <div class="w-full flex flex-col gap-3">
            <button
              class="w-full flex items-center justify-between px-5 py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-sm shadow-lg transition-transform hover:scale-[1.02]"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
                <span class="text-xs font-bold uppercase tracking-widest">Order History</span>
              </div>
              <span class="text-[10px] font-bold opacity-80">3</span>
            </button>

            <button
              class="w-full flex items-center justify-between px-5 py-3.5 bg-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
                <span class="text-xs font-bold uppercase tracking-widest">Saved Wishlist</span>
              </div>
            </button>

            <button
              class="w-full flex items-center justify-between px-5 py-3.5 bg-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span class="text-xs font-bold uppercase tracking-widest">Account Settings</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-8 flex flex-col gap-6">
        <div
          class="flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-4 mb-2"
        >
          <h3 class="text-xl font-serif font-bold text-gray-900 dark:text-white">Recent Orders</h3>
          <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400"
            >Past 30 Days</span
          >
        </div>

        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row gap-8 shadow-sm rounded-sm transition-all hover:shadow-md"
        >
          <div
            class="w-full md:w-40 h-40 bg-gray-100 dark:bg-gray-800 flex-shrink-0 rounded-sm overflow-hidden border border-gray-50 dark:border-gray-800"
          >
            <img
              :src="order.image"
              class="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>

          <div class="flex-1 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-xl font-serif font-bold text-gray-900 dark:text-white">
                  {{ order.productName }}
                </h4>
                <span class="text-base font-bold text-gray-900 dark:text-white"
                  >${{ order.price.toFixed(2) }}</span
                >
              </div>
              <p class="text-[10px] uppercase tracking-widest text-gray-400 mb-6">
                Order #{{ order.id }} • Placed {{ order.date }}
              </p>

              <div
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-sm"
              >
                <span
                  :class="[
                    'w-1.5 h-1.5 rounded-full',
                    order.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse',
                  ]"
                ></span>
                <span
                  class="text-[9px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300"
                  >{{ order.status }}</span
                >
              </div>
            </div>

            <div
              class="mt-6 flex justify-end items-center border-t border-gray-100 dark:border-gray-800 pt-4"
            >
              <button
                v-if="order.status === 'Processing'"
                disabled
                class="text-[10px] font-bold uppercase tracking-widest text-gray-400 cursor-not-allowed"
              >
                Arriving Soon
              </button>

              <button
                v-else-if="order.status === 'Delivered' && !order.reviewed"
                @click="openReviewModal(order)"
                class="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2 rounded-sm shadow-sm hover:shadow-md"
              >
                <span>Review & Earn 100 Pts</span
                ><span class="text-sm text-yellow-400 dark:text-yellow-600">✦</span>
              </button>

              <div
                v-else-if="order.reviewed"
                class="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 px-4 py-2 rounded-sm border border-green-100 dark:border-green-900/30"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-[10px] font-bold uppercase tracking-widest">Reviewed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showReviewModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        @click="showReviewModal = false"
        class="absolute inset-0 backdrop-blur-md bg-black/60"
      ></div>

      <div
        class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-lg p-8 shadow-2xl rounded-sm"
      >
        <button
          @click="showReviewModal = false"
          class="absolute top-6 right-6 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <h3 class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
          Review Product
        </h3>
        <p class="text-[10px] font-bold text-gray-500 mb-8 uppercase tracking-widest">
          {{ selectedOrder?.productName }}
        </p>

        <form @submit.prevent="submitProductReview" class="flex flex-col gap-6">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3"
              >Overall Rating</label
            >
            <div class="flex gap-2">
              <button
                type="button"
                v-for="star in 5"
                :key="'product-star-' + star"
                @click="reviewForm.rating = star"
                class="focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  :class="[
                    'w-8 h-8',
                    star <= reviewForm.rating
                      ? 'text-black dark:text-white'
                      : 'text-gray-200 dark:text-gray-800',
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3"
              >Written Review</label
            >
            <textarea
              v-model="reviewForm.text"
              placeholder="What did you love about this piece?"
              required
              rows="4"
              class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 text-sm outline-none focus:border-black dark:focus:border-white transition-colors text-gray-900 dark:text-white resize-none rounded-sm"
            ></textarea>
          </div>
          <button
            type="submit"
            class="bg-black dark:bg-white text-white dark:text-black py-4 mt-2 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity w-full rounded-sm shadow-lg"
          >
            Submit & Claim Points
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
