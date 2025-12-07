import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as null | { id: number; name: string },
  }),

  actions: {
    login(token: string, user: { id: number; name: string }) {
      this.token = token
      this.user = user
    },
    logout() {
      this.token = ''
      this.user = null
    },
  },

  getters: {
    isAuthenticated(state) {
      return !!state.token
    }
  },

  // Enable persistence
  persist: true
})
