from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from app.database.connection import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(100), nullable=False)

    company_id = Column(Integer, ForeignKey("companies.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=datetime.utcnow)