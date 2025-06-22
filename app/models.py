from sqlalchemy import Column, Integer, String

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    target_ielts = Column(Integer)
    target_hsk = Column(Integer)
