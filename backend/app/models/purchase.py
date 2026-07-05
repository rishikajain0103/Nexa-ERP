from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime
from app.database.connection import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)

    bill_number = Column(String(50), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    stock_item_id = Column(Integer, ForeignKey("stock_items.id"))

    quantity = Column(Integer, nullable=False)
    purchase_price = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)

    company_id = Column(Integer, ForeignKey("companies.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=datetime.utcnow)