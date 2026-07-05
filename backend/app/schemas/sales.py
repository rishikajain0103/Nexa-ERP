from pydantic import BaseModel


class SalesCreate(BaseModel):
    invoice_number: str
    customer_id: int
    stock_item_id: int
    quantity: int
    selling_price: float
    company_id: int