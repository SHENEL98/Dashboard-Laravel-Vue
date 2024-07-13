import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { userAuthStore } from '../stores/auth.js'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    meta: { requireAuth: true },
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',  
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
      },
      {
        name: 'projects',
        path: 'projects',
        component: () => import('../pages/projects/ProjectsPage.vue'),
      },
      {
        name: 'books',
        path: 'books',
        component: () => import('../pages/books/BooksPage.vue'),
      },
      {
        name: 'roles',
        path: 'roles',
        component: () => import('../pages/roles/RolesPage.vue'),
      },
      {
        name: 'payments',
        path: '/payments',
        component: RouteViewComponent,
        children: [
          {
            name: 'payment-methods',
            path: 'payment-methods',
            component: () => import('../pages/payments/PaymentsPage.vue'),
          },
          {
            name: 'billing',
            path: 'billing',
            component: () => import('../pages/billing/BillingPage.vue'),
          },
          {
            name: 'pricing-plans',
            path: 'pricing-plans',
            component: () => import('../pages/pricing-plans/PricingPlans.vue'),
          },
        ],
      },
      {
        name: 'faq',
        path: '/faq',
        component: () => import('../pages/faq/FaqPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: AuthLayout,
    meta: { isGuest: true },
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
    ]
  },

  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: '404' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = userAuthStore()

  if (to.meta.requireAuth) {
    if (!authStore.authUser) {
      try {
        await authStore.getUser()
        next()
      } catch {
        next({ name: 'login' })
      }
    } else {
      next()
    }
  } else if (to.meta.isGuest && authStore.authUser) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})


export default router
