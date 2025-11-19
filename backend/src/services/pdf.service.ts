import { Response } from 'express';

import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import env from "@/config/env";
import Color from "@/config/color.cli";
import axios from "axios";

export default class PdfService {
  
  // static resetDownloadFolder(folderPath: string) {
  //   try {
  //     if (fs.existsSync(folderPath)) {
  //       const res = fs.rmSync(folderPath, { recursive: true })
  //       if (res == undefined) {
  //         fs.mkdirSync(folderPath, { recursive: true });
  //         return {
  //           status: true,
  //           message: "Folder reset successfully."
  //         }
  //       } else {
  //         return {
  //           status: false,
  //           message: "Folder can not be reset."
  //         }
  //       }
  //     } else {
  //         fs.mkdirSync(folderPath, { recursive: true });
  //         return {
  //           status: true,
  //           message: "Folder reset successfully."
  //         }
  //     }
  //   } catch (error) {
  //     const folderName = path.dirname(folderPath);
  //     return {
  //       status: false,
  //       message: `Error in deleting folder ${folderName}`,
  //       error
  //     }
  //   }
  // }

    static createDownloadFolder(folderPath: string) {
    try {
      if (fs.existsSync(folderPath)) {
        const res = fs.rmSync(folderPath, { recursive: true })
        if (res == undefined) {
          fs.mkdirSync(folderPath, { recursive: true });
          return {
            status: true,
            message: "Folder already existed. It was deleted and created again successfully."
          }
        } else {
          return {
            status: false,
            message: "Folder can not be reset."
          }
        }
      } else {
          fs.mkdirSync(folderPath, { recursive: true });
          return {
            status: true,
            message: "Folder created successfully."
          }
      }
    } catch (error) {
      const folderName = path.dirname(folderPath);
      return {
        status: false,
        message: `Error in deleting folder ${folderName}`,
        error
      }
    }
  }

    static deleteDownloadFolder(folderPath: string) {
    try {
      if (fs.existsSync(folderPath)) {
        const res = fs.rmSync(folderPath, { recursive: true })
        if (res == undefined) {
          return {
            status: true,
            message: "Folder deleted successfully."
          }
        } else {
          return {
            status: false,
            message: "Folder can not be deleted."
          }
        }
      } else {
          return {
            status: true,
            message: "Folder does not exist."
          }
      }
    } catch (error) {
      const folderName = path.dirname(folderPath);
      return {
        status: false,
        message: `Error in deleting folder ${folderName}`,
        error
      }
    }
  }

  static async retrievePdf(): Promise<any> {
    const filename = "schedule.pdf";
    const folderName = "assets";
    const pdfPath = path.join(__dirname, "..", "..", folderName);
    
    // delete download folder, if exists and then create it again
    PdfService.deleteDownloadFolder(pdfPath)
    PdfService.createDownloadFolder(pdfPath)

    fs.mkdirSync(pdfPath, { recursive: true });

    const filepath = path.join(pdfPath, filename);

    // Download schedule file
    try {
      const url = env.PDF_URL;
      const response = await axios.get<ArrayBuffer>(url, {
        responseType: "arraybuffer",
      });

      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(response.data);
      
      // Write the PDF file
      fs.writeFileSync(filepath, buffer);
      console.log(`PDF file ${Color.Bright}${Color.FgBlue}${filename}${Color.Reset} downloaded to ${Color.Bright}${Color.FgGreen}${pdfPath}${Color.Reset}`);

      return new Promise((resolve) => {
        resolve({
          status: true,
          message: "PDF file downloaded successfully",
          filepath
        });
      });

    } catch (error) {
      return new Promise((reject) => {
        reject({
          status: false,
          message: "Error while trying to download PDF file",
          error,
        });
      });
    }

  }

  static async extractPdf(filepath: string): Promise<any> {
    const pdfParseScript = "parse_pdf.py";
    const utilsPath = path.join(__dirname, "..", "utils");
    const scriptPath = path.join(utilsPath, pdfParseScript);
    
    const pdfPath = path.dirname(filepath);

    return new Promise((resolve, reject) => {
      try {

        const python = spawn("python3", [scriptPath, filepath]);

        let output = "";
        let errorOutput = "";

        python.stdout.on("data", (data) => {
          output += data.toString();
        });

        python.stderr.on("data", (data) => {
          errorOutput += data.toString();
        });

        python.on("close", (code) => {
          if (code !== 0) {
            console.error("Python error output:", errorOutput);
            return reject ({
              status: false,
              message: `Python exited with code ${code}`,
              data: errorOutput,
            });
          }

          try {
            const result = JSON.parse(output).data;

            if (!result || result.length === 0) {
              return reject({ status: false, data: result });
            }

            return resolve({ status: true, data: result });

          } catch (err) {
            console.error("Raw Python output:", output);
            throw { status: false, err, data: output };
          }
        });
      } catch (error) {
        console.error("PDF extraction failed: ", error);
        throw { status: false, data: error };
      }
    });

  }

}
