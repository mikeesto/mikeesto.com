---
title: Extracting text from hundreds of government inquiry PDFs
description: Using ocrmac to extract text from PDF documents on macOS.
date: 01-11-2025
draft: false
---

Government inquiries accept submissions in various formats but sensibly often publish them exclusively as PDFs for archival fidelity. A PDF is a digital snapshot, a frozen document of record that preserves the original formatting and ensures authenticity. The consequence for anyone (it's me, hi. i'm the problem, it's me) actually trying to use this public data, however, is brutal. You're confronted with a web page listing hundreds of individual PDF files, often with nothing more than the submitter's name to go on. The rich text within the corpus of submissions is effectively entombed.

Object character recognition (OCR) is invaluable for solving these types of problems, which I've had to do on a few separate occasions now. The nice thing about inquiry submissions is that each submission is usually formatted identically: some preamble text, followed by a series of questions with responses. This consistency makes extraction easier. You can search for the same question text across hundreds of PDFs, extract the unknown response text in between, then find the next question marker.

If you've done any OCR before, it's likely that you tried [Tesseract](https://github.com/tesseract-ocr/tesseract). Just a fortnight ago Deepseek released [DeepSeek-OCR](https://github.com/deepseek-ai/DeepSeek-OCR) a vision-language / layout-aware engine which has strong semantic awareness beyond just text. I was very tempted to try it out for this task but the PDFs I was dealing with did not have complex layouts, and so I ended up using [ocrmac](https://github.com/straussmaximilian/ocrmac).

The great thing about `ocrmac`, if you're on a Mac (otherwise sorry, you're out luck!), is that it's a thin wrapper around [Apple's Vision framework](https://developer.apple.com/documentation/vision). This means it's using the same OCR engine that powers features like Live Text in iOS and macOS - the one that lets you select and copy text from images throughout the system. It's hardware accelerated, runs efficiently on Apple Silicon, and I found it to be surprisingly accurate even with at times challenging formatting.

PDFs can contain actual text layers or be scanned images masquerading as PDFs. `ocrmac` expects image files as input. For a consistent OCR pipeline, I converted everything to images first using [pdf2image](https://github.com/Belval/pdf2image), which wraps the [poppler](https://poppler.freedesktop.org/) library. At 300 DPI, you get good quality images that can be reliably processed.

The workflow I followed was: PDF → images (one per page) → OCR each image → combine the text.

### Processing the PDFs

First, you'll need a few libraries that you can install with pip. You'll also need to install the `poppler` utility which `pdf2image` depends on:

```bash
pip install ocrmac pdf2image
brew install poppler
```

Here's the python script to process a folder of PDFs:

```python
from pathlib import Path
from pdf2image import convert_from_path
from ocrmac import ocrmac
import tempfile
import os

def process_pdfs(input_folder="submissions", output_folder="submissions_ocr"):
    Path(output_folder).mkdir(exist_ok=True)
    pdf_files = list(Path(input_folder).glob("*.pdf"))

    print(f"Found {len(pdf_files)} PDF files\n")

    for i, pdf_path in enumerate(pdf_files, 1):
        print(f"[{i}/{len(pdf_files)}] {pdf_path.name}")

        images = convert_from_path(str(pdf_path), dpi=300)
        all_text = []

        for page_num, image in enumerate(images, 1):
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                image.save(tmp.name, "PNG")
                annotations = ocrmac.OCR(tmp.name, language_preference=["en-US"]).recognize()
                page_text = "\n".join([ann[0] for ann in annotations])
                all_text.append(f"--- Page {page_num} ---\n{page_text}\n")
                os.unlink(tmp.name)

        output_path = Path(output_folder) / f"{pdf_path.stem}.txt"
        output_path.write_text("\n".join(all_text), encoding="utf-8")
        print(f"  ✓ {len(''.join(all_text))} characters\n")

if __name__ == "__main__":
    process_pdfs()
```

The script saves each page's text with a page marker, which helps when you need to reference where specific content appeared in the original document.

### Extracting structured responses

The above script gives you raw text, but inquiry submissions have structure. Each submission answers the same set of questions, in my case marked with "Q1.", "Q2.", etc. I wrote a second script to parse these patterns and extract question answer pairs into JSON:

```python
import re
import json
import os
from pathlib import Path

def extract_answers(text):
    answers = {}
    parts = re.split(r"\n(Q\d+\.)\n", text)

    for i in range(1, len(parts), 2):
        if i + 1 < len(parts):
            question_num = parts[i].strip()
            content = re.sub(r"--- Page \d+ ---", "", parts[i + 1]).strip()
            if content and not content.startswith("Q"):
                answers[question_num] = content

    return answers

def process_submissions(input_folder="submissions_ocr", output_file="responses.json"):
    all_submissions = {}
    txt_files = sorted(Path(input_folder).glob("*.txt"))

    for filepath in txt_files:
        text = filepath.read_text(encoding="utf-8")
        answers = extract_answers(text)
        all_submissions[filepath.stem] = answers
        print(f"{filepath.name}: {len(answers)} answers")

    Path(output_file).write_text(json.dumps(all_submissions, indent=2, ensure_ascii=False))
    print(f"\nSaved {len(all_submissions)} submissions to {output_file}")

if __name__ == "__main__":
    process_submissions()
```

The regex split approach worked well here for me because the question markers were consistent.

I prefer to first put everything into a giant JSON structure so that I can quickly check if the extraction worked correctly, filter or transform things as needed. Once I'm happy with the output, I typically export it to a CSV to share with others who will likely open it in Excel. For my 280 submissions, the final CSV had a column for the submission ID and then one column per question. This made it straightforward to see all responses to a particular question side-by-side, or search for specific terms across all submissions.
