from pydantic import BaseModel


class PurchaseCreate(BaseModel):
    bill_number: str
    supplier_id: int
    stock_item_id: int
    quantity: int
    purchase_price: float
    company_id: int