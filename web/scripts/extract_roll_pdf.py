#!/usr/bin/env python3
"""Extract machine-readable fields from the bundled Marathi electoral-roll source file.

Outputs web/src/data/rollExtract.json. Requires: pip install pymupdf
Run from repo: python3 web/scripts/extract_roll_pdf.py
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

try:
    import fitz  # type: ignore
except ImportError:
    print("Install PyMuPDF: python3 -m pip install --user pymupdf", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    pdf_path = root / "public" / "sample-electoral-roll.pdf"
    out_path = root / "src" / "data" / "rollExtract.json"

    if not pdf_path.is_file():
        print(f"Missing source file: {pdf_path}", file=sys.stderr)
        sys.exit(1)

    doc = fitz.open(pdf_path)
    full = "\n".join(page.get_text() for page in doc)
    pairs = [(e, int(a)) for a, e in re.findall(r"(?<!\d)(\d{1,3})\s*\n\s*(0\d{6})\b", full)]
    ages = [a for _, a in pairs]
    buckets = {"18-25": 0, "26-35": 0, "36-50": 0, "51-65": 0, "66+": 0}
    for a in ages:
        if 18 <= a <= 25:
            buckets["18-25"] += 1
        elif 26 <= a <= 35:
            buckets["26-35"] += 1
        elif 36 <= a <= 50:
            buckets["36-50"] += 1
        elif 51 <= a <= 65:
            buckets["51-65"] += 1
        else:
            buckets["66+"] += 1

    c = Counter(e for e, _ in pairs)
    dups = sorted(e for e, n in c.items() if n > 1)
    part_m = re.search(r"MT/\d{3}/\d{4}", full)
    part_code = part_m.group(0) if part_m else "unknown"
    ac = int(part_code.split("/")[1]) if part_code != "unknown" else None
    pn = part_code.split("/")[2] if part_code != "unknown" else None

    male = female = total = None
    m = re.search(r"\n\s*(\d{3})\s*\n\s*(\d{3})\s*\n\s*(\d{3})\s*\n", full[:8000])
    if m:
        male, female, total = map(int, m.groups())

    out = {
        "sourcePdf": "sample-electoral-roll.pdf",
        "extractedAt": datetime.now(timezone.utc).isoformat(),
        "partCode": part_code,
        "assemblyNumber": ac,
        "partNumber": pn,
        "areaLabelMr": "मुंढवा गावठाण (नमुना मतदार यादी)",
        "areaLabelEn": "Mundhwa Gaonthan (sample electoral roll)",
        "urbanRuralHint": "semi-urban",
        "summaryFromPdfCover": {"male": male, "female": female, "total": total},
        "parsedVoterRows": len(pairs),
        "uniqueEpics": len(c),
        "duplicateEpicNumbers": dups,
        "duplicateEpicCount": len(dups),
        "ageStats": {
            "min": min(ages),
            "max": max(ages),
            "avg": round(sum(ages) / len(ages), 2),
        },
        "ageBuckets": buckets,
        "youngVoters1825": buckets["18-25"],
        "extractionNote": (
            "Marathi names and addresses use embedded subset fonts in this source file; "
            "the text layer still exposes EPIC numbers and ages. "
            "Run Devanagari OCR if you need full-name export."
        ),
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
