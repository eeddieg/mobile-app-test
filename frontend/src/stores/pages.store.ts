import { defineStore } from "pinia"
import Axios from "src/services/api.backend";

export const pagesStore = defineStore("pagesStore", {
  persist: true,

  state: () => ({
    pagesUrl: "",
    pagesData: [] as unknown[],
  }),

  actions: {
    setPagesUrl(url: string) {
      this.pagesUrl = url;
    },
    setPagesData(data: unknown[]) {
      this.pagesData = data;
    },
    async fetchPages() {
      const url = Axios.defaults.baseURL + "/wp" + "/pages";
      this.setPagesUrl(url);

      try {
        const res = await Axios.get(url)

        if (res.data.statuscode == 200 && res.data.data.length > 0) {
          this.setPagesData(res.data.data as unknown[]);
        }

        return res.data.data;
      } catch (error) {
        console.error('pagesStore: fetchPages failed:', error);
        return null;
      }
    },

  },
  getters: {},

})
