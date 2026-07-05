from pydantic import BaseModel
from typing import Optional


class CustomerCreate(BaseModel):
    customer_name: str
    mobile_number: Optional[str] = None
    email: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    opening_balance: float = 0
    company_id: int


class CustomerUpdate(BaseModel):
    customer_name: Optional[str] = None
    mobile_number: Optional[str] = None
    email: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    opening_balance: Optional[float] = None


class CustomerResponse(CustomerCreate):
    id: int
    owner_id: int

    class Config:
        from_attributes = True