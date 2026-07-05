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

  // static async retrievePages(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const endpoint = "pages";
  //   const response = await WpService.fetchPosts(endpoint);

  //   if (response == undefined) {
  //     res.status(200).json({
  //       status: false,
  //       statusCode: 200,
  //       message: "WP server: Cannot reach the server.",
  //       data: null,
  //     }); 
  //   } else {
  //     if (response.status && response.res.status === 200) {
  //       res.status(200).json({
  //         status: response.status,
  //         statusCode: 200,
  //         message: "Pages retrieved successfully.",
  //         data: response.res.data
  //       }); 
  //     } else {
  //       res.status(200).json({
  //         status: response.status,
  //         statusCode: response.res.status,
  //         message: response.message,
  //         data: response.res.data
  //       }); 
  //     }
  //   }
  // };

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
              <a href="${url}" target="_blank">↗ Άνοιγμα στο browser</a>
            </body>
            </html>`
  }

  static extractMainContent(html: string): string {
    // Try <main>...</main>
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
    if (mainMatch?.[1]) {
      return WpController.wrapContent(mainMatch[1])
    }

    // Try <article>...</article>
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
    if (articleMatch?.[1]) {
      return WpController.wrapContent(articleMatch[1])
    }

    // Try div with class entry-content or post-content
    const entryMatch = html.match(/<div[^>]*class="[^"]*(?:entry-content|post-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
    if (entryMatch?.[1]) {
      return WpController.wrapContent(entryMatch[1])
    }

    // Fallback — return stripped version
    return WpController.wrapContent(html
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
    )
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

}