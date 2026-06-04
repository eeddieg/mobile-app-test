import { defineStore } from "pinia"
import Axios from "src/services/api.backend";

export const scheduleStore = defineStore("scheduleStore", {
  persist: true,

  state: () => ({
    url: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scheduleData: [] as any[]
  }),

  actions: {
    async getScheduleData() {
      if (this.scheduleData.length == 0) {
        await this.fetchSchedule();
      }
      else if (this.scheduleData.length > 0) {
      return this.scheduleData;
      }
    },
    setUrl(url: string) {
      this.url = url;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setScheduleData(data:any) {
      this.scheduleData = data;
    },
    async fetchSchedule() {
      const url = Axios.defaults.baseURL + "/utils/get-pdf-file";
      this.setUrl(url);
      try {
        const res = await Axios.get(url)

        if (res.data.status) {
          const data = this.normalizeTimes(res.data.data)
          this.setScheduleData(data)
        }
        return res.data;
      } catch (error) {
        console.error('getPdfFile failed:', error);
        return null;
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normalizeTimes(data: any[]) {
      return data.map((row) => {
        const timeStr = row['ΩΡΕΣ'];
        if (!timeStr) return row;

        // Split multiple ranges by space
        const ranges = timeStr.split(/\s+/).filter(Boolean);

        const formattedRanges = ranges.map((range: string) => {
          const [start, end] = range.split('-');

          const formatTime = (t: string) => {
            if (!t) return '';
            // Remove non-digits
            t = t.replace(/\D/g, '');
            if (t.length === 1 || t.length === 2) return t.padStart(2, '0') + ':00';
            if (t.length === 3) return '0' + t[0] + ':' + t.slice(1);
            if (t.length === 4) return t.slice(0, 2) + ':' + t.slice(2);
            return t; // fallback
          };

          return `${formatTime(start as string)}-${formatTime(end as string)}`;
        });

        return { ...row, 'ΩΡΕΣ': formattedRanges.join(', ') };
      });
    }
  },
  getters: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getUrl: (state: any): string => state.url
  },

})
