from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    target_ielts = Column(Integer)
    target_hsk = Column(Integer)


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    exam_type = Column(String, index=True)
    level = Column(Integer)
    section = Column(String)
    title = Column(String)
    questions = relationship("Question", back_populates="test")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"))
    prompt = Column(String)
    options_json = Column(String)
    answer_key = Column(String)
    skill_code = Column(String)
    audio_url = Column(String, nullable=True)
    test = relationship("Test", back_populates="questions")


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    test_id = Column(Integer, ForeignKey("tests.id"))
    score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    answers = relationship("Answer", back_populates="attempt")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    response = Column(String)
    correct = Column(Boolean)
    attempt = relationship("Attempt", back_populates="answers")


class SkillProfile(Base):
    __tablename__ = "skill_profile"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_code = Column(String, index=True)
    mastery_pct = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class EssayAttempt(Base):
    __tablename__ = "essay_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    essay_text = Column(String)
    feedback_json = Column(String)
    score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    minutes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Vocabulary(Base):
    __tablename__ = "vocabulary"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, unique=True, index=True)
    definition = Column(String)


class VocabProgress(Base):
    __tablename__ = "vocab_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vocab_id = Column(Integer, ForeignKey("vocabulary.id"))
    interval = Column(Integer, default=1)
    next_due = Column(DateTime, default=datetime.utcnow)
