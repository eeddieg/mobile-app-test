import wpApi from "./wp.backend";

export default class WpService {
  static async fetchContentTest(endpoint: string): Promise<any> {    
    try {
      const url = wpApi.defaults.baseURL + "/" + endpoint;

      const res = await wpApi.get(url)
      
      return new Promise((resolve) => {
        resolve({
          status: true,
          res
        });
      });
    } catch (error: any) {
      return new Promise((reject) => {
        reject({
          status: false,
          message: "Error while trying to contant WP server.",
          error,
        });
      });
    }
  }
}
