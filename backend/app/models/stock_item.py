from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime
from app.database.connection import Base


class StockItem(Base):
    __tablename__ = "stock_items"

    id = Column(Integer, primary_key=True, index=True)

    product_name = Column(String(150), nullable=False)
    product_code = Column(String(50), unique=True, nullable=False)

    purchase_price = Column(Float, default=0)
    selling_price = Column(Float, default=0)

    gst_percentage = Column(Float, default=0)

    opening_stock = Column(Integer, default=0)
    current_stock = Column(Integer, default=0)

    minimum_stock = Column(Integer, default=0)

    description = Column(String(300))

    status = Column(String(20), default="Active")

    category_id = Column(Integer, ForeignKey("categories.id"))
    unit_id = Column(Integer, ForeignKey("units.id"))
    company_id = Column(Integer, ForeignKey("companies.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=datetime.utcnow)