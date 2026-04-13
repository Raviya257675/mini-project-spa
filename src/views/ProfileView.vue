<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

// --- SECURITY CHECK ---
if (!authStore.isAuthenticated || !authStore.user) {
  router.push('/login')
}

// --- TAB NAVIGATION STATE ---
const activeTab = ref('orders')

// --- DYNAMIC USER DATA ---
const userName = computed(() => {
  if (!authStore.user) return 'Valued Member'
  return `${authStore.user.firstName} ${authStore.user.lastName}`
})

const userFirstName = computed(() => authStore.user?.firstName || 'Valued')
const userLastName = computed(() => authStore.user?.lastName || 'Member')
const userPoints = computed(() => authStore.user?.points || 0)

// Pull the user's specific order and wishlist lists from the store
const userOrders = computed(() => authStore.user?.orders || [])
const userWishlist = computed(() => authStore.user?.wishlist || [])

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

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
  const orderToUpdate = userOrders.value.find((o) => o.id === selectedOrder.value.id)
  if (orderToUpdate) orderToUpdate.reviewed = true

  reviewForm.value = { rating: 5, text: '' }
  showReviewModal.value = false
  alert('Thank you! 100 Reward Points have been added to your account.')
}

// --- REAL PROFILE PICTURE UPLOAD LOGIC ---
const showAvatarModal = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null) 
const newAvatarBase64 = ref<string | null>(null) 

