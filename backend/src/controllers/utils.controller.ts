import { NextFunction, Request, Response } from "express";
import PdfService from "@/services/pdf.service";
// import PdfFile from "@/model/pdf.model";

export default class UtilsController {

  static async retrieveFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const results = await PdfService.extractPdf();

      if (!results.status) {
        throw new Error("Can not read Shedule PDF File.")
      } else {

        res.status(200).json({
          status: results.status,
          statusCode: 200,
          content: results,
        }); 
      }

    } catch (error: any) {
      res.status(error.statusCode).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 

    }
  };
}