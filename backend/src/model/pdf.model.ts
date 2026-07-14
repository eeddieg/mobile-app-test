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