
// import path from "path";
// import fs from "fs";
// import { spawn } from "child_process";
// import env from "@/config/env";
// import Color from "@/config/color.cli";
// import axios from "axios";

// export default class PdfService {

//   static async extractPdf(): Promise<any> {
//     const folderName = "assets";
//     const extension = ".pdf";
//     const filename = "schedule.pdf";
//     const pdfParseScript = "parse_pdf.py";

//     const pdfPath = path.join(__dirname, "..", "..", folderName);
//     const utilsPath = path.join(__dirname, "..", "utils");
//     const scriptPath = path.join(utilsPath, pdfParseScript);
//     const fullPath = path.join(pdfPath, filename);

//     // Ensure folder exists
//     if (!fs.existsSync(pdfPath)) {
//       fs.mkdirSync(pdfPath, { recursive: true });
//     }

//     // Retrieve PDF file 
//     try {
//       const url = env.PDF_URL;
//       const response = await axios.get<ArrayBuffer>(url, {
//         responseType: "arraybuffer",
//       });

//       // Convert ArrayBuffer to Buffer
//       const buffer = Buffer.from(response.data);

//       console.log(buffer)
      
//       // Write the PDF file
//       fs.writeFileSync(fullPath, buffer);
//       console.log(`PDF file ${Color.Bright}${Color.FgBlue}${filename}${Color.Reset} downloaded to ${Color.Bright}${Color.FgGreen}${pdfPath}${Color.Reset}`);

//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//       throw new Error(`Error downloading PDF: ${error}`);
//     }




//     // Read all .pdf files in the folder
//     const files = fs
//       .readdirSync(pdfPath)
//       .filter((file) => path.extname(file).toLowerCase() === extension);

//     // Find the target file
//     const targetFile = files.find((file) => file === filename);

//     if (!targetFile) {
//       throw new Error(`File not found: ${filename}`);
//     }

//     return new Promise((resolve, reject) => {
//       const python = spawn("python3", [scriptPath, fullPath]);

//       let output = "";
//       let errorOutput = "";

//       python.stdout.on("data", (data) => {
//         output += data.toString();
//       });

//       python.stderr.on("data", (data) => {
//         errorOutput += data.toString();
//       });

//       python.on("close", (code) => {
//         if (code !== 0) {
//           console.error("Python error output:", errorOutput);
//           return reject(
//             new Error(errorOutput || `Python exited with code ${code}`)
//           );
//         }

//         try {
//           const data = output.slice(10, -3);
          
//           const result = (JSON.parse(output)).data;

//           if (result.length == 0) {
//             reject({ status: false, data: new Error(result.error) });
//           } else {
//             resolve({ status: true, data: result });
//           }
//         } catch (err) {
//           console.error("Raw Python output:", output);
//           reject(new Error(`Failed to parse Python output: ${err}`));
//         }
//       });
//     });
//   }
// }





import path from "path";
import fs from "fs";
import { spawn } from "child_process";

export default class PdfService {
  static async retrievePdf(file: string): Promise<any> {

  }

