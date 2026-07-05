import { defineStore } from 'pinia'
import Axios from 'src/services/api.backend'
import type { WpPage } from 'src/models/models'

export const wpPageStore = defineStore('wpPageStore', {
  persist: true,
  state: () => ({
    cache: {} as Record<string, WpPage>,
  }),
  actions: {
    async fetchById(id: number): Promise<WpPage | null> {
      const key = `id_${id}`
      if (this.cache[key]) return this.cache[key]

      try {
        const res = await Axios.get(`/wp/pages/${id}`)
        if (res.data.statusCode === 200 && res.data.data) {
          this.cache[key] = res.data.data as WpPage
          return this.cache[key]
        }
        return null
      } catch (e) {
        console.error('wpPageStore.fetchById failed:', e)
        return null
      }
    },

    async fetchBySlug(wpSlug: string): Promise<WpPage | null> {
      const key = `slug_${wpSlug}`
      if (this.cache[key]) return this.cache[key]

      try {
        const res = await Axios.get(`/wp/pages?slug=${encodeURIComponent(wpSlug)}`)
        if (res.data.statusCode === 200 && res.data.data) {
          const page: WpPage = Array.isArray(res.data.data)
            ? res.data.data[0]
            : res.data.data
          if (page) {
            this.cache[key] = page
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
