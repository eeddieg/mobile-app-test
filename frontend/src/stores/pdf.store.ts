import { defineStore } from "pinia"
import Axios from "src/services/api.backend";

export const pdfStore = defineStore("pdfStore", {
  persist: true,

  state: () => ({
    url: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdfData: [] as any[]
  }),

  actions: {
    setUrl(url: string) {
      this.url = url;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPdfData(data:any) {
      this.pdfData = []
      this.pdfData = data;
    },
    async getPdfFile() {
      const url = Axios.defaults.baseURL + "/utils/get-pdf-file";
      this.setUrl(url);
      try {
        const res = await Axios.get(url)

        if (res.data.status) {
          const data = this.normalizeTimes(res.data.data)
          this.setPdfData(data)
        }
        return res.data;
      } catch (error) {
        console.error(error);
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
