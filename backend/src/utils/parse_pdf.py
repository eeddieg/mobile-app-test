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


def parse_pdf1(pdf_path: str) -> str:
  data = []

  try:
    with pdfplumber.open(pdf_path) as pdf:
      for page_number, page in enumerate(pdf.pages, start=1):
        tables = page.extract_tables()
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

    return json.dumps(data, ensure_ascii=False, indent=2)

  except Exception as e:
    return json.dumps({"error": str(e)})


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





























# # parse_pdf.py
# import re
# import sys
# import json
# import subprocess

# try:
#   from pypdf import PdfReader  # pyright: ignore[reportMissingImports]
# except ImportError:
#   print("pypdf not found. Installing...")
#   subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "pypdf"])
#   from pypdf import PdfReader  # pyright: ignore[reportMissingImports]


# def parse_pdf(pdf_path):
#   reader = PdfReader(pdf_path)
#   text = ""
#   for page in reader.pages:
#     text += page.extract_text() or ""
#   return text

# def parse_schedule(text):
#     # Normalize NAI
#     text = re.sub(r"\bNAI\b", "ΝΑΙ", text, flags=re.IGNORECASE)
    
#     # Split text into lines
#     lines = text.split("\n")
#     merged = []
#     buffer = ""
#     for line in lines:
#         line = line.strip()
#         if not line:
#             continue
#         if re.match(r"^(?:\d+[οΟ]ς|ΙΣΟΓΕΙΟ|ΕΞΩΤ.*\.ΟΙΚ.*\.?)", line, re.IGNORECASE):
#             if buffer:
#                 merged.append(buffer)
#                 buffer = ""
#             merged.append(line)
#         else:
#             if buffer:
#                 buffer += " " + line
#             else:
#                 buffer = line
#     if buffer:
#         merged.append(buffer)

#     floors = {}
#     current_floor = None

#     # Regex for single department entry: Dept + Office + Phone + Active + optional Hours
#     entry_pattern = re.compile(
#         r"([Α-ΩΆ-Ώ’\s\(\)]+?)\s+(\d+\w*)\s+(\d{8,10})\s+(ΝΑΙ|ΟΧΙ)\s*([\d\-: ]*)"
#     )

#     for line in merged:
#         line = line.strip()
#         if not line:
#             continue

#         # Detect floor header
#         floor_match = re.match(r"^(?P<floor>\d+[οΟ]ς|ΙΣΟΓΕΙΟ|ΕΞΩΤ.*\.ΟΙΚ.*\.?)", line, re.IGNORECASE)
#         if floor_match:
#             current_floor = floor_match.group("floor").upper()
#             floors.setdefault(current_floor, [])
#             line = line[len(floor_match.group(0)):].strip()
#             if not line:
#                 continue

#         if not current_floor:
#             continue

#         # Extract multiple department entries from the line
#         matches = list(entry_pattern.finditer(line))
#         if matches:
#             for match in matches:
#                 dept, office, phone, active, hours = match.groups()
#                 floors[current_floor].append({
#                     "Τμήμα": dept.strip(),
#                     "Γραφείο": office.strip(),
#                     "Τηλέφωνο": phone.strip(),
#                     "Ενεργό": active.strip(),
#                     "Ώρες": hours.strip() if hours else "",
#                     "Παρατηρήσεις": ""
#                 })
#         else:
#             # if no match, put as a note (optional)
#             floors[current_floor].append({
#                 "Τμήμα": "",
#                 "Γραφείο": "",
#                 "Τηλέφωνο": "",
#                 "Ενεργό": "",
#                 "Ώρες": "",
#                 "Παρατηρήσεις": line
#             })

#     return json.dumps(floors, ensure_ascii=False, indent=2)



# if __name__ == "__main__":
#   # Read args passed from Node.js
#   pdf_path = sys.argv[1] if len(sys.argv) > 1 else None

#   if not pdf_path:
#     print(json.dumps({"error": "No PDF path provided"}))
#     sys.exit(1)

#   try:
#     extracted_text = parse_pdf(pdf_path)
#     dataJson = parse_schedule(extracted_text)
#     # print(json.dumps({"text": extracted_text}))
#     print(json.dumps({"text": dataJson}))


#   except Exception as e:
#     print(json.dumps({"error": str(e)}))
#     sys.exit(1)
