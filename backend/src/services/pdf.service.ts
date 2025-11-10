// import path from "path";
// import fs from "fs";
// import { spawn } from "child_process";
// import dotenv from "dotenv";
// import axios from "axios";

// export default class PdfService {
//   static deleteFolder(folder: string) {
//     try {
//       if (fs.existsSync(folder)) {
//         fs.rmSync(folder, { recursive: true, force: true });
//         console.log(`Folder ${folder} deleted.`);
//       }
//     } catch (error) {
//       console.error("Error deleting folder:", error);
//       throw error;
//     }
//   }

//   static async retrievePdf(): Promise<any> {
//     const filename = "schedule.pdf";
//     const folderName = "assets";

//     const pdfPath = path.join(__dirname, "..", "..", folderName);
       
//     dotenv.config();

//     // Ensure folder exists
//     if (!fs.existsSync(pdfPath)) {
//       fs.mkdirSync(pdfPath, { recursive: true });
//     }

//     const fullPath = path.join(pdfPath, filename);
//     // Download schedule file
//     try {
//       const url = process.env.PDF_URL || "";
//       const response = await axios.get(url, {
//         responseType: "arraybuffer", // important for binary files
//       });

//       // Convert ArrayBuffer to Buffer
//       const buffer = Buffer.from(response.data as ArrayBuffer);
      
//       // Write the PDF file
//       fs.writeFileSync(fullPath, buffer);
//       console.log(`PDF file ${filename} downloaded to ${pdfPath}`);

//       return new Promise((resolve) => {
//         resolve(fullPath);
//       });

//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//       return new Promise((reject) => {
//         reject(error);
//       });
//     }
//   }

//   static async extractPdf(): Promise<any> {

//     var filepath = "";
//     const pdfParseScript = "parse_pdf.py";
//     const utilsPath = path.join(__dirname, "..", "utils");

//     // Retrieve PDF file 
//     await PdfService.retrievePdf()
//     .then((path: string) => {
//       filepath = path;
//     })
//     .then(() => {
//       if (filepath.length > 0) {
//         const pdfPath = path.dirname(filepath);
//         const filename = path.basename(filepath);

//         const files = fs.readdirSync(pdfPath);
//         const targetFile = files.find((file) => file === filename);

//         if (!targetFile) {
//           throw new Error(`File not found: ${filename}`);
//         }

//         const fullPath = path.join(pdfPath, targetFile);
//         const scriptPath = path.join(utilsPath, pdfParseScript);

//         return new Promise((resolve, reject) => {
//           const python = spawn("python3", [scriptPath, filepath]);

//           console.log(python.stdout);
//           let output = "";
//           let errorOutput = "";

//           python.stdout.on("data", (data) => {
//             console.log("stdout")
//             output += data.toString();
//           });
            
//           python.stderr.on("data", (data) => {
//             console.log("stderr")
//             errorOutput += data.toString();
//           });
              
//           python.on('close', (code) => {
//             console.log(`Python process exited with code ${code}`);
//           });

//           console.log(output)
//                 // python.on("close", async (code) => {
//             //   console.log("close")
//             //   if (code !== 0) {
//             //     console.error("Python error output:", errorOutput);
//             //     await PdfService.deleteFolder(pdfPath);
//             //     return reject(new Error(errorOutput || `Python exited with code ${code}`));
//             //   }
            
//             // PdfService.deleteFolder(pdfPath);

//               // try {
//               //   console.log(output)
//               //   // const data = output.slice(10, -3);
//               //   const result = JSON.parse(output).data;

//               //   await PdfService.deleteFolder(pdfPath);

//               //   if (!result || result.length === 0) {
//               //     reject({ status: false, data: new Error("No data returned from parser.") });
//               //   } else {
//               //     resolve({ status: true, data: result });
//               //   }
//               // } catch (err) {
//               //   console.error("Raw Python output:", output);
//               //   await PdfService.deleteFolder(pdfPath);
//               //   reject(new Error(`Failed to parse Python output: ${err}`));
//               // }
//             // });
//           });
        



