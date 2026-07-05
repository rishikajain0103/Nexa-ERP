from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime
from app.database.connection import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(150), nullable=False)
    mobile_number = Column(String(20))
    email = Column(String(100))
    gst_number = Column(String(30))
    address = Column(String(300))
    opening_balance = Column(Float, default=0)
    owner_id = Column(Integer, ForeignKey("users.id"))
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)