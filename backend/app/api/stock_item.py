from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.stock_item import StockItem
from app.models.user import User
from app.schemas.stock_item import StockItemCreate, StockItemUpdate
from app.auth.current_user import get_current_user

router = APIRouter(prefix="/stock-items", tags=["Stock Items"])


@router.post("/")
def create_stock_item(
    item: StockItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_item = db.query(StockItem).filter(
        StockItem.product_code == item.product_code,
        StockItem.owner_id == current_user.id
    ).first()

    if existing_item:
        raise HTTPException(status_code=400, detail="Product code already exists")

    new_item = StockItem(
        product_name=item.product_name,
        product_code=item.product_code,
        purchase_price=item.purchase_price,
        selling_price=item.selling_price,
        gst_percentage=item.gst_percentage,
        opening_stock=item.opening_stock,
        current_stock=item.opening_stock,
        minimum_stock=item.minimum_stock,
        description=item.description,
        status=item.status,
        category_id=item.category_id,
        unit_id=item.unit_id,
        company_id=item.company_id,
        owner_id=current_user.id
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {
        "message": "Stock item created successfully",
        "stock_item": new_item
    }


@router.get("/")
def get_stock_items(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(StockItem).filter(
        StockItem.company_id == company_id,
        StockItem.owner_id == current_user.id
    ).all()


@router.get("/{item_id}")
def get_stock_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(StockItem).filter(
        StockItem.id == item_id,
        StockItem.owner_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Stock item not found")

    return item


@router.put("/{item_id}")
def update_stock_item(
    item_id: int,
    updated_item: StockItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(StockItem).filter(
        StockItem.id == item_id,
        StockItem.owner_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Stock item not found")

    update_data = updated_item.model_dump(exclude_unset=True)

    if "product_code" in update_data:
        existing_code = db.query(StockItem).filter(
            StockItem.product_code == update_data["product_code"],
            StockItem.owner_id == current_user.id,
            StockItem.id != item_id
        ).first()

        if existing_code:
            raise HTTPException(status_code=400, detail="Product code already exists")

    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    return {
        "message": "Stock item updated successfully",
        "stock_item": item
    }


@router.delete("/{item_id}")
def delete_stock_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(StockItem).filter(
        StockItem.id == item_id,
        StockItem.owner_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Stock item not found")

    db.delete(item)
    db.commit()

    return {
        "message": "Stock item deleted successfully"
    }


@router.get("/low-stock/")
def get_low_stock_items(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(StockItem).filter(
        StockItem.company_id == company_id,
        StockItem.owner_id == current_user.id,
        StockItem.current_stock <= StockItem.minimum_stock
    ).all()