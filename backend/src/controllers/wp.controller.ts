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

  static async retrievePostsByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const slug = req.query.slug as string | undefined

    if (!slug) {
      res.status(400).json({ status: false, message: 'Missing slug parameter' })
      return
    }

    const response = await WpService.fetchPostsByCategory(slug)

    if (!response?.status) {
      res.status(200).json({ status: false, statusCode: 200, message: response?.message, data: null })
      return
    }

    if (response.res.status === 200) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: 'Posts retrieved successfully.',
        data: response.res.data,
      })
    } else {
      res.status(200).json({ status: false, statusCode: response.res.status, message: 'Failed', data: null })
    }
  }

}