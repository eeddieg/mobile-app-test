import { NextFunction, Request, Response } from "express";
import WpService from "@/services/wp.service";
import path from "path";

export default class WpController {

  static async retrieveContentTest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const endpoint = "";
    const fetchResponse = await WpService.fetchContentTest(endpoint);

    if (fetchResponse == undefined) {
      res.status(200).json({
        status: false,
        statusCode: 200,
        message: "WP server: Cannot reach the server.",
        data: null,
      }); 
    } else {
      if (fetchResponse.status && fetchResponse.res.status === 200) {
        res.status(200).json({
          status: fetchResponse.status,
          statusCode: 200,
          data: fetchResponse.res.data
        }); 
      } else {
        res.status(200).json({
          status: fetchResponse.status,
          statusCode: fetchResponse.res.status,
          message: fetchResponse.message,
          data: fetchResponse.res.data
        }); 
      }
    }
  };
}