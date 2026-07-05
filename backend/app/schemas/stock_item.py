from pydantic import BaseModel
from typing import Optional


class StockItemCreate(BaseModel):
    product_name: str
    product_code: str

    purchase_price: float = 0
    selling_price: float = 0
    gst_percentage: float = 0

    opening_stock: int = 0
    minimum_stock: int = 0

    description: Optional[str] = None
    status: str = "Active"

    category_id: int
    unit_id: int
    company_id: int


class StockItemUpdate(BaseModel):
    product_name: Optional[str] = None
    product_code: Optional[str] = None

    purchase_price: Optional[float] = None
    selling_price: Optional[float] = None
    gst_percentage: Optional[float] = None

    opening_stock: Optional[int] = None
    current_stock: Optional[int] = None
    minimum_stock: Optional[int] = None

    description: Optional[str] = None
    status: Optional[str] = None

    category_id: Optional[int] = None
    unit_id: Optional[int] = None