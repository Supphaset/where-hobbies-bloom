from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound

from .database import engine, Base, SessionLocal
from . import models, schemas, crud

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SoloLingua Coach API")

# Serve the frontend built with plain HTML/JS
app.mount("/static", StaticFiles(directory="frontend"), name="static")


def seed_content(db: Session) -> None:
    """Create a simple IELTS reading test with two questions if empty."""
    if db.query(models.Test).first():
        return
    test = models.Test(exam_type="IELTS", level=1, section="Reading", title="Sample Reading")
    db.add(test)
    db.commit()
    db.refresh(test)
    questions = [
        models.Question(
            test_id=test.id,
            prompt="What is 2 + 2?",
            options_json="[\"3\", \"4\", \"5\"]",
            answer_key="4",
            skill_code="reading",
        ),
        models.Question(
            test_id=test.id,
            prompt="Capital of France?",
            options_json="[\"London\", \"Paris\", \"Berlin\"]",
            answer_key="Paris",
            skill_code="reading",
        ),
    ]
    db.add_all(questions)
    db.commit()


with SessionLocal() as db:
    seed_content(db)


@app.get("/", include_in_schema=False)
def root() -> FileResponse:
    """Return the main frontend page."""
    return FileResponse("frontend/index.html")


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


@app.get("/exams/{exam_type}", response_model=schemas.Test)
def get_exam(exam_type: str, db: Session = Depends(get_db)):
    test = crud.get_test(db, exam_type)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test


@app.post("/exams/{exam_type}/submit", response_model=schemas.Attempt)
def submit_exam(exam_type: str, submission: schemas.ExamSubmission, db: Session = Depends(get_db)):
    user = crud.get_user(db, submission.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    test = crud.get_test(db, exam_type)
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
    profile = db.query(models.SkillProfile).filter(models.SkillProfile.user_id == user_id).all()
    return {
        "exam_ready": ready,
        "skill_profile": [{"skill": p.skill_code, "pct": p.mastery_pct} for p in profile],
    }
