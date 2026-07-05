from pydantic import BaseModel
from typing import Optional


class UnitCreate(BaseModel):
    unit_name: str
    short_name: str
    company_id: int


class UnitUpdate(BaseModel):
    unit_name: Optional[str] = None
    short_name: Optional[str] = None