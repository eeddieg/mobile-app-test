import fs from "fs";
import path from "path";
// import pdfParse  from "pdf-parse";

const folderName = "tmp";

const pdfPath = path.join(__dirname, folderName);

let list: string[] = [];
fs.readdir(pdfPath, (err, files) => {
  if (err) console.log(err);
  else {
    console.log("Contents of Directory:");

    list = files;
    console.log(list);
  }
});

export default list;


