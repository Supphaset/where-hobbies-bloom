import json
import os
from typing import Dict
import io
import random
from dotenv import load_dotenv

load_dotenv()

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


def speaking_feedback(audio_bytes: bytes) -> Dict:
    """Transcribe audio with Whisper and grade speaking with GPT or heuristic."""
    transcript = ""
    if openai and API_KEY:
        try:
            openai.api_key = API_KEY
            resp = openai.Audio.transcribe("whisper-1", io.BytesIO(audio_bytes))
            transcript = resp["text"]
            chat = openai.ChatCompletion.create(
                model=MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an IELTS Speaking examiner. Return JSON with fluency_band and a short comment.",
                    },
                    {"role": "user", "content": transcript},
                ],
                temperature=0,
            )
            content = chat.choices[0].message.content
            data = json.loads(content)
            data["transcript"] = transcript
            return data
        except Exception:
            pass
    words = len(transcript.split()) if transcript else 0
    band = min(9, max(5, words // 50 + 5))
    return {"transcript": transcript, "fluency_band": band}


DEFAULT_GRAMMAR_QUESTIONS = [
    {
        "prompt": "Choose the correct form: She ____ to school every day.",
        "options": ["go", "goes", "going"],
        "answer_key": "goes",
    },
    {
        "prompt": "Which sentence is correct?",
        "options": [
            "He don't like apples",
            "He doesn't like apples",
            "He doesn't likes apples",
        ],
        "answer_key": "He doesn't like apples",
    },
]


def generate_grammar_question() -> Dict:
    """Return a multiple-choice grammar question using GPT or fallback."""
    if openai and API_KEY:
        try:
            openai.api_key = API_KEY
            resp = openai.ChatCompletion.create(
                model=MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Create a short English grammar question. "
                            "Return JSON with prompt, options (3 items), and answer_key."
                        ),
                    }
                ],
                temperature=0,
            )
            data = json.loads(resp.choices[0].message.content)
            if all(k in data for k in ("prompt", "options", "answer_key")):
                return data
        except Exception:
            pass
    return random.choice(DEFAULT_GRAMMAR_QUESTIONS)


# Fallback questions for other skills
DEFAULT_READING_QUESTIONS = [
    {
        "prompt": "What is the main idea of a news article about climate?",
        "options": ["Sports events", "Weather patterns", "Movie reviews"],
        "answer_key": "Weather patterns",
    }
]

DEFAULT_LISTENING_QUESTIONS = [
    {
        "prompt": "How many continents are there in the world?",
        "options": ["5", "6", "7"],
        "answer_key": "7",
    }
]

DEFAULT_HANZI_QUESTIONS = [
    {
        "prompt": "Which character means 'big'?",
        "options": ["大", "小", "水"],
        "answer_key": "大",
    }
]

DEFAULT_WRITING_PROMPTS = [
    "Describe your favorite hobby.",
    "What is the best book you've read recently?",
]

DEFAULT_SPEAK_PROMPTS = [
    "Talk about your hometown.",
    "Explain a recent challenge you faced.",
]


def _gpt_json(prompt: str) -> Dict | str:
    """Small helper for chat completion returning parsed JSON or raw text."""
    if openai and API_KEY:
        try:
            openai.api_key = API_KEY
            resp = openai.ChatCompletion.create(
                model=MODEL,
                messages=[{"role": "system", "content": prompt}],
                temperature=0,
            )
            content = resp.choices[0].message.content
            try:
                return json.loads(content)
            except Exception:
                return content
        except Exception:
            pass
    return ""


def generate_mc_question(skill: str) -> Dict:
    """Create a multiple choice question for a skill."""
    mapping = {
        "grammar": DEFAULT_GRAMMAR_QUESTIONS,
        "reading": DEFAULT_READING_QUESTIONS,
        "listening": DEFAULT_LISTENING_QUESTIONS,
        "hanzi": DEFAULT_HANZI_QUESTIONS,
    }
    data = _gpt_json(
        f"Create a short {skill} question for an English learner. "
        "Return JSON with prompt, options (3 items), and answer_key."
    )
    if isinstance(data, dict) and all(k in data for k in ("prompt", "options", "answer_key")):
        return data
    return random.choice(mapping[skill])


def generate_prompt(kind: str) -> str:
    """Generate a short writing or speaking prompt."""
    prompt = _gpt_json(f"Provide one sentence {kind} prompt for an English learner")
    if isinstance(prompt, str) and prompt.strip():
        return prompt.strip()
    if kind == "writing":
        return random.choice(DEFAULT_WRITING_PROMPTS)
    return random.choice(DEFAULT_SPEAK_PROMPTS)
