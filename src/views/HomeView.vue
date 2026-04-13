<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Product, ProductResponse } from '../types'
import ProductCard from '../components/ProductCard.vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const productsList = ref<Product[]>([])
const isLoading = ref(true)

// --- FILTERING & SEARCH STATE ---
const searchQuery = ref('')
const selectedCategory = ref('All')
const maxPrice = ref(2000)
const sortBy = ref('default')

// --- SMART SEARCH DROPDOWN & SCROLL STATE ---
const showDropdown = ref(false)
const shopSection = ref<HTMLElement | null>(null)

// --- HERO SLIDESHOW STATE ---
const heroImages = [
  'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2000&auto=format&fit=crop',
]
const currentImageIndex = ref(0)
let slideshowInterval: number | ReturnType<typeof setInterval> | null = null

// --- PHILOSOPHY SLIDESHOW STATE ---
const philosophyImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1449247709967-d4461a6a4103?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
]
const currentPhilImageIndex = ref(0)
let philSlideshowInterval: number | ReturnType<typeof setInterval> | null = null

// --- ADVERTISEMENT SLIDESHOW STATE ---
const advertisements = [
  {
    image:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2000&auto=format&fit=crop',
    badge: 'Sponsored Campaign',
    title: 'The Sound of<br/>Perfection.',
    desc: 'Experience the new signature audio collection. Engineered for absolute clarity. Order today and get complimentary delivery.',
    btnText: 'Shop The Drop',
  },
  {
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop',
    badge: 'Exclusive Release',
    title: 'Timeless.<br/>Reimagined.',
    desc: 'Discover the limited edition smartwatch series. Where classic horology meets modern intelligence.',
    btnText: 'Discover Now',
  },
  {
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2000&auto=format&fit=crop',
    badge: 'New Arrival',
    title: 'Step Into<br/>The Future.',
    desc: 'The highly anticipated runner silhouette is finally here. Unparalleled comfort. Unmistakable style.',
    btnText: 'Secure Your Pair',
  },
]
const currentAdIndex = ref(0)
let adSlideshowInterval: number | ReturnType<typeof setInterval> | null = null

// --- MARQUEE DATA ---
const marqueeItems = [
  { text: 'PREMIUM BEAUTY', outlined: false },
  { text: 'MODERN FURNITURE', outlined: true },
  { text: 'KITCHEN ESSENTIALS', outlined: false },
  { text: 'CURATED FRAGRANCES', outlined: true },
  { text: 'DAILY GROCERIES', outlined: false },
  { text: 'SMART ELECTRONICS', outlined: true },
]

// --- REVIEWS & FEEDBACK STATE ---
const showFeedbackModal = ref(false)
const feedbackForm = ref({ name: '', rating: 5, text: '' })
const testimonials = ref([
  {
    id: 1,
    name: 'Elena R.',
    rating: 5,
    text: 'The curation is unmatched. Every piece feels intentional and the unboxing experience was pure luxury.',
    date: 'April 2026',
  },
  {
    id: 2,
    name: 'Marcus T.',
    rating: 5,
    text: 'Seamless checkout, fast delivery, and the quality of the minimalist decor is exactly as pictured. A true premium experience.',
    date: 'March 2026',
  },
  {
    id: 3,
    name: 'Sarah K.',
    rating: 4,
    text: 'Love the aesthetic of the beauty selection. I wish there were a few more fragrance options, but overall stunning.',
    date: 'March 2026',
  },
  {
    id: 4,
    name: 'James L.',
    rating: 5,
    text: 'Finally, a flagship store that curates my whole lifestyle in one place. Obsessed.',
    date: 'February 2026',
  },
])

const submitFeedback = () => {
  if (!feedbackForm.value.name || !feedbackForm.value.text) return
  testimonials.value.unshift({
    id: Date.now(),
    name: feedbackForm.value.name,
    rating: feedbackForm.value.rating,
    text: feedbackForm.value.text,
    date: 'Just now',
  })
  feedbackForm.value = { name: '', rating: 5, text: '' }
  showFeedbackModal.value = false
}

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

