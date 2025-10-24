export default interface PdfFile {
  file: string,
  data: {
    Transcoder: string,
    Meta: {
      PDFFormatVersion: string,
      IsAcroFormPresent: boolean,
      IsXFAPresent: boolean,
      Title: string,
      Author: string,
      Producer: string,
      CreationDate: string,
      ModDate: string,
      Metadata: object,
    },
    Pages: [
      {
        Width: number,
        Height: number,
        HLines: [],
        VLines: [],
        Fills: [
          {
            x: number,
            y: number,
            w: number,
            h: number,
            oc: string,
          },
        ],
        Texts: [
          {
            x: number,
            y: number,
            w: number,
            clr: number,
            sw: number,
            A: string,
            R: [
              {
                T: string,
                S: number,
                TS: [],
              }
            ]
          },
        ],
        Fields: [],
        Boxsets: []
      }
    ]
  }
}

// {
//   "status": true,
//   "statusCode": 200,
//   "content": {
//     "file": "Πρόγραμμα-ΚΙΑ.pdf",
//     "data": {
//       "Transcoder": "pdf2json@4.0.0 [https://github.com/modesty/pdf2json]",
//       "Meta": {
//         "PDFFormatVersion": "1.7",
//         "IsAcroFormPresent": false,
//         "IsXFAPresent": false,
//         "Title": "€ÁÌ³Á±¼¼±-ıŽ‚.xlsx",
//         "Author": "",
//         "Producer": "Microsoft: Print To PDF",
//         "CreationDate": "D:20251016162716+03'00'",
//         "ModDate": "D:20251016162716+03'00'",
//         "Metadata": { }
//       },
//       "Pages": [
//         {
//           "Width": 37.208,
//           "Height": 52.62,
//           "HLines": [],
//           "VLines": [],
//           "Fills": [
//             {
//               "x": 6.435,
//               "y": 4.605,
//               "w": 24.683,
//               "h": 0.788,
//               "oc": "#5b9ad4"
//             },
//           ],
//           "Texts": [
//             {
//               "x": 6.515,
//               "y": 4.402,
//               "w": 34.931,
//               "clr": 1,
//               "sw": 0.29428125,
//               "A": "left",
//               "R": [
//                 {
//                   "T": "ΟΡΟΦΟΣ",
//                   "S": -1,
//                   "TS": [0, 12.12035, 0, 0]
//                 }
//               ]
//             },
//           ],
//           "Fields": [],
//           "Boxsets": []
//         }
//       ]
//     }
//   }
// }


// | Key     | Meaning                                                                                                                      | Type   | Example      |
// | ------- | ---------------------------------------------------------------------------------------------------------------------------- | ------ | ------------ |
// | **x**   | X-coordinate (horizontal position) of the text block on the PDF page, usually in **points** relative to the top-left corner. | number | `6.515`      |
// | **y**   | Y-coordinate (vertical position) of the text block on the page.                                                              | number | `4.402`      |
// | **w**   | Width of the text element (approximate bounding box width).                                                                  | number | `34.931`     |
// | **clr** | Color index (integer referring to the text color, e.g., `0`=black, `1`=some other color depending on internal mapping).      | number | `1`          |
// | **sw**  | Space width — the width of a space character in that font or style.                                                          | number | `0.29428125` |
// | **A**   | Alignment of the text: `"left"`, `"right"`, or `"center"`.                                                                   | string | `"left"`     |
// | **R**   | Array of text runs — each “run” contains the actual text string plus style/formatting info.                                  | array  | see below    |



// | Key    | Meaning                                                                                                                                                                                                             | Type   | Example               |
// | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------- |
// | **T**  | The actual text content, but **URL-encoded** (percent encoding). You’ll need to `decodeURIComponent()` it to get the readable text (e.g., `"ΟΡΟΦΟΣ"`).                                                              | string | `"ΟΡΟΦΟΣ"`            |
// | **S**  | Font style ID or index (−1 = default, otherwise refers to a specific font/style).                                                                                                                                   | number | `-1`                  |
// | **TS** | Text Style array: `[fontId, fontSize, textColor, ?]`. Not fully documented, but typically: <br>• `TS[0]`: font index <br>• `TS[1]`: font size <br>• `TS[2]`: color (numeric code) <br>• `TS[3]`: unknown / reserved | array  | `[0, 12.12035, 0, 0]` |
