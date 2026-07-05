from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime
from app.database.connection import Base


class Sales(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)

    invoice_number = Column(String(50), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    stock_item_id = Column(Integer, ForeignKey("stock_items.id"))

    quantity = Column(Integer, nullable=False)
    selling_price = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)

    company_id = Column(Integer, ForeignKey("companies.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=datetime.utcnow)