# parse_pdf.py
import sys
import json
import subprocess

try:
  import pdfplumber # pyright: ignore[reportMissingImports]
except ImportError:
  print("pdfplumber not found. Installing...")
  subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "pdfplumber"])
  import pdfplumber # pyright: ignore[reportMissingImports]

def parse_pdf(pdf_path: str) -> str:
  data = []

  try:
    with pdfplumber.open(pdf_path) as pdf:
      for page_number, page in enumerate(pdf.pages, start=1):
        tables = page.extract_tables()
        last_table_end_line_index = 0

        # Extract tables
        for table_index, table in enumerate(tables):
          if not table:
            continue
          headers = table[0]
          rows = table[1:]
          for row in rows:
            row_data = {
              headers[i] if i < len(headers) else f"col_{i+1}": (row[i] or "")
              for i in range(len(row))
            }
            row_data["_page"] = page_number
            row_data["_table_index"] = table_index
            data.append(row_data)
          last_table_end_line_index += len(table)

        # Extract footer: all text after last table
        full_text = page.extract_text() or ""
        lines = [line.strip() for line in full_text.split("\n") if line.strip()]
        footer_lines = lines[last_table_end_line_index:] if last_table_end_line_index < len(lines) else []

        if footer_lines:
          data.append({
            "_page": page_number,
            "_table_index": "footer",
            "footer_text": " ".join(footer_lines)
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
    # result_json = parse_pdf(pdf_path)
    result_json = parse_pdf(pdf_path)
    print(json.dumps({"data": json.loads(result_json)}, ensure_ascii=False))
  except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
