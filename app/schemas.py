from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    target_ielts: int
    target_hsk: int


class User(UserCreate):
    id: int

    class Config:
        orm_mode = True


class Question(BaseModel):
    id: int
    prompt: str
    options_json: str
    answer_key: str
    skill_code: str
    audio_url: str | None = None

    class Config:
        orm_mode = True


class Test(BaseModel):
    id: int
    exam_type: str
    level: int
    section: str
    title: str
    questions: list[Question]

    class Config:
        orm_mode = True


class AnswerCreate(BaseModel):
    question_id: int
    response: str


class Answer(AnswerCreate):
    correct: bool

    class Config:
        orm_mode = True


class Attempt(BaseModel):
    id: int
    test_id: int
    score: float
    answers: list[Answer] = []

    class Config:
        orm_mode = True


class ExamSubmission(BaseModel):
    user_id: int
    answers: list[AnswerCreate]


class EssaySubmission(BaseModel):
    user_id: int
    text: str


class EssayAttempt(BaseModel):
    id: int
    score: float
    feedback: dict

    class Config:
        orm_mode = True


class StudySession(BaseModel):
    id: int
    minutes: int
    created_at: str

    class Config:
        orm_mode = True


class VocabItem(BaseModel):
    id: int
    word: str
    definition: str

    class Config:
        orm_mode = True


class VocabReview(BaseModel):
    correct: bool


class SpeakSubmission(BaseModel):
    user_id: int
    transcript: str
