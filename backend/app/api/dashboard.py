from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import get_db
from app.auth.current_user import get_current_user
from app.models.user import User
from app.models.customer import Customer
from app.models.supplier import Supplier
from app.models.stock_item import StockItem
from app.models.purchase import Purchase
from app.models.sales import Sales

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_customers = db.query(Customer).filter(
        Customer.company_id == company_id,
        Customer.owner_id == current_user.id
    ).count()

    total_suppliers = db.query(Supplier).filter(
        Supplier.company_id == company_id,
        Supplier.owner_id == current_user.id
    ).count()

    total_products = db.query(StockItem).filter(
        StockItem.company_id == company_id,
        StockItem.owner_id == current_user.id
    ).count()

    low_stock_count = db.query(StockItem).filter(
        StockItem.company_id == company_id,
        StockItem.owner_id == current_user.id,
        StockItem.current_stock <= StockItem.minimum_stock
    ).count()

    total_purchase = db.query(func.sum(Purchase.total_amount)).filter(
        Purchase.company_id == company_id,
        Purchase.owner_id == current_user.id
    ).scalar() or 0

    total_sales = db.query(func.sum(Sales.total_amount)).filter(
        Sales.company_id == company_id,
        Sales.owner_id == current_user.id
    ).scalar() or 0

    total_stock_value = db.query(
        func.sum(StockItem.current_stock * StockItem.purchase_price)
    ).filter(
        StockItem.company_id == company_id,
        StockItem.owner_id == current_user.id
    ).scalar() or 0

    profit_estimate = total_sales - total_purchase

    recent_sales = db.query(Sales).filter(
        Sales.company_id == company_id,
        Sales.owner_id == current_user.id
    ).order_by(Sales.created_at.desc()).limit(5).all()

    recent_purchases = db.query(Purchase).filter(
        Purchase.company_id == company_id,
        Purchase.owner_id == current_user.id
    ).order_by(Purchase.created_at.desc()).limit(5).all()

    return {
        "total_customers": total_customers,
        "total_suppliers": total_suppliers,
        "total_products": total_products,
        "low_stock_count": low_stock_count,
        "total_purchase": total_purchase,
        "total_sales": total_sales,
        "total_stock_value": total_stock_value,
        "profit_estimate": profit_estimate,
        "recent_sales": recent_sales,
        "recent_purchases": recent_purchases
    }