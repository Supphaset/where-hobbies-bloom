from __future__ import annotations

"""Generate exam questions from a PDF using OpenAI."""

import json
import os
from pathlib import Path
import argparse

from pdfminer.high_level import extract_text

try:
    import openai
except Exception:  # network/installation issues
    openai = None

MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
API_KEY = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT = (
    "You are an English exam generator. Given some source text, "
    "return a JSON array of questions. Each question must have 'prompt', "
    "'options', 'answer_key', and optional 'skill_code'."
)


def questions_from_text(text: str) -> list[dict]:
    """Create questions using OpenAI or return a single fallback question."""
    if openai and API_KEY:
        try:
            openai.api_key = API_KEY
            resp = openai.ChatCompletion.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": text},
                ],
                temperature=0,
            )
            return json.loads(resp.choices[0].message.content)
        except Exception:
            pass
    # Fallback heuristic
    return [
        {
            "prompt": "What is the main idea of the passage?",
            "options": ["Option A", "Option B", "Option C"],
            "answer_key": "Option A",
            "skill_code": "reading",
        }
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description="Create exam JSON from a PDF")
    parser.add_argument("pdf", type=Path, help="Source PDF file")
    parser.add_argument("--output", type=Path, help="Where to write the JSON")
    parser.add_argument("--exam-type", default="Custom")
    parser.add_argument("--section", default="Reading")
    parser.add_argument("--title", default="Generated Test")
    parser.add_argument("--level", type=int, default=1)
    args = parser.parse_args()

    text = extract_text(args.pdf)
    questions = questions_from_text(text)

    data = {
        "tests": [
            {
                "exam_type": args.exam_type,
                "level": args.level,
                "section": args.section,
                "title": args.title,
                "questions": questions,
            }
        ]
    }

    out_path = args.output or args.pdf.with_suffix(".json")
    out_path.write_text(json.dumps(data, indent=2))
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
