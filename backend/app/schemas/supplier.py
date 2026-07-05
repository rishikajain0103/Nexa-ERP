from pydantic import BaseModel
from typing import Optional


class SupplierCreate(BaseModel):
    supplier_name: str
    mobile_number: Optional[str] = None
    email: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    opening_balance: float = 0
    company_id: int


class SupplierUpdate(BaseModel):
    supplier_name: Optional[str] = None
    mobile_number: Optional[str] = None
    email: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    opening_balance: Optional[float] = None