import { NextFunction, Request, Response } from "express";
import UtilsService from "@/services/utils.service";

export default class UtilsController {

  static async retrieveFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const filename = await UtilsService.retrieveFilename();
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Test",
        filename
      }); 
      // if (unassigned !== null) {
      //   res.status(200).json({
      //     status: true,
      //     statusCode: 200,
      //     message: "Next Available blockchain address",
      //     unassigned,
      //   }); 
      // } else {
      //   res.status(404).json({
      //     status: false,
      //     statusCode: 404,
      //     message: "No available address. Max limit reached!",
      //   });
      // }
    } catch (error: any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
      // next(createHttpError(error.statusCode, error.message));
    }
  };
}