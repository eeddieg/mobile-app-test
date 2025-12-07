import { defineStore } from "pinia"
import { useQuasar } from "quasar"

export const screenStore = defineStore("screenStore", {
  persist: true,

  state: () => ({
    isDesktop: false,
    isMobile: false,
    screenSize: {},
  }),

  actions: {
    setDesktopStatus(state: boolean) {
      this.isDesktop = state;
    },
    setMobileStatus(state: boolean) {
      this.isMobile = state;
    },
    setScreenSize(sizeObject: object) {
      this.screenSize = {};
      this.screenSize = sizeObject;
    },
    detectDevice() {
      const $q = useQuasar();

      const sizeObject = {
        qt: $q.screen.gt,
        lt: $q.screen.lt,
      }

      // console.log("DESKTOP: ", $q.platform.is.desktop);
      // console.log("MOBILE: ", $q.platform.is.mobile);
      // console.log("ScreenSize: ", sizeObject);

      if ($q.platform.is.mobile) {
        this.setDesktopStatus(false);
        this.setMobileStatus(true);

      }
      if ($q.platform.is.desktop) {
        this.setDesktopStatus(true);
        this.setMobileStatus(false);
      }
      this.setScreenSize(sizeObject);
    },
  },

  getters: {},

})