const openAvatarModal = () => {
  avatarPreview.value = authStore.user?.avatar || null
  newAvatarBase64.value = null
  showAvatarModal.value = true
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
    newAvatarBase64.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const saveProfilePicture = () => {
  if (!authStore.user || !newAvatarBase64.value) return
  
  authStore.updateUserDetails(
    authStore.user.firstName, 
    authStore.user.lastName, 
    newAvatarBase64.value
  )
  
  showAvatarModal.value = false
  alert('Profile picture updated successfully!')
}

// --- SETTINGS FORM LOGIC ---
const settingsForm = ref({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || ''
})
const isSaving = ref(false)

const saveSettings = () => {
  if (!authStore.user) return;
  isSaving.value = true
  
  setTimeout(() => {
    authStore.updateUserDetails(
      settingsForm.value.firstName, 
      settingsForm.value.lastName, 
      authStore.user?.avatar
    )
    isSaving.value = false
    alert('Account details updated successfully!')
  }, 1000)
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 relative pb-20">
    <nav class="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center py-6 px-4 md:px-8 border-b border-gray-200 dark:border-gray-800 relative z-50 bg-gray-50 dark:bg-gray-950">
      <button @click="router.push('/')" class="flex items-center gap-3 text-2xl md:text-3xl font-serif font-black tracking-widest text-gray-900 dark:text-white uppercase mb-4 lg:mb-0 group">
        <img src="../assets/logo.avif" alt="E-Buy Logo" class="h-7 md:h-9 w-auto object-contain transition-transform group-hover:scale-105" />
        <span>E-Buy</span>
      </button>

      <div class="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        <button @click="toggleTheme" class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors">
          {{ isDark ? 'Light' : 'Dark' }}
        </button>
        <button @click="router.push('/')" class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors">
          Home
        </button>
        <template v-if="authStore.isAuthenticated">
          <button @click="router.push('/profile')" class="text-xs md:text-sm font-semibold tracking-widest uppercase text-black dark:text-white border-b-2 border-black dark:border-white pb-1">
            Profile
          </button>
          <button @click="handleLogout" class="text-xs md:text-sm font-semibold tracking-widest uppercase text-red-600 hover:text-red-400 transition-colors">
            Log Out
          </button>
        </template>
        <button @click="cartStore.toggleDrawer()" class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors">
          Cart ({{ cartStore.totalItems }})
        </button>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
      <div class="lg:col-span-4 lg:col-start-1">
        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-sm shadow-sm flex flex-col items-center text-center sticky top-8">
          
          <div class="w-32 h-32 rounded-full p-1 border-2 border-gray-100 dark:border-gray-800 mb-6 relative group cursor-pointer transition-colors shadow-sm bg-slate-500">
            <div class="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full m-1">
              <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" class="w-full h-full object-cover" alt="User Avatar" />
              <span v-else class="text-4xl font-serif font-bold text-white uppercase drop-shadow-sm">
                {{ userFirstName.charAt(0) }}{{ userLastName.charAt(0) }}
              </span>
            </div>
            
            <div @click="openAvatarModal" class="absolute inset-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span class="text-[8px] font-bold text-white uppercase tracking-widest">Update</span>
            </div>
          </div>

          <h2 class="text-xl font-serif font-bold text-gray-900 dark:text-white mb-1 tracking-wide">{{ userName }}</h2>
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-1">
            <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            Premium Member
          </p>

          <div class="w-full bg-gray-50 dark:bg-gray-950 py-4 rounded-sm border border-gray-100 dark:border-gray-800 mb-8 text-center relative overflow-hidden">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full blur-xl opacity-50"></div>
            <p class="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1 relative z-10">Reward Balance</p>
            <p class="text-2xl font-serif font-black text-gray-900 dark:text-white flex items-center justify-center gap-2 relative z-10">
              <span class="text-yellow-500 drop-shadow-sm text-xl">✦</span> {{ userPoints }}
            </p>
          </div>

          <div class="w-full flex flex-col gap-3">
            <button
              @click="activeTab = 'orders'"
              :class="['w-full flex items-center justify-between px-5 py-3.5 rounded-sm transition-all duration-300 border border-transparent', activeTab === 'orders' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-[1.02]' : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:border-gray-700']"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <span class="text-xs font-bold uppercase tracking-widest">Order History</span>
              </div>
              <span class="text-[10px] font-bold opacity-80">{{ userOrders.length }}</span>
            </button>

            <button
              @click="activeTab = 'wishlist'"
              :class="['w-full flex items-center justify-between px-5 py-3.5 rounded-sm transition-all duration-300 border border-transparent', activeTab === 'wishlist' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-[1.02]' : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:border-gray-700']"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                <span class="text-xs font-bold uppercase tracking-widest">Saved Wishlist</span>
              </div>
              <span class="text-[10px] font-bold opacity-80">{{ userWishlist.length }}</span>
            </button>

            <button
              @click="activeTab = 'settings'"
              :class="['w-full flex items-center justify-between px-5 py-3.5 rounded-sm transition-all duration-300 border border-transparent', activeTab === 'settings' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-[1.02]' : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:border-gray-700']"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span class="text-xs font-bold uppercase tracking-widest">Account Settings</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-8 flex flex-col gap-6">
        
        <div v-if="activeTab === 'orders'" class="animate-fade-in">
          <div class="flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
            <h3 class="text-xl font-serif font-bold text-gray-900 dark:text-white">Recent Orders</h3>
            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Past 30 Days</span>
          </div>

          <div class="space-y-6">
            <div v-if="userOrders.length === 0" class="text-center p-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-sm shadow-sm">
                <svg class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                <p class="text-base font-bold text-gray-900 dark:text-white mb-2">No orders curated yet.</p>
                <p class="text-xs text-gray-500 max-w-xs mx-auto mb-10 leading-relaxed">It looks like your collection is just beginning. Shop the catalog to see your intentional lifestyle take shape.</p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                  <button @click="router.push('/')" class="px-10 py-4 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all rounded-sm shadow-lg">Shop Catalog</button>
                  <button @click="authStore.addMockOrder" class="px-10 py-4 bg-transparent border border-black dark:border-white text-black dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors rounded-sm shadow-sm">Demo: Add Order</button>
                </div>
            </div>

            <div v-else v-for="order in userOrders" :key="order.id" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-sm shadow-sm transition-all hover:shadow-md overflow-hidden">
              
              <div class="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                    <p class="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{{ order.id }}</p>
                    <p class="text-sm font-bold text-gray-900 dark:text-white">Placed {{ order.date }}</p>
                 </div>
                 <div class="text-left sm:text-right">
                    <p class="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Total Amount</p>
                    <p class="text-sm font-bold text-gray-900 dark:text-white">${{ order.totalAmount.toFixed(2) }}</p>
                 </div>
              </div>

              <div class="p-6 flex flex-col gap-6">
                 <div v-for="item in order.items" :key="item.id" class="flex gap-6 items-center">
                    <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-sm overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 p-2">
                       <img :src="item.thumbnail" class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div class="flex-1">
                       <h4 class="text-sm font-serif font-bold text-gray-900 dark:text-white mb-1">{{ item.title }}</h4>
                       <p class="text-xs text-gray-500">Qty: {{ item.quantity }} • ${{ item.price.toFixed(2) }} each</p>
                    </div>
                 </div>
              </div>

              <div class="p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30 dark:bg-gray-900/30">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-sm">
                   <span :class="['w-1.5 h-1.5 rounded-full', order.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse']"></span>
                   <span class="text-[9px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">{{ order.status }}</span>
                </div>

                <div>
                   <button v-if="order.status === 'Processing'" disabled class="text-[10px] font-bold uppercase tracking-widest text-gray-400 cursor-not-allowed">Arriving Soon</button>
                   <button v-else-if="order.status === 'Delivered' && !order.reviewed" @click="openReviewModal(order)" class="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2 rounded-sm shadow-sm hover:shadow-md">
                       <span>Review & Earn Pts</span><span class="text-sm text-yellow-400 dark:text-yellow-600">✦</span>
                   </button>
                   <div v-else-if="order.reviewed" class="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 px-4 py-2 rounded-sm border border-green-100 dark:border-green-900/30">
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                       <span class="text-[10px] font-bold uppercase tracking-widest">Reviewed</span>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div v-if="activeTab === 'wishlist'" class="animate-fade-in">
          <div class="flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
            <h3 class="text-xl font-serif font-bold text-gray-900 dark:text-white">Saved Collection</h3>
            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Favorites</span>
          </div>

          <div v-if="userWishlist.length === 0" class="text-center p-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-sm shadow-sm">
            <svg class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <p class="text-base font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty.</p>
            <p class="text-xs text-gray-500 max-w-xs mx-auto mb-10 leading-relaxed">Save items you love to curate your dream space over time.</p>
            <div class="flex justify-center">
              <button @click="router.push('/')" class="px-10 py-4 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all rounded-sm shadow-lg">Explore Catalog</button>
            </div>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div v-for="item in userWishlist" :key="item.id" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-4 shadow-sm rounded-sm transition-all hover:shadow-md group">
               <div class="w-full h-48 bg-gray-50 dark:bg-gray-800 overflow-hidden relative rounded-sm p-4">
                 <img :src="item.thumbnail" class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105" />
                 
                 <button @click="authStore.toggleWishlist(item)" class="absolute top-2 right-2 w-8 h-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-md transition-colors">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
               </div>
               <div>
                 <p class="text-[9px] uppercase tracking-widest text-gray-400 mb-1">{{ item.category }}</p>
                 <h4 class="text-base font-serif font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{{ item.title }}</h4>
                 <span class="text-sm font-bold text-gray-500 dark:text-gray-400">${{ item.price.toFixed(2) }}</span>
               </div>
               
               <button @click="cartStore.addToCart(item)" class="w-full bg-black dark:bg-white text-white dark:text-black py-3 mt-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity rounded-sm">Move to Cart</button>
             </div>
          </div>
        </div>

        <div v-if="activeTab === 'settings'" class="animate-fade-in">
          <div class="flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
            <h3 class="text-xl font-serif font-bold text-gray-900 dark:text-white">Account Settings</h3>
            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Personal Details</span>
          </div>

          <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 shadow-sm rounded-sm">
            <form @submit.prevent="saveSettings" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">First Name</label>
                  <input v-model="settingsForm.firstName" type="text" class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Last Name</label>
                  <input v-model="settingsForm.lastName" type="text" class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors" />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
                <input v-model="settingsForm.email" type="email" disabled class="w-full bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-2 px-3 text-sm outline-none text-gray-400 dark:text-gray-500 cursor-not-allowed" title="Email cannot be changed" />
                <p class="text-[9px] text-gray-400 mt-2 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Contact Support to update email.
                </p>
              </div>

              <div class="pt-6 border-t border-gray-100 dark:border-gray-800">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-6">Security</h4>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">New Password</label>
                  <input type="password" placeholder="Leave blank to keep current password" class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors font-mono placeholder:font-sans" />
                </div>
              </div>

              <div class="flex justify-end pt-6 mt-4">
                <button type="submit" :disabled="isSaving" class="bg-black dark:bg-white text-white dark:text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity rounded-sm shadow-lg flex items-center gap-2">
                  <span v-if="isSaving" class="flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                  </span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>

    <div v-if="showReviewModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div @click="showReviewModal = false" class="absolute inset-0 backdrop-blur-md bg-black/60"></div>
      <div class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-lg p-8 shadow-2xl rounded-sm">
        <button @click="showReviewModal = false" class="absolute top-6 right-6 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h3 class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Review Order</h3>
        <p class="text-[10px] font-bold text-gray-500 mb-8 uppercase tracking-widest line-clamp-1 pr-4">Order #{{ selectedOrder?.id }}</p>
        <form @submit.prevent="submitProductReview" class="flex flex-col gap-6">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Overall Rating</label>
            <div class="flex gap-2">
              <button type="button" v-for="star in 5" :key="'product-star-' + star" @click="reviewForm.rating = star" class="focus:outline-none transition-transform hover:scale-110">
                <svg :class="['w-8 h-8', star <= reviewForm.rating ? 'text-black dark:text-white' : 'text-gray-200 dark:text-gray-800']" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Written Review</label>
            <textarea v-model="reviewForm.text" placeholder="What did you love about this piece?" required rows="4" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 text-sm outline-none focus:border-black dark:focus:border-white transition-colors text-gray-900 dark:text-white resize-none rounded-sm"></textarea>
          </div>
          <button type="submit" class="bg-black dark:bg-white text-white dark:text-black py-4 mt-2 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity w-full rounded-sm shadow-lg">
            Submit & Claim Points
          </button>
        </form>
      </div>
    </div>

    <div v-if="showAvatarModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div @click="showAvatarModal = false" class="absolute inset-0 backdrop-blur-md bg-black/60"></div>
      <div class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-sm p-8 shadow-2xl rounded-sm text-center">
        
        <button @click="showAvatarModal = false" class="absolute top-6 right-6 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h3 class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Profile Picture</h3>
        <p class="text-[10px] font-bold text-gray-500 mb-8 uppercase tracking-widest">Select an image from your device.</p>
        
        <div class="w-40 h-40 mx-auto rounded-full p-1 border-2 border-gray-200 dark:border-gray-800 mb-8 relative">
           <div class="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full m-1 bg-slate-500">
             <img v-if="avatarPreview" :src="avatarPreview" class="w-full h-full object-cover" alt="Preview" />
             <span v-else class="text-5xl font-serif font-bold text-white uppercase drop-shadow-sm">
               {{ userFirstName.charAt(0) }}{{ userLastName.charAt(0) }}
             </span>
           </div>
        </div>

        <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" class="hidden" />

        <div class="flex flex-col gap-3">
          <button @click="triggerFileInput" class="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-sm">
            Browse Desktop
          </button>
          
          <button @click="saveProfilePicture" :disabled="!newAvatarBase64" :class="['w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm', newAvatarBase64 ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80 shadow-md' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed']">
            Save Picture
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>