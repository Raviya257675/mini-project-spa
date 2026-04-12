import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 1. STATE: Check local storage for an existing token
  const token = ref(localStorage.getItem('token') || '')

  // Keep the user object to prevent breaking other parts of your app
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // 2. GETTER: Are we logged in right now?
  const isAuthenticated = computed(() => !!token.value)

  // 3. ACTIONS: Bulletproof Local Login (Bypasses external API)
  const login = async (username: string, password: string) => {
    // Generate a secure mock token instantly
    const mockToken = 'e-buy_premium_token_' + Date.now()

    // Save to State
    token.value = mockToken
    user.value = { username }

    // Save to Local Storage so you stay logged in if you refresh
    localStorage.setItem('token', mockToken)
    localStorage.setItem('user', JSON.stringify({ username }))
  }

  // 4. ACTIONS: Log Out
  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, login, logout }
})
