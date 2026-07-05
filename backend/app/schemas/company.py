from pydantic import BaseModel
from typing import Optional


class CompanyCreate(BaseModel):
    company_name: str
    address: Optional[str] = None
    state: Optional[str] = None
    gst_number: Optional[str] = None
    financial_year: Optional[str] = None
    contact_number: Optional[str] = None


class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    address: Optional[str] = None
    state: Optional[str] = None
    gst_number: Optional[str] = None
    financial_year: Optional[str] = None
    contact_number: Optional[str] = None


class CompanyResponse(CompanyCreate):
    id: int
    owner_id: int

    class Config:
        from_attributes = True