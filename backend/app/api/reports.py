from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.auth.current_user import get_current_user
from app.models.user import User
from app.models.sales import Sales
from app.models.purchase import Purchase
from app.models.stock_item import StockItem
from app.models.customer import Customer
from app.models.supplier import Supplier
from fastapi.responses import FileResponse
from app.utils.excel_export import create_excel_file

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/sales")
def sales_report(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Sales).filter(Sales.company_id == company_id, Sales.owner_id == current_user.id).all()


@router.get("/purchases")
def purchase_report(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Purchase).filter(Purchase.company_id == company_id, Purchase.owner_id == current_user.id).all()


@router.get("/stock")
def stock_report(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stock_items = db.query(StockItem).filter(
        StockItem.company_id == company_id,
        StockItem.owner_id == current_user.id
    ).all()

    return [
        {
            "product_name": item.product_name,
            "product_code": item.product_code,
            "current_stock": item.current_stock,
            "minimum_stock": item.minimum_stock,
            "purchase_price": item.purchase_price,
            "selling_price": item.selling_price,
            "stock_value": item.current_stock * item.purchase_price,
            "status": "Low Stock" if item.current_stock <= item.minimum_stock else "Available"
        }
        for item in stock_items
    ]


@router.get("/customer-ledger/{customer_id}")
def customer_ledger(customer_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.id == customer_id, Customer.owner_id == current_user.id).first()
    sales = db.query(Sales).filter(Sales.customer_id == customer_id, Sales.owner_id == current_user.id).all()

    total_sales = sum(sale.total_amount for sale in sales)

    return {
        "customer": customer,
        "opening_balance": customer.opening_balance if customer else 0,
        "sales": sales,
        "total_sales": total_sales,
        "closing_balance": (customer.opening_balance if customer else 0) + total_sales
    }


@router.get("/supplier-ledger/{supplier_id}")
def supplier_ledger(supplier_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id, Supplier.owner_id == current_user.id).first()
    purchases = db.query(Purchase).filter(Purchase.supplier_id == supplier_id, Purchase.owner_id == current_user.id).all()

    total_purchase = sum(purchase.total_amount for purchase in purchases)

    return {
        "supplier": supplier,
        "opening_balance": supplier.opening_balance if supplier else 0,
        "purchases": purchases,
        "total_purchase": total_purchase,
        "closing_balance": (supplier.opening_balance if supplier else 0) + total_purchase
    }
    
@router.get("/sales/export")
def export_sales_report(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sales = db.query(Sales).filter(
        Sales.company_id == company_id,
        Sales.owner_id == current_user.id
    ).all()

    headers = ["Invoice No", "Customer ID", "Stock Item ID", "Quantity", "Selling Price", "Total Amount", "Date"]

    rows = [
        [
            sale.invoice_number,
            sale.customer_id,
            sale.stock_item_id,
            sale.quantity,
            sale.selling_price,
            sale.total_amount,
            sale.created_at.strftime("%d-%m-%Y")
        ]
        for sale in sales
    ]

    file_path = create_excel_file(
        filename="sales_report.xlsx",
        sheet_name="Sales Report",
        headers=headers,
        rows=rows
    )

    return FileResponse(
        path=file_path,
        filename="sales_report.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )


@router.get("/purchases/export")
def export_purchase_report(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    purchases = db.query(Purchase).filter(
        Purchase.company_id == company_id,
        Purchase.owner_id == current_user.id
    ).all()

    headers = ["Bill No", "Supplier ID", "Stock Item ID", "Quantity", "Purchase Price", "Total Amount", "Date"]

    rows = [
        [
            purchase.bill_number,
            purchase.supplier_id,
            purchase.stock_item_id,
            purchase.quantity,
            purchase.purchase_price,
            purchase.total_amount,
            purchase.created_at.strftime("%d-%m-%Y")
        ]
        for purchase in purchases
    ]

    file_path = create_excel_file(
        filename="purchase_report.xlsx",
        sheet_name="Purchase Report",
        headers=headers,
        rows=rows
    )

    return FileResponse(
        path=file_path,
        filename="purchase_report.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )


@router.get("/stock/export")
def export_stock_report(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stock_items = db.query(StockItem).filter(
        StockItem.company_id == company_id,
        StockItem.owner_id == current_user.id
    ).all()

    headers = ["Product Name", "Product Code", "Current Stock", "Minimum Stock", "Purchase Price", "Selling Price", "Stock Value", "Status"]

    rows = [
        [
            item.product_name,
            item.product_code,
            item.current_stock,
            item.minimum_stock,
            item.purchase_price,
            item.selling_price,
            item.current_stock * item.purchase_price,
            "Low Stock" if item.current_stock <= item.minimum_stock else "Available"
        ]
        for item in stock_items
    ]

    file_path = create_excel_file(
        filename="stock_report.xlsx",
        sheet_name="Stock Report",
        headers=headers,
        rows=rows
    )

    return FileResponse(
        path=file_path,
        filename="stock_report.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )