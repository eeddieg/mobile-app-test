import { NextFunction, Request, Response } from "express";
import PdfService from "@/services/pdf.service";
import path from "path";

export default class UtilsController {

  static async retrieveFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const fetchResponse = await PdfService.retrievePdf();     

    if (!fetchResponse.status) {
      res.status(424).json({
        status: fetchResponse.status,
        statusCode: 424,
        message: fetchResponse.message,
        error: fetchResponse.error,          
      }); 
    } else {

      const filepath = fetchResponse.filepath as string;
      const extractResponse = await PdfService.extractPdf(filepath);
      
      const folderpath = path.dirname(filepath);
      // PdfService.deleteDownloadFolder(folderpath);

      if (extractResponse == undefined) {
        res.status(200).json({
          status: false,
          statusCode: 200,
          message: "An error occured. PDF file cannot be parsed.",
          data: null,
        }); 
      } else {
        if (extractResponse.status) {
          res.status(200).json({
            status: extractResponse.status,
            statusCode: 200,
            data: extractResponse.data
          }); 
        } else {
          res.status(200).json({
            status: extractResponse.status,
            statusCode: 200,
            message: extractResponse.message,
            data: extractResponse.data
          }); 
        }
      }

    }
  };
}