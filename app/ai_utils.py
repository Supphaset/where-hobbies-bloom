import json
import os
from typing import Dict

try:
    import openai
except Exception:  # network/installation issues
    openai = None

MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
API_KEY = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT = "You are a certified IELTS Writing examiner. Return JSON with task_response, coherence, lexical, grammar, and overall_band."


def grade_speaking(transcript: str) -> Dict:
    """Return simple fluency feedback based on word count."""
    words = len(transcript.split())
    band = min(9, max(5, words // 50 + 5))
    return {"fluency_band": band}


def grade_essay(text: str) -> Dict:
    """Grade the essay with OpenAI or return a simple heuristic result."""
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
            content = resp.choices[0].message.content
            return json.loads(content)
        except Exception:
            pass
    # fallback heuristic
    words = len(text.split())
    band = min(9, max(5, words // 50 + 5))
    feedback = {
        "task_response": {"band": band, "comment": ""},
        "coherence": {"band": band, "comment": ""},
        "lexical": {"band": band, "comment": ""},
        "grammar": {"band": band, "comment": ""},
        "overall_band": band,
    }
    return feedback
