from pathlib import Path
import json

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import mimetypes
from sqlalchemy.orm import Session

from .database import engine, SessionLocal
from . import models, schemas, crud
from .ai_utils import grade_essay, generate_mc_question, generate_prompt
from scripts.import_content import import_from_data

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend" / "out"

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SoloLingua Coach API")

# Ensure browsers recognize `.jsx` modules as JavaScript
mimetypes.add_type("text/javascript", ".jsx")

# Serve the frontend built with Next.js (static export)
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")


def seed_content(db: Session) -> None:
    """Create sample IELTS and HSK tests if none exist."""
    if db.query(models.Test).first():
        pass
    else:
        reading = models.Test(
            exam_type="IELTS",
            level=1,
            section="Reading",
            title="Sample Reading",
        )
        db.add(reading)
        db.commit()
        db.refresh(reading)
        reading_questions = [
            models.Question(
                test_id=reading.id,
                prompt="Which planet is known as the Red Planet?",
                options_json='["Earth", "Mars", "Venus"]',
                answer_key="Mars",
                skill_code="reading",
            ),
            models.Question(
                test_id=reading.id,
                prompt="Synonym of 'rapid'?",
                options_json='["slow", "quick", "dull"]',
                answer_key="quick",
                skill_code="reading",
            ),
            models.Question(
                test_id=reading.id,
                prompt="Antonym of 'ancient'?",
                options_json='["old", "modern", "historic"]',
                answer_key="modern",
                skill_code="reading",
            ),
            models.Question(
                test_id=reading.id,
                prompt="The committee _____ the proposal?",
                options_json='["accepts", "accept", "accepting"]',
                answer_key="accepts",
                skill_code="reading",
            ),
            models.Question(
                test_id=reading.id,
                prompt="Meaning of 'abundant'?",
                options_json='["scarce", "plentiful", "small"]',
                answer_key="plentiful",
                skill_code="reading",
            ),
        ]
        db.add_all(reading_questions)
        db.commit()

        listening = models.Test(
            exam_type="IELTS",
            level=1,
            section="Listening",
            title="Sample Listening",
        )
        db.add(listening)
        db.commit()
        db.refresh(listening)
        listening_questions = [
            models.Question(
                test_id=listening.id,
                prompt="How many seasons are there in a year?",
                options_json='["2", "4", "6"]',
                answer_key="4",
                skill_code="listening",
                audio_url="sample1.mp3",
            ),
            models.Question(
                test_id=listening.id,
                prompt="What color do you get when you mix blue and yellow?",
                options_json='["green", "purple", "orange"]',
                answer_key="green",
                skill_code="listening",
                audio_url="sample2.mp3",
            ),
            models.Question(
                test_id=listening.id,
                prompt="Which day comes after Friday?",
                options_json='["Thursday", "Saturday", "Sunday"]',
                answer_key="Saturday",
                skill_code="listening",
                audio_url="sample3.mp3",
            ),
            models.Question(
                test_id=listening.id,
                prompt="What is the opposite of 'noisy'?",
                options_json='["quiet", "loud", "bright"]',
                answer_key="quiet",
                skill_code="listening",
                audio_url="sample4.mp3",
            ),
            models.Question(
                test_id=listening.id,
                prompt="How many letters are in the English word 'test'?",
                options_json='["3", "4", "5"]',
                answer_key="4",
                skill_code="listening",
                audio_url="sample5.mp3",
            ),
        ]
        db.add_all(listening_questions)
        db.commit()

        hsk_char = models.Test(
            exam_type="HSK",
            level=1,
            section="Characters",
            title="HSK Characters",
        )
        db.add(hsk_char)
        db.commit()
        db.refresh(hsk_char)
        char_questions = [
            models.Question(
                test_id=hsk_char.id,
                prompt="What is the pinyin for the character '你'?",
                options_json='["ni3", "ta1", "wo3"]',
                answer_key="ni3",
                skill_code="hanzi",
            ),
            models.Question(
                test_id=hsk_char.id,
                prompt="Which character means 'water'?",
                options_json='["水", "火", "木"]',
                answer_key="水",
                skill_code="hanzi",
            ),
            models.Question(
                test_id=hsk_char.id,
                prompt="Meaning of '大'?",
                options_json='["small", "big", "old"]',
                answer_key="big",
                skill_code="hanzi",
            ),
        ]
        db.add_all(char_questions)
        db.commit()

        hsk_listen = models.Test(
            exam_type="HSK",
            level=1,
            section="Listening",
            title="HSK Listening",
        )
        db.add(hsk_listen)
        db.commit()
        db.refresh(hsk_listen)
        hsk_listen_questions = [
            models.Question(
                test_id=hsk_listen.id,
                prompt="What number is spoken in the clip?",
                options_json='["1", "2", "3"]',
                answer_key="2",
                skill_code="listening",
                audio_url="hsk1.mp3",
            ),
            models.Question(
                test_id=hsk_listen.id,
                prompt="Which word do you hear?",
                options_json='["hello", "goodbye", "thanks"]',
                answer_key="hello",
                skill_code="listening",
                audio_url="hsk2.mp3",
            ),
            models.Question(
                test_id=hsk_listen.id,
                prompt="Which tone is correct for 'ma' when it means 'horse'?",
                options_json='["ma1", "ma3", "ma4"]',
                answer_key="ma3",
                skill_code="listening",
                audio_url="hsk3.mp3",
            ),
        ]
        db.add_all(hsk_listen_questions)
        db.commit()

    if not db.query(models.Vocabulary).first():
        vocab = [
            models.Vocabulary(word="apple", definition="a fruit"),
            models.Vocabulary(word="book", definition="a reading item"),
            models.Vocabulary(word="cat", definition="a small animal"),
        ]
        db.add_all(vocab)
        db.commit()


