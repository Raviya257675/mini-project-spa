<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const username = ref('emilys') // Pre-filled with DummyJSON's test user!
const password = ref('emilyspass')
const errorMessage = ref('')
const isLoading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(username.value, password.value)
    router.push('/') // Send them back to the Home page if successful!
  } catch (error) {
    errorMessage.value = 'Invalid username or password.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="min-h-[80vh] flex items-center justify-center p-4">
    <div
      class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
    >
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >Username</label
          >
          <input
            v-model="username"
            type="text"
            required
            class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>

        <div
          v-if="errorMessage"
          class="text-red-500 text-sm font-semibold text-center bg-red-50 dark:bg-red-900/30 p-3 rounded-lg"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Checking...' : 'Log In' }}
        </button>
      </form>

      <p class="mt-6 text-xs text-center text-gray-400 dark:text-gray-500">
        Demo Credentials: emilys / emilyspass
      </p>
    </div>
  </main>
</template>
