import { NextFunction, Request, Response } from "express";
import UtilsService from "@/services/utils.service";
import PdfFile from "@/model/pdf.model";

export default class UtilsController {

  static async retrieveFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {    
      const content = await UtilsService.retrievePdf();

      const data = content[0] as PdfFile;
      const texts = (data.data.Pages[0].Texts)
      
      var startY = texts[0].y as number;
      var curY = 0;
      var isHearder = true;
      var headers = [] as string[];
      var lines = [] as string[][];
      var line = [] as string[];

      var counter = 39;

      for (var item of texts) {
        curY = item.y;
        
        if ( curY != startY) {
          console.log("\n\n")
          startY = curY;
          isHearder = false;
          console.log(line)
          // lines.push(line);
          line.splice(0,line.length);
          console.log(line)

        } 

        if (isHearder){
          headers.push(item.R[0].T as string);
        } else {
          console.log("cell:" + item.R[0].T);
          if (item.R[0].T.length != 0) {
            line.push(item.R[0].T as string);
          } else {
            line = [...line, ""];
          }
        }

        counter--;
        if (counter == 0) break;
      };

      // console.log(headers);
      // console.log(headers.length);
      // console.log(lines);

      res.status(200).json({
        status: true,
        statusCode: 200,
        content: data,
      }); 

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