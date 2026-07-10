import env from "@/config/env";
import { NextFunction, Request, Response } from "express";
import WpService from "@/services/wp.service";

export default class WpController {

  static async retrieveContentTest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const endpoint = "";
    const response = await WpService.fetchContentTest(endpoint);

    if (response == undefined) {
      res.status(200).json({
        status: false,
        statusCode: 200,
        message: "WP server: Cannot reach the server.",
        data: null,
      }); 
    } else {
      if (response.status && response.res.status === 200) {
        res.status(200).json({
          status: response.status,
          statusCode: 200,
          data: response.res.data
        }); 
      } else {
        res.status(200).json({
          status: response.status,
          statusCode: response.res.status,
          message: response.message,
          data: response.res.data
        }); 
      }
    }
  };
  
  static async retrieveCarousel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const ids = [1133, 1392, 1129, 1126, 1379]
    const endpoint = "media?include=";
    const response = await WpService.fetchCarousel(endpoint, ids);

    if (response == undefined) {
      res.status(200).json({
        status: false,
        statusCode: 200,
        message: "WP server: Cannot reach the server.",
        data: null,
      }); 
    } else {
      if (response.status && response.res.status === 200) {
        res.status(200).json({
          status: response.status,
          statusCode: 200,
          message: "Carousel retrieved successfully.",
          data: response.res.data
        }); 
      } else {
        res.status(200).json({
          status: response.status,
          statusCode: response.res.status,
          message: response.message,
          data: response.res.data
        }); 
      }
    }
  };

  static async retrieveNavigation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const ids = [1133, 1392, 1129, 1126, 1379]
    const endpoint = "menu-items";
    // const endpoint = "menu-locations";
    // const endpoint = "navigation";
    const response = await WpService.fetchNavigation(endpoint);

    console.log(response);

    if (response == undefined) {
      res.status(200).json({
        status: false,
        statusCode: 200,
        message: "WP server: Cannot reach the server.",
        data: null,
      }); 
    } else {
      if (response.status && response.res.status === 200) {
        res.status(200).json({
          status: response.status,
          statusCode: 200,
          message: "Navigation retrieved successfully.",
          data: response.res.data
        }); 
      } else {
        res.status(200).json({
          status: response.status,
          statusCode: response.res.status,
          message: response.message,
          data: response.res.data
        }); 
      }
    }
  };

  static async retrievePages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const slug = req.query.slug as string | undefined;

    const response = slug
      ? await WpService.fetchPageBySlug(slug)
      : await WpService.fetchPosts("pages");

    if (response == undefined) {
      res.status(200).json({
        status: false,
        statusCode: 200,
        message: "WP server: Cannot reach the server.",
        data: null,
      });
      return;
    }

    if (response.status && response.res.status === 200) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: slug ? "Page retrieved successfully." : "Pages retrieved successfully.",
        data: response.res.data,
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: response.res?.status ?? 500,
        message: response.message,
        data: response.res?.data ?? null,
      });
    }
  }

  static async retrievePageById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid page ID.",
        data: null,
      });
      return;
    }

    const response = await WpService.fetchPageById(id);

    if (response == undefined) {
      res.status(200).json({
        status: false,
        statusCode: 200,
        message: "WP server: Cannot reach the server.",
        data: null,
      });
      return;
    }

    if (response.status && response.res.status === 200) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Page retrieved successfully.",
        data: response.res.data,
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: response.res?.status ?? 500,
        message: response.message,
        data: response.res?.data ?? null,
      });
    }
  }

  static async retrievePosts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const endpoint = "posts";
    const response = await WpService.fetchPosts(endpoint);

    if (response == undefined) {
      res.status(200).json({
        status: false,
        statusCode: 200,
        message: "WP server: Cannot reach the server.",
        data: null,
      }); 
    } else {
      if (response.status && response.res.status === 200) {
        res.status(200).json({
          status: response.status,
          statusCode: 200,
          message: "Posts retrieved successfully.",
          data: response.res.data
        }); 
      } else {
        res.status(200).json({
          status: response.status,
          statusCode: response.res.status,
          message: response.message,
          data: response.res.data
        }); 
      }
    }
  };

  static async retrieveMedia(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const url = req.query.url as string | undefined

    if (!url) {
      res.status(400).json({ status: false, statusCode: 400, message: 'Missing url parameter', data: null })
      return
    }

    const decoded  = decodeURIComponent(url)
    const filename = decoded.split('/').pop() ?? ''

    if (!filename) {
      res.status(400).json({ status: false, statusCode: 400, message: 'Could not extract filename', data: null })
      return
    }

    const response = await WpService.fetchMediaCandidates(filename)

    if (response == undefined) {
      res.status(200).json({
        status: false,
        statusCode: 200,
        message: 'WP server: Cannot reach the server.',
        data: null,
      })
      return
    }

    if (response.status && response.res.status === 200) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: 'Media retrieved successfully.',
        data: response.res.data,
      })
    } else {
      res.status(200).json({
        status: false,
        statusCode: response.res.status,
        message: response.message,
        data: null,
      })
    }
  }

  static async retrieveStyle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    const styleMap: Record<string, string[]> = {
      'dashicons.min.css': [
        `${env.WP_SITE}/wp-includes/css/dashicons.min.css`,
      ],
      'astra.min.css': [
        `${env.WP_SITE}/wp-content/themes/astra/assets/css/minified/style.min.css`,
        `${env.WP_SITE}/wp-content/themes/astra/style.css`,
      ],
      'uagb-style.css': [
        `${env.WP_SITE}/wp-content/plugins/ultimate-addons-for-gutenberg/assets/css/uagb-style.css`,
        `${env.WP_SITE}/wp-content/plugins/ultimate-addons-for-gutenberg/assets/css/uagb-style.min.css`,
        `${env.WP_SITE}/wp-content/plugins/ultimate-addons-for-gutenberg/dist/blocks.style.build.css`,
      ],
    }

    const file = req.params.file as string
    const candidates = styleMap[file]

    if (!candidates) {
      res.status(404).json({ status: false, message: 'Style not found' })
      return
    }

    for (const url of candidates) {
      const response = await WpService.fetchStyle(url)
      if (response.status && response.res.status === 200) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8')
        res.setHeader('Cache-Control', 'public, max-age=86400')
        res.send(response.res.data)
        return
      }
      console.log('[retrieveStyle] failed:', url)
    }

    res.status(404).json({ status: false, message: 'Style not found at any candidate path' })
  }

  static async retrieveRenderedPage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const path = req.query.path as string | undefined

    if (!path) {
      res.status(400).json({ status: false, message: 'Missing path parameter' })
      return
    }

    const response = await WpService.fetchRenderedPage(path)

    if (!response.status) {
      res.status(200).json({ status: false, statusCode: 200, message: response.message, data: null })
      return
    }

    if (response.res.status === 200) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'public, max-age=300')
      res.send(response.res.data)
    } else {
      res.status(200).json({ status: false, statusCode: response.res.status, message: 'Failed', data: null })
    }
  }

  static async retrieveCleanPage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const url = req.query.url as string | undefined

    if (!url) {
      res.status(400).json({ status: false, message: 'Missing url parameter' })
      return
    }

    const response = await WpService.fetchCleanPage(url)

    if (!response.status) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.status(200).send(WpController.notFoundPage(url))
      return
    }

    const rawHtml = response.res.data as string

    // Extract <title> for the frontend to use
    const titleMatch = rawHtml.match(/<title[^>]*>([^<]+)<\/title>/i)
    const pageTitle  = titleMatch?.[1]
      ?.replace(/\s*[-|]\s*.*$/, '')  // strip " - Site Name" suffix
      ?.trim() ?? ''

    // Send title as custom header so frontend can read it
    res.setHeader('X-Page-Title', encodeURIComponent(pageTitle))
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=300')
    res.send(WpController.extractMainContent(rawHtml))
  }

  static notFoundPage(url: string): string {
    return `<!DOCTYPE html>
            <html lang="el">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background: #f5f5f5;
                  padding: 24px;
                  text-align: center;
                  color: #333;
                }
                .icon { font-size: 64px; margin-bottom: 16px; }
                h2 { font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #1976d2; }
                p  { font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 16px; }
                a  { color: #1976d2; font-size: 13px; word-break: break-all; }
              </style>
            </head>
            <body>
              <div class="icon">🔍</div>
              <h2>Η σελίδα δεν βρέθηκε</h2>
              <p>Ο σύνδεσμος που ακολουθήσατε δεν είναι πλέον διαθέσιμος ή έχει μετακινηθεί.</p>
            </body>
            </html>`
  }

  static extractMainContent(html: string): string {
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
    if (mainMatch?.[1]) {
      return WpController.wrapContent(WpController.cleanExtractedContent(mainMatch[1]))
    }

    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
    if (articleMatch?.[1]) {
      return WpController.wrapContent(WpController.cleanExtractedContent(articleMatch[1]))
    }

    const entryMatch = html.match(/<div[^>]*class="[^"]*(?:entry-content|post-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
    if (entryMatch?.[1]) {
      return WpController.wrapContent(WpController.cleanExtractedContent(entryMatch[1]))
    }

    return WpController.wrapContent(WpController.cleanExtractedContent(html
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
    ))
  }

  static wrapContent(content: string): string {
    return `<!DOCTYPE html>
            <html lang="el">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * { box-sizing: border-box; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  font-size: 15px;
                  line-height: 1.6;
                  color: #333;
                  padding: 16px;
                  margin: 0;
                  background: #fff;
                }
                img { max-width: 100% !important; height: auto !important; }
                a { color: #1976d2; }
                h1, h2, h3 { line-height: 1.3; }
                input, form, .search-form, .search-field { display: none !important; }

                svg { width: 1.1em; height: 1.1em; vertical-align: middle; }

                .entry-meta { font-size: 12px; color: #888; margin-bottom: 8px; }

                .wp-block-uagb-container { margin-bottom: 12px; }

                .wp-block-uagb-advanced-heading .uagb-heading-text,
                h1.uagb-heading-text {
                  font-size: clamp(1.1rem, 4vw, 1.6rem);
                  font-weight: 700;
                  margin-bottom: 4px;
                }
                .uagb-desc-text { font-size: 14px; color: #555; margin: 0 0 8px; }
                .uagb-separator { width: 48px; height: 3px; background: #1976d2; margin: 8px 0; border-radius: 2px; }

                .wp-block-uagb-icon-list__wrap {
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                  margin: 12px 0;
                }
                .wp-block-uagb-icon-list-child { display: flex; align-items: center; gap: 8px; }
                .uagb-icon-list__source-wrap svg { width: 18px; height: 18px; fill: #1976d2; }
                .uagb-icon-list__label { font-size: 14px; }

                .wp-block-uagb-faq .uagb-question { font-size: 15px; font-weight: 600; margin: 16px 0 4px; }
                .wp-block-uagb-faq .uagb-faq-questions-button svg { width: 14px; height: 14px; }
                .uagb-faq-content p { font-size: 14px; line-height: 1.7; margin: 0 0 8px; }

                .wp-block-uagb-image__figure:empty { display: none; }
                figure img { max-width: 100%; border-radius: 8px; display: block; margin: 0 auto; }
              </style>
            </head>
            <body>
              ${content}
            </body>
            </html>`
    }

  static async retrievePostsByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const slug = req.query.slug as string | undefined
    const page = parseInt(req.query.page as string ?? '1', 10)

    console.log('[retrievePostsByCategory] slug:', slug, 'page:', page)


    if (!slug) {
      res.status(400).json({ status: false, message: 'Missing slug parameter' })
      return
    }

    const response = await WpService.fetchPostsByCategory(slug, page)

    if (!response?.status) {
      res.status(200).json({ status: false, statusCode: 200, message: response?.message, data: null })
      return
    }

    if (response.res.status === 200) {
      res.status(200).json({
        status:     true,
        statusCode: 200,
        message:    'Posts retrieved successfully.',
        data:       response.res.data,
        totalPages: response.totalPages,
        total:      response.total,
      })
    } else {
      res.status(200).json({ status: false, statusCode: response.res.status, message: 'Failed', data: null })
    }
  }

  /**
   * Removes the first element matching tagName+class, including all nested
   * content, correctly handling nested elements of the same tag name.
   * Plain regex can't do this safely since these blocks contain nested <div>s.
  */
  static stripElementBlock(html: string, tagName: string, classNeedle: string): string {
    const openTagRe = new RegExp(`<${tagName}[^>]*class=["'][^"']*${classNeedle}[^"']*["'][^>]*>`, 'i')
    const startMatch = openTagRe.exec(html)
    if (!startMatch) return html

    const startIdx      = startMatch.index
    const afterOpenIdx  = startIdx + startMatch[0].length

    const openRe  = new RegExp(`<${tagName}\\b`, 'gi')
    const closeRe = new RegExp(`<\\/${tagName}>`, 'gi')

    const tagEvents: { idx: number; isOpen: boolean }[] = []
    let m: RegExpExecArray | null

    openRe.lastIndex = afterOpenIdx
    while ((m = openRe.exec(html))) tagEvents.push({ idx: m.index, isOpen: true })

    closeRe.lastIndex = afterOpenIdx
    while ((m = closeRe.exec(html))) tagEvents.push({ idx: m.index, isOpen: false })

    tagEvents.sort((a, b) => a.idx - b.idx)

    let depth  = 1 // already inside the opening tag we matched
    let endIdx = -1

    for (const t of tagEvents) {
      depth += t.isOpen ? 1 : -1
      if (depth === 0) {
        endIdx = t.idx + `</${tagName}>`.length
        break
      }
    }

    if (endIdx === -1) return html // malformed/unbalanced — bail out safely
    return html.slice(0, startIdx) + html.slice(endIdx)
  }

  static cleanExtractedContent(html: string): string {
    let cleaned = html
    cleaned = WpController.stripElementBlock(cleaned, 'div', 'ast-single-related-posts-container')
    cleaned = WpController.stripElementBlock(cleaned, 'div', 'heateor_sss_sharing_container')
    cleaned = cleaned.replace(/<div class=['"]heateorSssClear['"]><\/div>/gi, '')
    return cleaned
  }

}