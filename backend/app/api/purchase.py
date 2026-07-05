from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.purchase import Purchase
from app.models.stock_item import StockItem
from app.models.user import User
from app.schemas.purchase import PurchaseCreate
from app.auth.current_user import get_current_user

router = APIRouter(prefix="/purchases", tags=["Purchases"])


@router.post("/")
def create_purchase(
    purchase: PurchaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stock_item = db.query(StockItem).filter(
        StockItem.id == purchase.stock_item_id,
        StockItem.owner_id == current_user.id
    ).first()

    if not stock_item:
        raise HTTPException(status_code=404, detail="Stock item not found")

    total_amount = purchase.quantity * purchase.purchase_price

    new_purchase = Purchase(
        bill_number=purchase.bill_number,
        supplier_id=purchase.supplier_id,
        stock_item_id=purchase.stock_item_id,
        quantity=purchase.quantity,
        purchase_price=purchase.purchase_price,
        total_amount=total_amount,
        company_id=purchase.company_id,
        owner_id=current_user.id
    )

    stock_item.current_stock += purchase.quantity
    stock_item.purchase_price = purchase.purchase_price

    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)

    return {
        "message": "Purchase added successfully and stock updated",
        "purchase": new_purchase,
        "updated_stock": stock_item.current_stock
    }


@router.get("/")
def get_purchases(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Purchase).filter(
        Purchase.company_id == company_id,
        Purchase.owner_id == current_user.id
    ).all()


@router.get("/{purchase_id}")
def get_purchase(
    purchase_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    purchase = db.query(Purchase).filter(
        Purchase.id == purchase_id,
        Purchase.owner_id == current_user.id
    ).first()

    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    return purchase