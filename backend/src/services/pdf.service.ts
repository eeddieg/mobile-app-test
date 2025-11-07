import path from "path";
import fs from "fs";
import { spawn } from "child_process";

export default class PdfService {
  static async retrievePdf(file: string): Promise<any> {

  }

  static async extractPdf(): Promise<any> {
    const folderName = "assets";
    const extension = ".pdf";
    const filename = "Πρόγραμμα-ΚΙΑ.pdf";
    const pdfParseScript = "parse_pdf.py";

    const pdfPath = path.join(__dirname, "..", "..", folderName);
    const utilsPath = path.join(__dirname, "..", "utils");

    // Ensure folder exists
    if (!fs.existsSync(pdfPath)) {
      fs.mkdirSync(pdfPath, { recursive: true });
    }

    // Retrieve PDF file 


    // Read all .pdf files in the folder
    const files = fs
      .readdirSync(pdfPath)
      .filter((file) => path.extname(file).toLowerCase() === extension);

    // Find the target file
    const targetFile = files.find((file) => file === filename);

    if (!targetFile) {
      throw new Error(`File not found: ${filename}`);
    }

    const fullPath = path.join(pdfPath, targetFile);
    const scriptPath = path.join(utilsPath, pdfParseScript);

    return new Promise((resolve, reject) => {
      const python = spawn("python3", [scriptPath, fullPath]);

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
          return reject(
            new Error(errorOutput || `Python exited with code ${code}`)
          );
        }

        try {
          const data = output.slice(10, -3);
          
          const result = (JSON.parse(output)).data;

          if (result.length == 0) {
            reject({ status: false, data: new Error(result.error) });
          } else {
            resolve({ status: true, data: result });
          }
        } catch (err) {
          console.error("Raw Python output:", output);
          reject(new Error(`Failed to parse Python output: ${err}`));
        }
      });
    });
  }
}
