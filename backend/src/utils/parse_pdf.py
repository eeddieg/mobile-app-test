# parse_pdf.py
import sys
import json
import subprocess
import re

try:
  import pdfplumber  # pyright: ignore[reportMissingImports]
except ImportError:
  subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "pdfplumber"])
  import pdfplumber  # pyright: ignore[reportMissingImports]

def parse_pdf(pdf_path: str) -> str:
  data = []

  try:
    with pdfplumber.open(pdf_path) as pdf:
      last_orofos_digit = None  # last seen valid floor digit

      for page_number, page in enumerate(pdf.pages, start=1):
        tables = page.extract_tables() or []
        last_table_bottom_y = 0

        # Extract tables and keep track of bottom y
        for table_index, table in enumerate(tables):
          if not table:
            continue
          headers = table[0]
          rows = table[1:]
          for row in rows:
            row_data = {}
            for i in range(len(row)):
              key = headers[i] if i < len(headers) else f"col_{i+1}"
              value = row[i] or ""

              if key == "ΟΡΟΦΟΣ":
                if value:
                  first_char = value[0]
                  if first_char.isdigit():
                    last_orofos_digit = first_char
                    row_data[key] = first_char
                  else:
                    # Keep value as-is if first char is not a digit
                    row_data[key] = value
                else:
                  if last_orofos_digit:
                    row_data[key] = last_orofos_digit
              else:
                row_data[key] = value

            row_data["_page"] = page_number
            row_data["_table_index"] = table_index
            data.append(row_data)

          # estimate bottom y of this table
          table_objs = page.find_tables()
          if table_index < len(table_objs):
            table_bbox = table_objs[table_index].bbox  # (x0, top, x1, bottom)
            last_table_bottom_y = max(last_table_bottom_y, table_bbox[3])

        # Extract footer dynamically (lines below last table)
        words = page.extract_words() or []
        footer_lines = [w['text'] for w in words if w['bottom'] > last_table_bottom_y]
        footer_text = " ".join(footer_lines).strip()

        if footer_text:
          data.append({
            "_page": page_number,
            "_table_index": "footer",
            "footer_text": footer_text
          })

    return json.dumps(data, ensure_ascii=False, indent=2)

  except Exception as e:
    return json.dumps({"error": str(e)})

if __name__ == "__main__":
  pdf_path = sys.argv[1] if len(sys.argv) > 1 else None
  if not pdf_path:
    print(json.dumps({"error": "No PDF path provided"}))
    sys.exit(1)

  try:
    result_json = parse_pdf(pdf_path)
    print(json.dumps({"data": json.loads(result_json)}, ensure_ascii=False, indent=2))
  except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
