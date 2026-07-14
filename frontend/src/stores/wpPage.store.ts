import { defineStore } from 'pinia'
import Axios from 'src/services/api.backend'
import type { WpPage } from 'src/models/models'

export const wpPageStore = defineStore('wpPageStore', {
  persist: true,
  state: () => ({
    cache: {} as Record<string, { data: WpPage; ts: number }>,
  }),
  actions: {
    async fetchById(id: number): Promise<WpPage | null> {
      const key = `id_${id}`
      const CACHE_TTL = 5 * 60 * 1000 // 5 min
      const cached = this.cache[key]
      if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data

      try {
        const res = await Axios.get(`/wp/pages/${id}`)
        if (res.data.statusCode === 200 && res.data.data) {
          this.cache[key] = { data: res.data.data as WpPage, ts: Date.now() }
          return this.cache[key].data
        }
        return cached?.data ?? null
      } catch (e) {
        console.error('wpPageStore.fetchById failed:', e)
        return cached?.data ?? null
      }
    },

    async fetchBySlug(wpSlug: string): Promise<WpPage | null> {
      const key = `slug_${wpSlug}`
      const CACHE_TTL = 5 * 60 * 1000 // 5 min
      const cached = this.cache[key]
      if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data

      try {
        const res = await Axios.get(`/wp/pages?slug=${encodeURIComponent(wpSlug)}`)
        if (res.data.statusCode === 200 && res.data.data) {
          const page: WpPage = Array.isArray(res.data.data)
            ? res.data.data[0]
            : res.data.data
          if (page) {
            this.cache[key] = { data: page, ts: Date.now() }
            return page
          }
        }
        return null
      } catch (e) {
        console.error('wpPageStore.fetchBySlug failed:', e)
        return null
      }
    },
    async fetchCleanPage(url: string): Promise<{ html: string; title: string } | null> {
      try {
        const res = await Axios.get(`/wp/clean-page?url=${encodeURIComponent(url)}`, {
          responseType: 'text',
        })
        const title = decodeURIComponent(res.headers['x-page-title'] ?? '')
        return {
          html:  res.data as string,
          title: title || 'Ιστοσελίδα',
        }
      } catch (e) {
        console.error('fetchCleanPage failed:', e)
        return null
      }
    }

  },
})
