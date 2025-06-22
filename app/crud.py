import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from . import ai_utils

from . import models, schemas


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: int) -> models.User | None:
    """Return a user by ID or None if not found."""
    return db.query(models.User).filter(models.User.id == user_id).first()


def list_users(db: Session) -> list[models.User]:
    """Return all users."""
    return db.query(models.User).all()


def get_test(db: Session, exam_type: str, section: str) -> models.Test | None:
    return (
        db.query(models.Test)
        .filter(models.Test.exam_type == exam_type, models.Test.section == section)
        .order_by(models.Test.id.desc())
        .first()
    )


def record_attempt(
    db: Session, user_id: int, test: models.Test, answers: list[schemas.AnswerCreate]
) -> models.Attempt:
    correct = 0
    attempt = models.Attempt(user_id=user_id, test_id=test.id)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    for ans in answers:
        # SQLAlchemy 2.x recommends Session.get rather than Query.get
        q = db.get(models.Question, ans.question_id)
        is_correct = q and q.answer_key == ans.response
        db.add(
            models.Answer(
                attempt_id=attempt.id,
                question_id=ans.question_id,
                response=ans.response,
                correct=is_correct,
            )
        )
        if is_correct:
            correct += 1
    total = len(answers) or 1
    attempt.score = correct / total * 100
    db.commit()
    update_skill_profile(db, user_id, test.section.lower(), attempt.score)
    record_study_session(db, user_id, 15)
    db.refresh(attempt)
    return attempt


def update_skill_profile(db: Session, user_id: int, skill: str, score: float) -> None:
    profile = (
        db.query(models.SkillProfile)
        .filter(
            models.SkillProfile.user_id == user_id,
            models.SkillProfile.skill_code == skill,
        )
        .first()
    )
    if not profile:
        profile = models.SkillProfile(
            user_id=user_id, skill_code=skill, mastery_pct=score
        )
        db.add(profile)
    else:
        profile.mastery_pct = (profile.mastery_pct + score) / 2
    db.commit()


def latest_attempts(
    db: Session, user_id: int, exam_type: str, limit: int = 2
) -> list[models.Attempt]:
    return (
        db.query(models.Attempt)
        .join(models.Test)
        .filter(models.Attempt.user_id == user_id, models.Test.exam_type == exam_type)
        .order_by(models.Attempt.created_at.desc())
        .limit(limit)
        .all()
    )


def exam_ready(db: Session, user: models.User, exam_type: str) -> bool:
    attempts = latest_attempts(db, user.id, exam_type, 2)
    if len(attempts) < 2:
        return False
    scores = [a.score for a in attempts]
    mean = sum(scores) / 2
    variance = sum((s - mean) ** 2 for s in scores) / 2
    std = variance**0.5
    if exam_type == "IELTS":
        target = user.target_ielts * 10  # treat as 7.0 -> 70
        threshold = 0.25 * 10
    else:
        target = user.target_hsk
        threshold = 15
    return min(scores) >= target and std < threshold


def record_essay_attempt(
    db: Session, user_id: int, text: str, feedback: dict
) -> models.EssayAttempt:
    attempt = models.EssayAttempt(
        user_id=user_id,
        essay_text=text,
        feedback_json=json.dumps(feedback),
        score=feedback.get("overall_band", 0) * 10,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    update_skill_profile(db, user_id, "writing", attempt.score)
    record_study_session(db, user_id, 15)
    return attempt


def record_study_session(db: Session, user_id: int, minutes: int) -> models.StudySession:
    session = models.StudySession(user_id=user_id, minutes=minutes)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def recent_scores(db: Session, user_id: int, limit: int = 5) -> list[dict]:
    attempts = (
        db.query(models.Attempt, models.Test.section)
        .join(models.Test)
        .filter(models.Attempt.user_id == user_id)
        .order_by(models.Attempt.created_at.desc())
        .limit(limit)
        .all()
    )
    essays = (
        db.query(models.EssayAttempt)
        .filter(models.EssayAttempt.user_id == user_id)
        .order_by(models.EssayAttempt.created_at.desc())
        .limit(limit)
        .all()
    )
    scores = [
        {
            "label": sec,
            "score": att.score,
            "created_at": att.created_at.isoformat(),
        }
        for att, sec in attempts
    ] + [
        {
            "label": "Writing",
            "score": essay.score,
            "created_at": essay.created_at.isoformat(),
        }
        for essay in essays
    ]
    scores.sort(key=lambda x: x["created_at"], reverse=True)
    return scores[:limit]


def study_time_trend(db: Session, user_id: int, days: int = 7) -> list[dict]:
    cutoff = datetime.utcnow().date().toordinal() - days + 1
    sessions = (
        db.query(models.StudySession)
        .filter(models.StudySession.user_id == user_id)
        .order_by(models.StudySession.created_at.desc())
        .all()
    )
    totals = {}
    for s in sessions:
        day = s.created_at.date().isoformat()
        if datetime.fromisoformat(day).date().toordinal() < cutoff:
            continue
        totals[day] = totals.get(day, 0) + s.minutes
    trend = [
        {"date": day, "minutes": totals.get(day, 0)}
        for day in sorted(totals.keys())
    ]
    return trend


def recommend_tasks(db: Session, user: models.User, top_n: int = 3) -> list[str]:
    """Return a list of practice suggestions sorted by mastery gap."""
    profile = (
        db.query(models.SkillProfile)
        .filter(models.SkillProfile.user_id == user.id)
        .all()
    )
    english = {"reading", "listening", "writing", "speaking", "grammar"}
    skill_gaps: list[tuple[float, str]] = []
    for p in profile:
        target = user.target_ielts * 10 if p.skill_code in english else user.target_hsk
        gap = target - p.mastery_pct
        skill_gaps.append((gap, p.skill_code))
    skill_gaps.sort(key=lambda g: g[0], reverse=True)
    return [f"Practice {code.title()}" for _, code in skill_gaps[:top_n]]


def next_vocab_item(db: Session, user_id: int) -> models.Vocabulary | None:
    progress = (
        db.query(models.VocabProgress)
        .filter(models.VocabProgress.user_id == user_id)
        .order_by(models.VocabProgress.next_due)
        .first()
    )
    if progress and progress.next_due <= datetime.utcnow():
        return db.get(models.Vocabulary, progress.vocab_id)
    vocab = db.query(models.Vocabulary).first()
    if vocab and not progress:
        db.add(
            models.VocabProgress(user_id=user_id, vocab_id=vocab.id)
        )
        db.commit()
        return vocab
    return progress and db.get(models.Vocabulary, progress.vocab_id)


def update_vocab_progress(db: Session, user_id: int, vocab_id: int, correct: bool) -> None:
    progress = (
        db.query(models.VocabProgress)
        .filter_by(user_id=user_id, vocab_id=vocab_id)
        .first()
    )
    if not progress:
        progress = models.VocabProgress(user_id=user_id, vocab_id=vocab_id)
        db.add(progress)
    if correct:
        progress.interval = min(progress.interval * 2, 30)
    else:
        progress.interval = 1
    progress.next_due = datetime.utcnow() + timedelta(days=progress.interval)
    db.commit()
    record_study_session(db, user_id, 1)


def grade_speaking(transcript: str) -> dict:
    return ai_utils.grade_speaking(transcript)

def speaking_feedback(audio_bytes: bytes) -> dict:
    return ai_utils.speaking_feedback(audio_bytes)
