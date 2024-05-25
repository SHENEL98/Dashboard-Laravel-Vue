import { defineStore } from 'pinia'
import axios from 'axios'

export const userAuthStore = defineStore('auth', {
  state: () => ({
    authUser: null,
    authErrors: [],
    authStatus: null,
  }),
  getters: {
    user: (state) => state.authUser,
    errors: (state) => state.authErrors,
    status: (state) => state.authStatus,
  },
  actions: {
    async getToken() {
      await axios.get('/sanctum/csrf-cookie')
    },
    async getUser() {
      await this.getToken()
      try {
        const response = await axios.get('/api/user')
        this.authUser = response.data
      } catch {
        this.authUser = null
        throw new Error('Not authenticated')
      }
    },
    async handleLogin(data) {
      this.authErrors = []
      await this.getToken()
      try {
        const response = await axios.post('/login', {
          email: data.email,
          password: data.password,
        })
        await this.getUser()
        return response
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.authErrors = error.response.data.errors
        } else {
          console.error('Store login error:', error)
        }
        throw error
      }
    },
    async handleLogout() {
      await axios.post('/logout')
      this.authUser = null
    }
  }
})
