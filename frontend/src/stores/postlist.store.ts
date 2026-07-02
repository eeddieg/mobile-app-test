import { defineStore } from "pinia"
import Axios from "src/services/api.backend";
import type { MediaItem, WPPost } from "../models/models";

export const postListStore = defineStore("postListStore", {
  persist: true,

  state: () => ({
    carouselUrl: "",
    postListUrl: "",
    carouselData: [] as MediaItem[],
    postData: [] as WPPost[],
  }),

  actions: {
    setCarouselUrl(url: string) {
      this.carouselUrl = url;
    },
    setPostListUrl(url: string) {
      this.postListUrl = url;
    },
    setCarouselData(data:MediaItem[]) {
      this.carouselData = data;
    },
    setPostData(data:WPPost[]) {
      this.postData = data;
    },
    async fetchCarousel() {
      const url = Axios.defaults.baseURL + "/wp" + "/carousel";
      this.setCarouselUrl(url);

      try {
        const res = await Axios.get(url)

        if (res.data.statuscode == 200 && res.data.data.length > 0) {
          this.setCarouselData(res.data.data as MediaItem[]);
        }

        return res.data.data;
      } catch (error) {
        console.error('PostListStore: fetchCarousel failed:', error);
        return null;
      }
    },
    async fetchPosts() {
      const url = Axios.defaults.baseURL + "/wp" + "/posts";
      this.setPostListUrl(url);

      try {
        const res = await Axios.get(url)

        if (res.data.statuscode == 200 && res.data.data.length > 0) {
          this.setPostData(res.data.data as WPPost[]);
        }
        return res.data.data;
      } catch (error) {
        console.error('PostListStore: fetchPosts failed:', error);
        return null;
      }
    },
    async fetchPostsByCategory(slug: string): Promise<unknown[] | null> {
      try {
        const res = await Axios.get(`/wp/posts/category?slug=${encodeURIComponent(slug)}`)
        if (res.data.statusCode === 200 && res.data.data) {
          return res.data.data as unknown[]
        }
        return null
      } catch (e) {
        console.error('fetchPostsByCategory failed:', e)
        return null
      }
    }
  },
  getters: {},

})