//       }

//     })

//   }


// }





























// import path from "path";
// import fs from "fs";
// import { spawn } from "child_process";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// export default class PdfService {

//   static async deleteFolder(folder: string): Promise<void> {
//     try {
//       if (fs.existsSync(folder)) {
//         await fs.promises.rm(folder, { recursive: true, force: true });
//         console.log(`Folder ${folder} deleted.`);
//       }
//     } catch (error) {
//       console.error("Error deleting folder:", error);
//       throw error;
//     }
//   }

//   static async retrievePdf(): Promise<any> {
//     const filename = "schedule.pdf";
//     const folderName = "assets";

//     const pdfPath = path.join(__dirname, "..", "..", folderName);
       
//     dotenv.config();

//     // Ensure folder exists
//     if (!fs.existsSync(pdfPath)) {
//       fs.mkdirSync(pdfPath, { recursive: true });
//     }

//     const fullPath = path.join(pdfPath, filename);
//     // Download schedule file
//     try {
//       const url = process.env.PDF_URL || "";
//       const response = await axios.get(url, {
//         responseType: "arraybuffer", // important for binary files
//       });

//       // Convert ArrayBuffer to Buffer
//       const buffer = Buffer.from(response.data as ArrayBuffer);
      
//       // Write the PDF file
//       fs.writeFileSync(fullPath, buffer);
//       console.log(`PDF file ${filename} downloaded to ${pdfPath}`);

//       return new Promise((resolve) => {
//         resolve(fullPath);
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

//     let filepath: string;
//     try {
//       filepath = await PdfService.retrievePdf();
//     } catch (error) {
//       console.error("Error in downloading schedule:", error);
//       throw error;
//     }

//     if (filepath.length > 0) {
//       const pdfPath = path.dirname(filepath);
//       const filename = path.basename(filepath);

//       const files = fs.readdirSync(pdfPath);
//       const targetFile = files.find((file) => file === filename);

//       if (!targetFile) {
//         throw new Error(`File not found: ${filename}`);
//       }

//       const scriptPath = path.join(utilsPath, pdfParseScript);

//       return new Promise((resolve, reject) => {
//         const python = spawn("python3", [scriptPath, filepath]);

//         let output = "";
//         let errorOutput = "";

//         python.stdout.on("data", (data) => {
//           console.log("stdout")
//           output += data.toString();
//         });
          
//         python.stderr.on("data", (data) => {
//           console.log("stderr")
//           errorOutput += data.toString();
//         });
            
//         python.on('close', (code) => {
//           console.log(`Python process exited with code ${code}`);
//         });

//         console.log(output)
//             // python.on("close", async (code) => {
//         //   console.log("close")
//         //   if (code !== 0) {
//         //     console.error("Python error output:", errorOutput);
//         //     await PdfService.deleteFolder(pdfPath);
//         //     return reject(new Error(errorOutput || `Python exited with code ${code}`));
//         //   }
        
//         // PdfService.deleteFolder(pdfPath);

//           // try {
//           //   console.log(output)
//           //   // const data = output.slice(10, -3);
//           //   const result = JSON.parse(output).data;

//           //   await PdfService.deleteFolder(pdfPath);

//           //   if (!result || result.length === 0) {
//           //     reject({ status: false, data: new Error("No data returned from parser.") });
//           //   } else {
//           //     resolve({ status: true, data: result });
//           //   }
//           // } catch (err) {
//           //   console.error("Raw Python output:", output);
//           //   await PdfService.deleteFolder(pdfPath);
//           //   reject(new Error(`Failed to parse Python output: ${err}`));
//           // }
//         // });
//       });
//     } else {
//       console.error("File is not present.")
//       return new Promise((reject) => {
//         reject("File is not present.");
//       });
//     }
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

      console.log(python.stdout)
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