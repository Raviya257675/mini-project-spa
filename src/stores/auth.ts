import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 1. Define strictly typed structures for our "database"
export interface OrderItem {
  id: number
  title: string
  price: number
  quantity: number
  thumbnail: string
}

export interface Order {
  id: string
  date: string
  status: string
  totalAmount: number
  items: OrderItem[]
  reviewed: boolean
}

// User interface, now data-rich
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  password?: string // Kept secret
  points: number
  joinDate: string
  username?: string // Backward compatibility
  orders: Order[] // User-specific orders
  avatar?: string // Optional field for profile picture (base64)
  wishlist: any[] // NEW: Array to hold favorited products
}

export const useAuthStore = defineStore('auth', () => {
  // 2. STATE: Check local storage for an existing session
  const token = ref(localStorage.getItem('token') || '')
  
  // BULLETPROOF INITIALIZATION: Automatically fix old accounts missing the new arrays
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  if (storedUser) {
    let needsUpdate = false;
    if (!storedUser.orders) {
      storedUser.orders = []
      needsUpdate = true;
    }
    if (!storedUser.wishlist) {
      storedUser.wishlist = []
      needsUpdate = true;
    }
    if (needsUpdate) {
      localStorage.setItem('user', JSON.stringify(storedUser))
    }
  }
  const user = ref<User | null>(storedUser)

  // 3. GETTER: Are we logged in right now?
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // 4. ACTIONS: Real Register Flow
  const register = (firstName: string, lastName: string, email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('ebuy_users') || '[]')
    
    const userExists = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (userExists) throw new Error('An account with this email already exists.')

    const newUser: User = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password,
      points: 150, 
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      username: firstName,
      orders: [], 
      avatar: undefined,
      wishlist: [] // Start new user with empty wishlist
    }

    users.push(newUser)
    localStorage.setItem('ebuy_users', JSON.stringify(users))

    const { password: _, ...safeUser } = newUser
    const mockToken = 'e-buy_premium_token_' + Date.now()
    
    token.value = mockToken
    user.value = safeUser as User

    localStorage.setItem('token', mockToken)
    localStorage.setItem('user', JSON.stringify(safeUser))
  }

  const login = (email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('ebuy_users') || '[]')
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    
    if (!foundUser) throw new Error('Invalid email or password.')

    // Ensure older accounts get necessary arrays if they don't have them
    if (!foundUser.orders) foundUser.orders = []
    if (!foundUser.avatar) foundUser.avatar = undefined
    if (!foundUser.wishlist) foundUser.wishlist = []

    const { password: _, ...safeUser } = foundUser
    const mockToken = 'e-buy_premium_token_' + Date.now()
    
    token.value = mockToken
    user.value = safeUser as User

    localStorage.setItem('token', mockToken)
    localStorage.setItem('user', JSON.stringify(safeUser))
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateUserDetails = (newFirstName: string, newLastName: string, newAvatarBase64?: string) => {
    if (!user.value) return;
    const users: User[] = JSON.parse(localStorage.getItem('ebuy_users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.value?.id)

    if (userIndex === -1) throw new Error('User not found in database.')

    const updatedStoreUser = {
      ...user.value,
      firstName: newFirstName,
      lastName: newLastName,
      username: newFirstName 
    };

    if (newAvatarBase64) updatedStoreUser.avatar = newAvatarBase64;

    const updatedDatabaseUser = {
      ...users[userIndex],
      firstName: newFirstName,
      lastName: newLastName,
      username: newFirstName
    };
    
    if (newAvatarBase64) updatedDatabaseUser.avatar = newAvatarBase64;

    users[userIndex] = updatedDatabaseUser;
    localStorage.setItem('ebuy_users', JSON.stringify(users))

    user.value = updatedStoreUser;
    localStorage.setItem('user', JSON.stringify(updatedStoreUser))
  }

  const placeOrder = (cartItems: any[], finalTotal: number) => {
    // Extra safety check
    if (!user.value || cartItems.length === 0) return;
    if (!user.value.orders) user.value.orders = [];

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      totalAmount: finalTotal,
      items: cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail
      })),
      reviewed: false,
    };

    user.value.orders.unshift(newOrder);
    localStorage.setItem('user', JSON.stringify(user.value)); 
    
    const users: User[] = JSON.parse(localStorage.getItem('ebuy_users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.value?.id);
    if (userIndex !== -1) {
      if (!users[userIndex].orders) users[userIndex].orders = [];
      users[userIndex].orders.unshift(newOrder);
      localStorage.setItem('ebuy_users', JSON.stringify(users));
    }
  }

  const addMockOrder = () => {
    if (!user.value) return;
    if (!user.value.orders) user.value.orders = [];

    const mockOrder: Order = {
      id: `ORD-DEMO-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Delivered', 
      totalAmount: 145.00,
      items: [{
        id: 999,
        title: 'Aesthetic Table Lamp',
        price: 145.00,
        quantity: 1,
        thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=500&auto=format&fit=crop'
      }],
      reviewed: false,
    };
    user.value.orders.unshift(mockOrder);
    localStorage.setItem('user', JSON.stringify(user.value)); 
    
    const users: User[] = JSON.parse(localStorage.getItem('ebuy_users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.value?.id);
    if (userIndex !== -1) {
      if (!users[userIndex].orders) users[userIndex].orders = [];
      users[userIndex].orders.unshift(mockOrder);
      localStorage.setItem('ebuy_users', JSON.stringify(users));
    }
  }

  // --- NEW: WISHLIST FUNCTIONS ---
  const toggleWishlist = (product: any) => {
    if (!user.value) return;
    if (!user.value.wishlist) user.value.wishlist = [];

    // Check if item is already in wishlist
    const index = user.value.wishlist.findIndex((p: any) => p.id === product.id);
    
    if (index === -1) {
      user.value.wishlist.push(product); // Add it
    } else {
      user.value.wishlist.splice(index, 1); // Remove it
    }

    // Update active session
    localStorage.setItem('user', JSON.stringify(user.value));

    // Update main database
    const users: User[] = JSON.parse(localStorage.getItem('ebuy_users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.value?.id);
    if (userIndex !== -1) {
      users[userIndex].wishlist = user.value.wishlist;
      localStorage.setItem('ebuy_users', JSON.stringify(users));
    }
  }

  // Check if a specific product is currently favorited by the user
  const isInWishlist = (productId: number) => {
    if (!user.value || !user.value.wishlist) return false;
    return user.value.wishlist.some((p: any) => p.id === productId);
  }

  return { 
    token, 
    user, 
    isAuthenticated, 
    register, 
    login, 
    logout, 
    updateUserDetails, 
    placeOrder, 
    addMockOrder, 
    toggleWishlist, 
    isInWishlist 
  }
})