from pydantic import BaseModel
from typing import Optional


class CategoryCreate(BaseModel):
    category_name: str
    company_id: int


class CategoryUpdate(BaseModel):
    category_name: Optional[str] = None