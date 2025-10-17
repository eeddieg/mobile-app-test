import dotenv from "dotenv";
import fs from "fs";
import path from "path";

export default class UtilsService {
  static retrieveFilename(): Promise<string[] | null> {
    const folderName = "assets";
    const extension = ".pdf";
    const filename = "Πρόγραμμα-ΚΙΑ.pdf";

    const pdfPath = path.join(__dirname, "..", "..", folderName);

    if (!fs.existsSync(folderName)){
      fs.mkdirSync(folderName);
    }
    
    // retrieve schedule file with AXIOS
    
    fs.readdir(pdfPath, (err, files) => {
      if (err) {
        console.error(err);
        return new Promise((reject) => { reject(err); });
      }
      else {
        const targetFiles = files.filter(file => {
          return path.extname(file).toLowerCase() === extension;
        });
        console.log(targetFiles);
        
        targetFiles.filter((file) => {
          file.
        });

        const content = fs.readFile();

        return new Promise((resolve) => {
          resolve(content);
        });
      }
    });

  }
}