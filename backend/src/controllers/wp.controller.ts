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
    let url = req.query.url as string

    if (url.length == 0) {
      url = env.WP_CONTENTS as string
    }

    if (!url) {
      res.status(400).json({ status: false, message: 'Missing url parameter' })
      return
    }

    const filename = decodeURIComponent(url).split('/').pop() ?? ''

    if (!filename) {
      res.status(400).json({ status: false, message: 'Could not extract filename from url' })
      return
    }

    const response = await WpService.fetchMediaByFilename(filename)

    if (!response.status) {
      res.status(200).json({ status: false, statusCode: 200, message: response.message, data: null })
      return
    }

    if (response.res.status === 200 && response.res.data?.length > 0) {
      const mediaItem = response.res.data[0]
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: 'Media retrieved successfully.',
        data: {
          source_url: mediaItem.source_url,
          media_type: mediaItem.media_type,
          mime_type: mediaItem.mime_type,
        }
      })
    } else {
      res.status(200).json({ status: false, statusCode: 404, message: 'Media not found', data: null })
    }
  }


}