onMounted(async () => {
  if (isDark.value) document.documentElement.classList.add('dark')

  slideshowInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % heroImages.length
  }, 5000)

  philSlideshowInterval = setInterval(() => {
    currentPhilImageIndex.value = (currentPhilImageIndex.value + 1) % philosophyImages.length
  }, 6000)

  // Start the Advertisement Slideshow!
  adSlideshowInterval = setInterval(() => {
    currentAdIndex.value = (currentAdIndex.value + 1) % advertisements.length
  }, 7000) // Changes every 7 seconds

  try {
    const response = await fetch('https://dummyjson.com/products?limit=50')
    const data: ProductResponse = await response.json()
    productsList.value = data.products
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (slideshowInterval) clearInterval(slideshowInterval as number)
  if (philSlideshowInterval) clearInterval(philSlideshowInterval as number)
  if (adSlideshowInterval) clearInterval(adSlideshowInterval as number)
})

const uniqueCategories = computed(() => {
  const categories = productsList.value.map((p) => p.category)
  return ['All', ...new Set(categories)]
})

const searchDropdownResults = computed(() => {
  if (!searchQuery.value) return []
  return productsList.value
    .filter((p) => p.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(0, 5)
})

const handleSelectProduct = (product: Product) => {
  selectedCategory.value = product.category
  searchQuery.value = product.title
  maxPrice.value = 2000
  showDropdown.value = false

  setTimeout(() => {
    shopSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
}

const handleEnterSearch = () => {
  showDropdown.value = false
  maxPrice.value = 2000
  const matchedCategory = uniqueCategories.value.find(
    (c) => c.toLowerCase() === searchQuery.value.toLowerCase(),
  )
  if (matchedCategory) {
    selectedCategory.value = matchedCategory
    searchQuery.value = ''
  } else {
    selectedCategory.value = 'All'
  }
  setTimeout(() => {
    shopSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
  searchQuery.value = ''
}

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
  filtered = filtered.filter((product) => product.price <= maxPrice.value)
  if (sortBy.value === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price)
  }
  return filtered
})

const clearFilters = () => {
  selectedCategory.value = 'All'
  maxPrice.value = 2000
  searchQuery.value = ''
  sortBy.value = 'default'
  showDropdown.value = false
}
</script>

<template>
  <main
    class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden"
  >
    <div class="bg-black dark:bg-white py-2 w-full z-50 relative">
      <p
        class="text-center text-white dark:text-black text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse"
      >
        Complimentary PickMe Direct Delivery on Orders Over $200 ✦ Shop The Spring Edit
      </p>
    </div>

    <nav
      class="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center py-6 px-4 md:px-8 border-b border-gray-200 dark:border-gray-800 relative z-50"
    >
      <button
        @click="router.push('/')"
        class="flex items-center gap-3 text-2xl md:text-3xl font-serif font-black tracking-widest text-gray-900 dark:text-white uppercase mb-4 lg:mb-0 group"
      >
        <img src="../assets/logo.avif" alt="E-Buy Logo" class="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
        <span>E-Buy</span>
      </button>
      
      <div class="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="showDropdown = true"
            @focus="showDropdown = true"
            @keydown.enter="handleEnterSearch"
            type="text"
            placeholder="Search our catalog..."
            class="w-40 md:w-56 pb-1 bg-transparent text-sm border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none dark:text-white transition-colors"
          />
          <div
            v-if="showDropdown && searchQuery.length > 0"
            @click="showDropdown = false"
            class="fixed inset-0 z-40 w-full h-full"
          ></div>
          <div
            v-if="showDropdown && searchQuery.length > 0"
            class="absolute top-full left-0 mt-3 w-full md:w-72 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl z-50 rounded-sm overflow-hidden"
          >
            <ul v-if="searchDropdownResults.length > 0">
              <li v-for="item in searchDropdownResults" :key="item.id">
                <button
                  @click="handleSelectProduct(item)"
                  class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-4 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                >
                  <div
                    class="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 p-1"
                  >
                    <img
                      :src="item.thumbnail"
                      class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>
                  <div class="flex flex-col overflow-hidden">
                    <span
                      class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5"
                      >{{ item.category.replace('-', ' ') }}</span
                    >
                    <span class="text-xs font-semibold dark:text-white truncate">{{
                      item.title
                    }}</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <button
          @click="toggleTheme"
          class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors"
        >
          {{ isDark ? 'Light' : 'Dark' }}
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
            class="text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-gray-500 dark:text-gray-300 transition-colors"
          >
            Profile
          </button>
          <button
            @click="authStore.logout"
            class="text-xs md:text-sm font-semibold tracking-widest uppercase text-red-600 hover:text-red-400"
          >
            Log Out
          </button>
        </template>

        <button
          @click="cartStore.toggleDrawer()"
          class="text-xs md:text-sm font-semibold tracking-widest uppercase border-b-2 border-black dark:border-white pb-1 hover:text-gray-500 dark:text-gray-300"
        >
          Cart ({{ cartStore.totalItems }})
        </button>
      </div>
    </nav>

    <div
      class="relative w-full h-[60vh] md:h-[75vh] bg-gray-900 flex items-center justify-center overflow-hidden"
    >
      <img
        v-for="(img, index) in heroImages"
        :key="'hero-' + index"
        :src="img"
        :class="[
          'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out',
          index === currentImageIndex ? 'opacity-80 z-0' : 'opacity-0 -z-10',
        ]"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-0"
      ></div>
      <div class="relative z-10 text-center px-4 mt-12 flex flex-col items-center">
        <p
          class="text-white tracking-[0.4em] text-[10px] md:text-xs mb-6 uppercase font-bold drop-shadow-md"
        >
          The Lifestyle Edit
        </p>
        <h2
          class="text-5xl md:text-8xl font-serif font-bold text-white uppercase tracking-tight drop-shadow-lg mb-6 leading-none"
        >
          Create<br />Your World
        </h2>
        <button
          @click="shopSection?.scrollIntoView({ behavior: 'smooth' })"
          class="bg-white text-black px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300"
        >
          Explore Catalog
        </button>
      </div>
    </div>

    <div
      class="bg-black dark:bg-white py-5 overflow-hidden flex whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
    >
      <div
        class="animate-marquee flex items-center gap-8 text-xs md:text-sm font-black uppercase tracking-[0.3em] text-white dark:text-black"
      >
        <template v-for="n in 2" :key="n">
          <div
            v-for="(item, index) in marqueeItems"
            :key="`${n}-${index}`"
            class="flex items-center gap-8"
          >
            <span
              :class="[
                item.outlined
                  ? 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.7)] dark:[-webkit-text-stroke:1px_rgba(0,0,0,0.6)]'
                  : '',
              ]"
              >{{ item.text }}</span
            >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400 animate-spin-slow opacity-60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 3v18m9-9H3m15.364-6.364l-12.728 12.728m0-12.728l12.728 12.728"
              />
            </svg>
          </div>
        </template>
      </div>
    </div>

    <div
      class="max-w-7xl mx-auto px-4 md:px-8 mb-24 mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start"
    >
      <div class="flex flex-col justify-start -mt-12">
        
        <div class="mb-16">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
            Our Philosophy
          </p>
          <h3
            class="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight dark:text-white text-gray-900"
          >
            Intentional Living.
          </h3>
          <p
            class="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-light text-base md:text-lg"
          >
            We believe that exceptional design shouldn't be limited to one category. Whether it is the
            fragrance that defines your space or the furniture that grounds it, our curation focuses
            on uncompromising quality.
          </p>
          <button
            class="self-start border-b border-black dark:border-white pb-1 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors dark:text-white"
          >
            Learn More
          </button>
        </div>

        <div>
          <h3 class="text-5xl md:text-6xl font-serif italic mb-6 leading-tight dark:text-white text-gray-900 tracking-tight">
            About Us.
          </h3>
          <p class="text-gray-500 dark:text-gray-400 leading-relaxed font-light text-base md:text-lg">
            Founded on the principle of uncompromising excellence, E-Buy curates the world's finest
            lifestyle essentials. We bridge the gap between aesthetic beauty and everyday utility,
            delivering a seamless retail experience designed for the modern connoisseur.
          </p>
        </div>

      </div>

      <div class="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800 relative group z-10">
        <img
          v-for="(img, index) in philosophyImages"
          :key="'phil-' + index"
          :src="img"
          :class="[
            'absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out',
            index === currentPhilImageIndex ? 'opacity-100 z-20' : 'opacity-0 z-0',
          ]"
        />
      </div>
    </div>

    <div ref="shopSection" class="max-w-7xl mx-auto px-4 md:px-8 pb-16 pt-8 scroll-mt-24">
      <div class="flex flex-col items-center mb-16 w-full">
        <h3
          class="text-2xl md:text-3xl font-serif font-bold mb-8 tracking-wide uppercase dark:text-white"
        >
          Discover The Catalog
        </h3>
        <div
          v-if="!isLoading"
          class="w-full flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-8"
        >
          <div class="flex flex-wrap gap-2 md:gap-3 w-full xl:w-auto flex-1">
            <button
              v-for="category in uniqueCategories"
              :key="category"
              @click="selectCategory(category)"
              :class="[
                'px-5 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300',
                selectedCategory === category
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
                  : 'bg-transparent text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white',
              ]"
            >
              {{ category.replace('-', ' ') }}
            </button>
          </div>
          <div
            class="flex flex-col sm:flex-row gap-6 items-center bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 p-5 w-full xl:w-auto shadow-sm backdrop-blur-sm rounded-sm"
          >
            <div class="flex flex-col gap-3 w-full sm:w-48">
              <label
                class="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex justify-between"
                ><span>Max Price</span
                ><span class="text-black dark:text-white">${{ maxPrice }}</span></label
              >
              <input v-model="maxPrice" type="range" min="0" max="2000" class="premium-slider" />
            </div>
            <div class="hidden sm:block w-px h-10 bg-gray-300 dark:bg-gray-700"></div>
            <select
              v-model="sortBy"
              class="bg-transparent border-b border-gray-300 dark:border-gray-600 pb-1 text-xs outline-none cursor-pointer dark:text-white focus:border-black dark:focus:border-white transition-colors uppercase font-bold tracking-widest"
            >
              <option value="default" class="text-black">Default</option>
              <option value="price-low" class="text-black">Price: Low to High</option>
              <option value="price-high" class="text-black">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
      <div
        v-if="isLoading"
        class="text-xl text-gray-500 font-serif italic text-center py-12 dark:text-gray-400"
      >
        Curating collection...
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductCard v-for="item in filteredProducts" :key="item.id" :product="item" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div
        class="relative w-full h-[50vh] md:h-[60vh] bg-gray-900 overflow-hidden group rounded-sm"
      >
        <img
          v-for="(ad, index) in advertisements"
          :key="'ad-img-' + index"
          :src="ad.image"
          :class="[
            'absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105',
            index === currentAdIndex ? 'opacity-70 z-10' : 'opacity-0 z-0',
          ]"
        />

        <div
          class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none"
        ></div>

        <div
          v-for="(ad, index) in advertisements"
          :key="'ad-text-' + index"
          :class="[
            'absolute inset-0 flex flex-col items-start justify-center text-left p-8 md:p-16 transition-opacity duration-1000 z-20',
            index === currentAdIndex
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          ]"
        >
          <span
            class="text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-4 border-b border-white pb-1"
            >{{ ad.badge }}</span
          >
          <h3
            class="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight"
            v-html="ad.title"
          ></h3>
          <p class="text-gray-300 text-sm md:text-base max-w-md mb-8 leading-relaxed font-light">
            {{ ad.desc }}
          </p>
          <button
            class="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300 shadow-xl"
          >
            {{ ad.btnText }}
          </button>
        </div>

        <div class="absolute bottom-6 left-8 md:left-16 flex gap-2 z-30">
          <button
            v-for="(ad, index) in advertisements"
            :key="'ad-dot-' + index"
            @click="currentAdIndex = index"
            :class="[
              'h-1 rounded-full transition-all duration-500',
              index === currentAdIndex ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/70',
            ]"
          ></button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-gray-100 dark:border-gray-800">
      <div class="text-center mb-16">
        <h3
          class="text-2xl md:text-3xl font-serif font-bold tracking-wide uppercase dark:text-white"
        >
          Live in E-Buy
        </h3>
        <p class="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase mt-2">
          The Community Edit
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[800px]">
        <div
          class="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-800"
        >
          <img
            src="https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=1000&auto=format&fit=crop"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Community living space"
          />
          <div
            class="absolute bottom-6 left-6 backdrop-blur-md bg-white/10 p-4 border border-white/20"
          >
            <p class="text-white text-[10px] font-bold uppercase">
              @sophia_home // The Velvet Sofa
            </p>
          </div>
        </div>
        <div
          class="bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8 text-center border border-gray-100 dark:border-gray-800"
        >
          <div class="flex flex-col gap-4">
            <span class="text-4xl text-black dark:text-white font-serif italic"
              >"Finally, a store that understands the balance of aesthetic and utility."</span
            >
            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400"
              >— Verified Buyer</span
            >
          </div>
        </div>
        <div class="relative group overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-800">
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt="Product texture"
          />
          <div
            class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <span
              class="text-white text-[10px] font-bold uppercase tracking-widest border border-white px-4 py-2"
              >View Ritual</span
            >
          </div>
        </div>
        <div
          class="md:col-span-2 relative group overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-800"
        >
          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Kitchen set up"
          />
          <div
            class="absolute top-6 right-6 bg-black text-white px-4 py-2 text-[10px] font-bold uppercase"
          >
            Cooking Essentials
          </div>
        </div>
      </div>
    </div>

    <div
      class="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-gray-100 dark:border-gray-800 relative"
    >
      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h3
            class="text-2xl md:text-3xl font-serif font-bold tracking-wide uppercase dark:text-white"
          >
            Client Experiences
          </h3>
          <p class="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase mt-2">The Verdict</p>
        </div>
        <button
          @click="showFeedbackModal = true"
          class="text-xs font-bold uppercase tracking-widest border-b border-black dark:border-white pb-1 dark:text-white hover:text-gray-500 transition-colors"
        >
          Share Your Experience
        </button>
      </div>
      <div class="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory">
        <div
          v-for="review in testimonials"
          :key="review.id"
          class="snap-start flex-none w-80 md:w-96 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 p-8 flex flex-col justify-between"
        >
          <div>
            <div class="flex gap-1 mb-6">
              <svg
                v-for="n in 5"
                :key="n"
                :class="[
                  'w-4 h-4',
                  n <= review.rating
                    ? 'text-black dark:text-white'
                    : 'text-gray-300 dark:text-gray-600',
                ]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <p class="text-gray-600 dark:text-gray-300 font-serif text-lg leading-relaxed mb-8">
              "{{ review.text }}"
            </p>
          </div>
          <div
            class="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <span>{{ review.name }}</span>
            <span>{{ review.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showFeedbackModal"
      class="fixed inset-0 z-[100] flex items-center justify-center px-4"
    >
      <div
        @click="showFeedbackModal = false"
        class="absolute inset-0 backdrop-blur-md bg-black/40"
      ></div>
      <div
        class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-lg p-8 shadow-2xl rounded-sm"
      >
        <button
          @click="showFeedbackModal = false"
          class="absolute top-6 right-6 text-gray-400 hover:text-black dark:hover:text-white"
        >
          ✕
        </button>
        <h3 class="text-2xl font-serif font-bold uppercase dark:text-white mb-2">
          Your Experience
        </h3>
        <p class="text-xs text-gray-500 mb-8 uppercase tracking-widest">
          We value your curation feedback.
        </p>
        <form @submit.prevent="submitFeedback" class="flex flex-col gap-6">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3"
              >Rating</label
            >
            <div class="flex gap-2">
              <button
                type="button"
                v-for="star in 5"
                :key="'form-' + star"
                @click="feedbackForm.rating = star"
                class="focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  :class="[
                    'w-6 h-6',
                    star <= feedbackForm.rating
                      ? 'text-black dark:text-white'
                      : 'text-gray-200 dark:text-gray-700',
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
            <input
              v-model="feedbackForm.name"
              type="text"
              placeholder="Your Name / Handle"
              required
              class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm outline-none focus:border-black dark:focus:border-white transition-colors dark:text-white"
            />
          </div>
          <div>
            <textarea
              v-model="feedbackForm.text"
              placeholder="Describe your experience with E-Buy..."
              required
              rows="3"
              class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-sm outline-none focus:border-black dark:focus:border-white transition-colors dark:text-white resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            class="bg-black dark:bg-white text-white dark:text-black py-4 mt-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>

    <div
      class="border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/50 py-10 relative z-10"
    >
      <div
        class="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
      >
        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400"
          >Seamlessly Delivered By</span
        >
        <div
          class="flex flex-wrap items-center justify-center gap-8 md:gap-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default"
        >
          <span class="text-2xl font-sans font-black tracking-tighter text-black dark:text-white"
            >Uber</span
          >
          <span class="text-2xl font-sans font-black tracking-tight text-[#00A550]">PickMe</span>
          <span class="text-2xl font-sans font-black tracking-tighter text-[#D40511] italic pr-2"
            >DHL</span
          >
          <span class="text-2xl font-sans font-black tracking-tighter text-[#4D148C]">FedEx</span>
        </div>
      </div>
    </div>

    <footer
      class="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 pt-16 pb-8"
    >
      <div
        class="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-5 gap-12 mb-16 text-center md:text-left"
      >
        <div class="md:col-span-2">
          <h2
            class="flex items-center justify-center md:justify-start gap-3 text-2xl font-serif font-black tracking-widest uppercase mb-6 dark:text-white text-gray-900"
          >
            <img src="../assets/logo.avif" alt="E-Buy Logo" class="h-8 w-auto object-contain" />
            E-Buy
          </h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-6 mx-auto md:mx-0">
            Redefining modern living with a curated selection of premium essentials.
          </p>
        </div>

        <div class="md:col-span-1">
          <h4 class="text-xs font-bold uppercase tracking-widest mb-6 dark:text-gray-300">Shop</h4>
          <ul class="space-y-4 text-sm text-gray-500">
            <li>
              <a href="#" class="hover:text-black dark:hover:text-white transition-colors"
                >The Catalog</a
              >
            </li>
            <li>
              <a href="#" class="hover:text-black dark:hover:text-white transition-colors"
                >Best Sellers</a
              >
            </li>
          </ul>
        </div>

        <div class="md:col-span-1">
          <h4 class="text-xs font-bold uppercase tracking-widest mb-6 dark:text-gray-300">
            Social
          </h4>
          <div class="flex flex-col gap-4 text-sm text-gray-500 items-center md:items-start">
            <a
              href="#"
              class="hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest"
              >Instagram</a
            >
            <a
              href="#"
              class="hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest"
              >Twitter</a
            >
          </div>
        </div>

        <div class="md:col-span-1">
          <h4 class="text-xs font-bold uppercase tracking-widest mb-6 dark:text-gray-300">
            Flagship Store
          </h4>
          <p
            class="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest leading-relaxed"
          >
            Ruhunupura<br />Western Province<br />Sri Lanka
          </p>
          <div
            class="w-full h-32 overflow-hidden rounded-sm border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58638739618!2d79.8562055!3d6.9270786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style="border: 0"
              allowfullscreen="false"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="opacity-70 grayscale transition-all duration-700 ease-in-out hover:opacity-100 hover:grayscale-0 dark:invert dark:hue-rotate-180 dark:hover:invert-0 dark:hover:hue-rotate-0"
            ></iframe>
          </div>
        </div>
      </div>
      <div
        class="text-center text-[10px] font-bold tracking-widest text-gray-400 pt-8 border-t border-gray-100 dark:border-gray-800 uppercase"
      >
        © 2026 E-Buy. All rights reserved.
      </div>
    </footer>
  </main>
</template>

<style scoped>
.premium-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
  outline: none;
  transition: opacity 0.2s;
}
.dark .premium-slider {
  background: #374151;
}
.premium-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #000;
  cursor: pointer;
}
.dark .premium-slider::-webkit-slider-thumb {
  background: #fff;
}
.animate-marquee {
  animation: marquee 25s linear infinite;
}
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-spin-slow {
  animation: spin 8s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>