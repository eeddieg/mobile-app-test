import env from "@/config/env";
import { wpApi, wpApiContents } from "./wp.backend"

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

  static async fetchCarousel(endpoint: string, ids: number[]): Promise<any> {    
    try {
      const url = wpApi.defaults.baseURL + "/" + endpoint + ids.join(",");
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

  static async fetchNavigation(endpoint: string): Promise<any> {    
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

  static async fetchPages(endpoint: string): Promise<any> {    
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

  static async fetchPosts(endpoint: string): Promise<any> {    
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

  static async fetchPageBySlug(slug: string): Promise<any> {
    try {
      // WP REST API: /wp-json/wp/v2/pages?slug=<encoded-slug>
      const url = wpApi.defaults.baseURL + "/pages?slug=" + encodeURIComponent(slug);
      const res = await wpApi.get(url);
      return { status: true, res };
    } catch (error: any) {
      return {
        status: false,
        message: "Error while trying to contact WP server.",
        error,
      };
    }
  }

  static async fetchPageById(id: number): Promise<any> {
    try {
      const url = wpApi.defaults.baseURL + "/pages/" + id;
      const res = await wpApi.get(url);
      return { status: true, res };
    } catch (error: any) {
      return {
        status: false,
        message: "Error while trying to contact WP server.",
        error,
      };
    }
  }

  static async fetchMediaByFilename(filename: string): Promise<any> {
    try {
      const url = wpApiContents.defaults.baseURL + '/media?search=' + encodeURIComponent(filename)
      const res = await wpApiContents.get(url)
      return { status: true, res }
    } catch (error: any) {
      return {
        status: false,
        message: 'Error fetching media',
        error,
      }
    }
  }

}
