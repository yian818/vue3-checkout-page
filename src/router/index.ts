import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import CheckoutPage from '@/components/CheckoutPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Checkout',
    component: CheckoutPage
  },
  {
    path: '/checkout',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
