from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    target_ielts: int
    target_hsk: int

class User(UserCreate):
    id: int

    class Config:
        orm_mode = True
