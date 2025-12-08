import { defineStore } from "pinia";

export const screenStore = defineStore("screenStore", {
  persist: true,

  state: () => ({
    isDesktop: false,
    isMobile: false,
    screenWidth: 0,
  }),

  actions: {
    setDesktopStatus(state: boolean) {
      this.isDesktop = state;
    },
    setMobileStatus(state: boolean) {
      this.isMobile = state;
    },
    setScreenWidth(width: number) {
      this.screenWidth = width;
    },

    detectDevice() {
      const width = window.innerWidth;
      this.screenWidth = width;
      this.isMobile = width < 768;
      this.isDesktop = width >= 768;
    },

    updateScreenWidth: function (this: void) {
      const store = screenStore();
      store.screenWidth = window.innerWidth;
      store.isMobile = window.innerWidth < 768;
      store.isDesktop = window.innerWidth >= 768;
    }
  }
});
