import Axios from "src/services/api.backend";
import { Module, VuexModule } from "vuex-module-decorators";

@Module
export default class PdfStoreModule extends VuexModule {

  async fetchPdfFile() {
    const pdfUrl = Axios.defaults.baseURL + "utils/" + "get-pdf-file";
    try {
      const data = await Axios.get(pdfUrl);

      console.log(data);

    } catch (error) {
      console.log("pdfStore")
      console.log(error)
    }
  };
};

