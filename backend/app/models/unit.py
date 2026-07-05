from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from app.database.connection import Base


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    unit_name = Column(String(50), nullable=False)
    short_name = Column(String(20), nullable=False)

    company_id = Column(Integer, ForeignKey("companies.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=datetime.utcnow)