with SessionLocal() as db:
    seed_content(db)


@app.get("/", include_in_schema=False)
def root() -> FileResponse:
    """Return the main frontend page generated by Next.js."""
    return FileResponse(FRONTEND_DIR / "index.html")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(db: Session = Depends(get_db)):
    return crud.list_users(db)


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/exams/IELTS/Writing")
def get_writing_prompt():
    return {
        "title": "IELTS Writing",
        "prompt": generate_prompt("writing"),
    }


@app.post("/exams/IELTS/Writing/submit", response_model=schemas.EssayAttempt)
def submit_writing(submission: schemas.EssaySubmission, db: Session = Depends(get_db)):
    user = crud.get_user(db, submission.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    feedback = grade_essay(submission.text)
    attempt = crud.record_essay_attempt(
        db, submission.user_id, submission.text, feedback
    )
    return {"id": attempt.id, "score": attempt.score, "feedback": feedback}


@app.get("/exams/{exam_type}/{section}", response_model=schemas.Test)
def get_exam(exam_type: str, section: str, db: Session = Depends(get_db)):
    skill = "hanzi" if section.lower() == "characters" else section.lower()
    test = models.Test(
        exam_type=exam_type,
        level=1,
        section=section,
        title=f"Generated {section}",
    )
    db.add(test)
    db.commit()
    db.refresh(test)
    questions = []
    for _ in range(5):
        qd = generate_mc_question(skill)
        q = models.Question(
            test_id=test.id,
            prompt=qd["prompt"],
            options_json=json.dumps(qd["options"]),
            answer_key=qd["answer_key"],
            skill_code=skill,
        )
        db.add(q)
        questions.append(q)
    db.commit()
    db.refresh(test)
    return test


@app.post("/exams/{exam_type}/{section}/submit", response_model=schemas.Attempt)
def submit_exam(
    exam_type: str,
    section: str,
    submission: schemas.ExamSubmission,
    db: Session = Depends(get_db),
):
    user = crud.get_user(db, submission.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    test = crud.get_test(db, exam_type, section)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    attempt = crud.record_attempt(db, submission.user_id, test, submission.answers)
    return attempt


@app.get("/dashboard/{user_id}")
def dashboard(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    ready = {
        "ielts": crud.exam_ready(db, user, "IELTS"),
        "hsk": crud.exam_ready(db, user, "HSK"),
    }
    profile = (
        db.query(models.SkillProfile)
        .filter(models.SkillProfile.user_id == user_id)
        .all()
    )
    return {
        "exam_ready": ready,
        "skill_profile": [
            {"skill": p.skill_code, "pct": p.mastery_pct} for p in profile
        ],
        "recommended_tasks": crud.recommend_tasks(db, user),
        "latest_scores": crud.recent_scores(db, user_id),
        "study_time": crud.study_time_trend(db, user_id),
    }


@app.get("/drills/vocab/{user_id}", response_model=schemas.VocabItem | None)
def get_vocab_drill(user_id: int, db: Session = Depends(get_db)):
    return crud.next_vocab_item(db, user_id)


@app.post("/drills/vocab/{user_id}/{vocab_id}")
def review_vocab_drill(
    user_id: int,
    vocab_id: int,
    review: schemas.VocabReview,
    db: Session = Depends(get_db),
):
    crud.update_vocab_progress(db, user_id, vocab_id, review.correct)
    return {"status": "ok"}


GENERATED_GRAMMAR: dict[int, dict] = {}
_GRAMMAR_ID = 1


@app.get("/drills/grammar/{user_id}")
def grammar_question(user_id: int) -> dict:
    global _GRAMMAR_ID
    q = generate_mc_question("grammar")
    q["id"] = _GRAMMAR_ID
    GENERATED_GRAMMAR[_GRAMMAR_ID] = q
    _GRAMMAR_ID += 1
    return q


@app.post("/drills/grammar/{user_id}/{question_id}")
def grammar_answer(
    user_id: int,
    question_id: int,
    answer: schemas.GrammarAnswer,
    db: Session = Depends(get_db),
):
    q = GENERATED_GRAMMAR.pop(question_id, None)
    correct = bool(q and answer.answer == q["answer_key"])
    score = 100 if correct else 0
    crud.update_skill_profile(db, user_id, "grammar", score)
    crud.record_study_session(db, user_id, 1)
    return {"correct": correct}


@app.get("/drills/quick-write")
def quick_write_prompt():
    return {"prompt": generate_prompt("writing")}


@app.post("/drills/quick-write/submit", response_model=schemas.EssayAttempt)
def quick_write_submit(submission: schemas.EssaySubmission, db: Session = Depends(get_db)):
    feedback = grade_essay(submission.text)
    attempt = crud.record_essay_attempt(db, submission.user_id, submission.text, feedback)
    return {"id": attempt.id, "score": attempt.score, "feedback": feedback}


@app.get("/drills/quick-speak")
def quick_speak_prompt():
    return {"prompt": generate_prompt("speaking")}


@app.post("/drills/quick-speak/submit")
def quick_speak_submit(submission: schemas.SpeakSubmission, db: Session = Depends(get_db)):
    feedback = crud.grade_speaking(submission.transcript)
    crud.record_study_session(db, submission.user_id, 1)
    return {"feedback": feedback}

@app.post("/feedback/speaking")
async def speaking_feedback(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    data = await file.read()
    feedback = crud.speaking_feedback(data)
    crud.record_study_session(db, user_id, 1)
    return feedback


@app.post("/admin/import")
async def admin_import(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a JSON file with tests and vocab to import into the database."""
    data = json.loads((await file.read()).decode("utf-8"))
    import_from_data(data, db)
    return {"status": "ok"}

