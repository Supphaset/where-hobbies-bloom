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


class Attempt(BaseModel):
    id: int
    test_id: int
    score: float

    class Config:
        orm_mode = True


class ExamSubmission(BaseModel):
    user_id: int
    answers: list[AnswerCreate]
