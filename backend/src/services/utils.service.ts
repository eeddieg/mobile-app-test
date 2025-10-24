import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import PDFParser from "pdf2json";

export default class UtilsService {
  static async retrievePdf(): Promise<any> {
    const folderName = "assets";
    const extension = ".pdf";
    const filename = "Πρόγραμμα-ΚΙΑ.pdf";
    const pdfPath = path.join(__dirname, "..", "..", folderName);

    // Ensure folder exists
    if (!fs.existsSync(pdfPath)) {
      fs.mkdirSync(pdfPath, { recursive: true });
    }

    // Read all .pdf files in the folder
    const files = fs.readdirSync(pdfPath).filter((file) => path.extname(file).toLowerCase() === extension);

    // If you want to process only one specific file:
    // const targetFile = path.join(pdfPath, filename);

    // Parse all PDFs and wait for all results
    const results = await Promise.all(
      files.map((file) => {
        const fullPath = path.join(pdfPath, file);

        return new Promise((resolve, reject) => {
          const pdfParser = new PDFParser();

          pdfParser.on("pdfParser_dataError", (errData) => {
            console.error(`Error parsing ${file}:`, errData);
            reject(errData);
          });

          pdfParser.on("pdfParser_dataReady", (pdfData) => {
            console.log(`Parsed: ${file}`);
            
            const results = {
              file,
              data: pdfData,
            };

            resolve(results);
          });

          pdfParser.loadPDF(fullPath);
        });
      })
    );

    return results;
  }

}