from sqlalchemy.orm import Session

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
        q = db.query(models.Question).get(ans.question_id)
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
    db.refresh(attempt)
    return attempt


def update_skill_profile(db: Session, user_id: int, skill: str, score: float) -> None:
    profile = (
        db.query(models.SkillProfile)
        .filter(models.SkillProfile.user_id == user_id, models.SkillProfile.skill_code == skill)
        .first()
    )
    if not profile:
        profile = models.SkillProfile(user_id=user_id, skill_code=skill, mastery_pct=score)
        db.add(profile)
    else:
        profile.mastery_pct = (profile.mastery_pct + score) / 2
    db.commit()


def latest_attempts(db: Session, user_id: int, exam_type: str, limit: int = 2) -> list[models.Attempt]:
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
    std = variance ** 0.5
    if exam_type == "IELTS":
        target = user.target_ielts * 10  # treat as 7.0 -> 70
        threshold = 0.25 * 10
    else:
        target = user.target_hsk
        threshold = 15
    return min(scores) >= target and std < threshold
