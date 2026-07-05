from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.sales import Sales
from app.models.stock_item import StockItem
from app.models.user import User
from app.schemas.sales import SalesCreate
from app.auth.current_user import get_current_user
from fastapi.responses import FileResponse
from app.models.customer import Customer
from app.models.company import Company
from app.utils.invoice_pdf import generate_invoice_pdf

router = APIRouter(prefix="/sales", tags=["Sales"])


@router.post("/")
def create_sale(
    sale: SalesCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stock_item = db.query(StockItem).filter(
        StockItem.id == sale.stock_item_id,
        StockItem.owner_id == current_user.id
    ).first()

    if not stock_item:
        raise HTTPException(status_code=404, detail="Stock item not found")

    if stock_item.current_stock < sale.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")

    total_amount = sale.quantity * sale.selling_price

    new_sale = Sales(
        invoice_number=sale.invoice_number,
        customer_id=sale.customer_id,
        stock_item_id=sale.stock_item_id,
        quantity=sale.quantity,
        selling_price=sale.selling_price,
        total_amount=total_amount,
        company_id=sale.company_id,
        owner_id=current_user.id
    )

    stock_item.current_stock -= sale.quantity
    stock_item.selling_price = sale.selling_price

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    return {
        "message": "Sale created successfully and stock updated",
        "sale": new_sale,
        "remaining_stock": stock_item.current_stock
    }


@router.get("/")
def get_sales(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Sales).filter(
        Sales.company_id == company_id,
        Sales.owner_id == current_user.id
    ).all()


@router.get("/{sale_id}")
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sale = db.query(Sales).filter(
        Sales.id == sale_id,
        Sales.owner_id == current_user.id
    ).first()

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    return sale

@router.get("/{sale_id}/invoice")
def download_invoice(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sale = db.query(Sales).filter(
        Sales.id == sale_id,
        Sales.owner_id == current_user.id
    ).first()

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    customer = db.query(Customer).filter(Customer.id == sale.customer_id).first()
    stock_item = db.query(StockItem).filter(StockItem.id == sale.stock_item_id).first()
    company = db.query(Company).filter(Company.id == sale.company_id).first()

    pdf_path = generate_invoice_pdf(sale, customer, stock_item, company)

    return FileResponse(
        path=pdf_path,
        filename=f"invoice_{sale.invoice_number}.pdf",
        media_type="application/pdf"
    )