  static async extractPdf(): Promise<any> {
    const folderName = "assets";
    const extension = ".pdf";
    const filename = "schedule.pdf";
    const pdfParseScript = "parse_pdf.py";

    const pdfPath = path.join(__dirname, "..", "..", folderName);
    const utilsPath = path.join(__dirname, "..", "utils");
    const fullPath = path.join(pdfPath, filename);
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



















// import path, { resolve } from "path";
// import fs from "fs";
// import { spawn } from "child_process";
// import env from "@/config/env";
// import axios from "axios";
// import Color from "@/config/color.cli";

// export default class PdfService {
//   static async retrievePdf(): Promise<any> {
//     const filename = "schedule.pdf";
//     const folderName = "assets";

//     const pdfPath = path.join(__dirname, "..", "..", folderName);
       
//     // Ensure folder exists
//     if (!fs.existsSync(pdfPath)) {
//       fs.mkdirSync(pdfPath, { recursive: true });
//     }

//     const filepath = path.join(pdfPath, filename);

//     // Download schedule file
//     try {
//       const url = env.PDF_URL;
//       const response = await axios.get<ArrayBuffer>(url, {
//         responseType: "arraybuffer",
//       });

//       // Convert ArrayBuffer to Buffer
//       const buffer = Buffer.from(response.data);
      
//       // Write the PDF file
//       fs.writeFileSync(filepath, buffer);
//       console.log(`PDF file ${Color.Bright}${Color.FgBlue}${filename}${Color.Reset} downloaded to ${Color.Bright}${Color.FgGreen}${pdfPath}${Color.Reset}`);

//       return new Promise((resolve) => {
//         resolve(filepath);
//       });

//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//       return new Promise((reject) => {
//         reject(error);
//       });
//     }
//   }


//   static async extractPdf(): Promise<any> {
//     const pdfParseScript = "parse_pdf.py";
//     const utilsPath = path.join(__dirname, "..", "utils");

//     // Retrieve PDF file 
//     const targetFile = await PdfService.retrievePdf();

//     const filename = path.basename(targetFile);
    
//     if (!targetFile) {
//       throw new Error(`File not found: ${filename}`);
//     }
    
//     const scriptPath = path.join(utilsPath, pdfParseScript);


//     const python = spawn("python3", [scriptPath, targetFile]);

//     let output = "";
//     let errorOutput = "";

//     python.stdout.on("data", (data) => {
//       output += data.toString();
//     });

//     python.stderr.on("data", (data) => {
//       errorOutput += data.toString();
//     });

//     python.on("close", (code) => {
//       if (code !== 0) {
//         console.error("Python error output:", errorOutput);
//         throw new Error(errorOutput || `Python exited with code ${code}`);
//       }
      
//       const data = output.slice(10, -3);                    
//       const result = (JSON.parse(output)).data; 

//       return new Promise((resolve) => {
//         resolve({ status: true, data: result });
//       });
//     });

    
//   }
// }





// import path from "path";
// import fs from "fs";
// import { spawn } from "child_process";

// export default class PdfService {
//   static async retrievePdf(file: string): Promise<any> {

//   }

//   static async extractPdf(): Promise<any> {
//     const folderName = "assets";
//     const extension = ".pdf";
//     const filename = "schedule.pdf";
//     const pdfParseScript = "parse_pdf.py";

//     const pdfPath = path.join(__dirname, "..", "..", folderName);
//     const utilsPath = path.join(__dirname, "..", "utils");

//     // Ensure folder exists
//     if (!fs.existsSync(pdfPath)) {
//       fs.mkdirSync(pdfPath, { recursive: true });
//     }

//     // Retrieve PDF file 


//     // Read all .pdf files in the folder
//     const files = fs
//       .readdirSync(pdfPath)
//       .filter((file) => path.extname(file).toLowerCase() === extension);

//     // Find the target file
//     const targetFile = files.find((file) => file === filename);

//     if (!targetFile) {
//       throw new Error(`File not found: ${filename}`);
//     }

//     const fullPath = path.join(pdfPath, targetFile);
//     const scriptPath = path.join(utilsPath, pdfParseScript);

//     return new Promise((resolve, reject) => {
//       const python = spawn("python3", [scriptPath, fullPath]);

//       let output = "";
//       let errorOutput = "";

//       python.stdout.on("data", (data) => {
//         output += data.toString();
//       });

//       python.stderr.on("data", (data) => {
//         errorOutput += data.toString();
//       });

//       python.on("close", (code) => {
//         if (code !== 0) {
//           console.error("Python error output:", errorOutput);
//           return reject(
//             new Error(errorOutput || `Python exited with code ${code}`)
//           );
//         }

//         try {
//           const data = output.slice(10, -3);
          
//           const result = (JSON.parse(output)).data;

//           if (result.length == 0) {
//             reject({ status: false, data: new Error(result.error) });
//           } else {
//             resolve({ status: true, data: result });
//           }
//         } catch (err) {
//           console.error("Raw Python output:", output);
//           reject(new Error(`Failed to parse Python output: ${err}`));
//         }
//       });
//     });
//   }
// }
