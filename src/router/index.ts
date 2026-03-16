import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      // The ":id" part makes this URL dynamic!
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
    },
  ],
})

export default router
