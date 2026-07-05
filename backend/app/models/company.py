from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime

from app.database.connection import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String(150), nullable=False)

    address = Column(String(300))

    state = Column(String(100))

    gst_number = Column(String(30))

    financial_year = Column(String(20))

    contact_number = Column(String(20))

    owner_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=datetime.utcnow)