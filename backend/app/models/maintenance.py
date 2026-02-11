from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(Integer, primary_key=True, index=True)
    pump_id = Column(Integer, ForeignKey("pumps.id"))
    description = Column(String)
    status = Column(String)

    pump = relationship("Pump", back_populates="maintenance_records")
