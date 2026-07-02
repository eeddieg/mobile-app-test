import axios from "axios";
import env from "@/config/env";
import { wpApi, wpApiContents, wpApiStyles } from "./wp.backend"

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
      const decoded = decodeURIComponent(filename)
      const noExt   = decoded.replace(/\.[^.]+$/, '')
      const slug    = noExt.toLowerCase().replace(/\s+/g, '-')

      console.log('[fetchMediaByFilename] decoded:', decoded)
      console.log('[fetchMediaByFilename] slug:', slug)

      const [slugRes, searchRes] = await Promise.all([
        wpApi.get(wpApi.defaults.baseURL + '/media?slug='   + encodeURIComponent(slug)),
        wpApi.get(wpApi.defaults.baseURL + '/media?search=' + encodeURIComponent(decoded)),
      ])

      const slugData   = slugRes.data   as unknown[]
      const searchData = searchRes.data as unknown[]

      console.log('[fetchMediaByFilename] slug results:',   slugData?.length)
      console.log('[fetchMediaByFilename] search results:', searchData?.length)

      const data = slugData?.length ? slugData : searchData

      return { status: true, res: { status: 200, data } }
    } catch (error: any) {
      return {
        status: false,
        message: 'Error fetching media',
        error,
      }
    }
  }

  static async fetchPageHtml(wpUrl: string): Promise<any> {
    try {
      const res = await wpApi.get(wpUrl, {
        headers: { 'Accept': 'text/html' },
        responseType: 'text'
      })
      return { status: true, res }
    } catch (error: any) {
      return { status: false, message: 'Error fetching page HTML', error }
    }
  }

  static async fetchMediaCandidates(filename: string): Promise<any> {
    const wpBase     = wpApiContents.defaults.baseURL!
    const decoded    = decodeURIComponent(filename)

    const deduped = WpService.dedupFilename(decoded)

    const candidates = [
      `${wpBase}/${decoded}`,
      `${wpBase}/${deduped}`,
      `${wpBase}/${encodeURIComponent(decoded)}`,
      `${wpBase}/${encodeURIComponent(deduped)}`,
      `${wpBase}/${decoded.normalize('NFC')}`,
      `${wpBase}/${deduped.normalize('NFC')}`,
    ]

    const headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      'Referer':    wpBase,
      'Accept':     'image/*',
    }

    for (const candidate of candidates) {
      try {
        console.log('[fetchMediaCandidates] trying:', candidate)
        const res = await wpApiContents.head(candidate, { headers, timeout: 4000 })
        if (res.status >= 200 && res.status < 400) {
          console.log('[fetchMediaCandidates] found:', candidate)
          return {
            status: true,
            res: {
              status: 200,
              data: {
                source_url: candidate,
                media_type: 'image',
                mime_type:  res.headers['content-type'] ?? 'image/jpeg',
              }
            }
          }
        }
      } catch (e: any) {
        console.log('[fetchMediaCandidates] failed:', candidate, e?.response?.status ?? e?.code)
      }
    }

    return {
      status: false,
      res:    { status: 404, data: null },
      message: 'No working URL found for media.',
    }
  }

  static dedupFilename(filename: string): string {
    const ext      = filename.includes('.') ? '.' + filename.split('.').pop() : ''
    const noExt    = ext ? filename.slice(0, -ext.length) : filename
    const dashIdx  = noExt.indexOf('-')

    if (dashIdx === -1) return filename

    const beforeDash = noExt.slice(0, dashIdx)
    const afterDash  = noExt.slice(dashIdx)

    const half = Math.floor(beforeDash.length / 2)
    for (let i = 1; i <= half; i++) {
      const first  = beforeDash.slice(0, i)
      const rest   = beforeDash.slice(i)
      if (rest === first || rest.startsWith(first)) {
        const deduped = first + afterDash + ext
        console.log('[dedupFilename]', filename, '→', deduped)
        return deduped
      }
    }

    return filename
  }

  static async fetchStyle(url: string): Promise<any> {
    try {
      // const res = await wpApiStyles.get(url, { responseType: 'text' })
      const res = await axios.get(url, { responseType: 'text' })
      return { status: true, res }
    } catch (error: any) {
      return { status: false, message: 'Style fetch failed', error }
    }
  }
  
  static async fetchRenderedPage(path: string): Promise<any> {
    try {
      const url = `${env.WP_SITE}/${path}`
      const res = await axios.get(url, {
        responseType: 'text',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        }
      })
      return { status: true, res }
    } catch (error: any) {
      return { status: false, message: 'Page fetch failed', error }
    }
  }

  static async fetchPostsByCategory(slug: string): Promise<any> {
    try {
      // First get the category ID from slug
      const catUrl = `${wpApi.defaults.baseURL}/categories?slug=${encodeURIComponent(slug)}`
      const catRes = await wpApi.get(catUrl)
      const categories = catRes.data as Array<{ id: number }>

      if (!categories.length) {
        return { status: false, message: 'Category not found' }
      }

      const categoryId = categories[0]?.id
      const postsUrl   = `${wpApi.defaults.baseURL}/posts?categories=${categoryId}&per_page=20`
      const postsRes   = await wpApi.get(postsUrl)

      return { status: true, res: postsRes }
    } catch (error: any) {
      return { status: false, message: 'Error fetching posts by category', error }
    }
  }
  
}
