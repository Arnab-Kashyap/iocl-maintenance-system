from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Pump(Base):
    __tablename__ = "pumps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, default="Active")

    # ✅ NEW FIELD
    last_maintenance_date = Column(DateTime, nullable=True)

    # Relationship
    maintenance_records = relationship(
        "Maintenance",
        back_populates="pump",
        cascade="all, delete"
    )
