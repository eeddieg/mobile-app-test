import { defineStore } from 'pinia'
import Axios from 'src/services/api.backend'
import type { MediaItem, WPPost, WPPostExtended } from '../models/models'

export const postListStore = defineStore('postListStore', {
  persist: true,
  state: () => ({
    carouselUrl:  '',
    postListUrl:  '',
    carouselData: [] as MediaItem[],
    postData:     [] as WPPost[],
    categoryData: {} as Record<string, { posts: WPPostExtended[]; totalPages: number; ts: number }>,
    lastFetchTs:  0,
  }),
  actions: {
    setCarouselUrl(url: string)      { this.carouselUrl  = url },
    setPostListUrl(url: string)      { this.postListUrl  = url },
    setCarouselData(data: MediaItem[]){ this.carouselData = data },
    setPostData(data: WPPost[])      { this.postData     = data },

    async fetchCarousel(): Promise<MediaItem[] | null> {
      const TTL = 5 * 60 * 1000
      if (this.carouselData.length && Date.now() - this.lastFetchTs < TTL) {
        return this.carouselData
      }
      const url = Axios.defaults.baseURL + '/wp/carousel'
      this.setCarouselUrl(url)
      try {
        const res = await Axios.get(url)
        if (res.data.statusCode === 200 && res.data.data?.length > 0) {
          this.setCarouselData(res.data.data as MediaItem[])
        }
        return res.data.data ?? this.carouselData
      } catch (error) {
        console.error('PostListStore: fetchCarousel failed:', error)
        return this.carouselData.length ? this.carouselData : null
      }
    },

    async fetchPosts(): Promise<WPPostExtended[] | null> {
      const TTL = 5 * 60 * 1000
      if (this.postData.length && Date.now() - this.lastFetchTs < TTL) {
        return this.postData as WPPostExtended[]
      }
      const url = Axios.defaults.baseURL + '/wp/posts'
      this.setPostListUrl(url)
      try {
        const res = await Axios.get(url)
        if (res.data.statusCode === 200 && res.data.data?.length > 0) {
          this.setPostData(res.data.data as WPPost[])
          this.lastFetchTs = Date.now()
        }
        return res.data.data ?? this.postData
      } catch (error) {
        console.error('PostListStore: fetchPosts failed:', error)
        return this.postData.length ? (this.postData as WPPostExtended[]) : null
      }
    },

    async fetchPostsByCategory(
      slug: string,
      page = 1
    ): Promise<{ posts: WPPostExtended[]; totalPages: number } | null> {
      const TTL = 5 * 60 * 1000
      const key = `${slug}:${page}`
      const cached = this.categoryData[key]
      if (cached && Date.now() - cached.ts < TTL) {
        return { posts: cached.posts, totalPages: cached.totalPages }
      }
      try {
        const res = await Axios.get(
          `/wp/posts/category?slug=${encodeURIComponent(slug)}&page=${page}`
        )
        if (res.data.statusCode === 200 && res.data.data) {
          const result = {
            posts:      res.data.data as WPPostExtended[],
            totalPages: res.data.totalPages ?? 1,
          }
          this.categoryData[key] = { ...result, ts: Date.now() }
          return result
        }
        return cached ? { posts: cached.posts, totalPages: cached.totalPages } : null
      } catch (e) {
        console.error('fetchPostsByCategory failed:', e)
        return cached ? { posts: cached.posts, totalPages: cached.totalPages } : null
      }
    }
  },
  getters: {},
})
