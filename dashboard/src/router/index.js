import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/Home.vue')
  },
  {
    path: '/dashboard/apps',
    name: 'Apps',
    component: () => import('../views/dashboard/Apps.vue')
  },
  {
    path: '/dashboard/apps/:id',
    name: 'ViewApp',
    component: () => import('../views/dashboard/ViewApp.vue')
  },
  {
    path: '/dashboard/logout',
    name: 'Logout',
    component: () => import('../views/dashboard/Logout.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
