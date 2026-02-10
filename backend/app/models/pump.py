from sqlalchemy import Column, Integer, String
from app.database import Base

class Pump(Base):
    __tablename__ = "pumps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)
