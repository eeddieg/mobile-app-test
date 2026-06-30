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
  },
})










// import { defineStore } from 'pinia'
// import Axios from 'src/services/api.backend'
// import type { WpPage } from 'src/models/models'

// export const wpPageStore = defineStore('wpPageStore', {
//   persist: true,
//   state: () => ({
//     cache: {} as Record<string, WpPage>,
//   }),
//   actions: {
//     async fetchBySlug(wpSlug: string): Promise<WpPage | null> {
//       if (this.cache[wpSlug]) return this.cache[wpSlug]
//       try {
//         // Your Express endpoint needs to support ?slug=
//         const res = await Axios.get(`/wp/pages?slug=${wpSlug}`)
//         const data = res.data?.data
//         const page: WpPage = Array.isArray(data) ? data[0] : data
//         if (page) {
//           this.cache[wpSlug] = page
//           return page
//         }
//         return null
//       } catch (e) {
//         console.error('wpPageStore: fetchBySlug failed', e)
//         return null
//       }
//     },
//     async fetchById(id: number): Promise<WpPage | null> {
//       const cacheKey = `id_${id}`
//       if (this.cache[cacheKey]) return this.cache[cacheKey]
//       try {
//         const res = await Axios.get(`/wp/pages/${id}`)
//         const page: WpPage = res.data?.data
//         if (page) {
//           this.cache[cacheKey] = page
//           return page
//         }
//         return null
//       } catch (e) {
//         console.error('wpPageStore: fetchById failed', e)
//         return null
//       }
//     },
//   },
// })
