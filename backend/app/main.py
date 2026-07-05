from fastapi import FastAPI
from app.database.connection import Base, engine

from app.models.user import User
from app.models.company import Company
from app.api import auth, company
from app.models.customer import Customer
from app.api import auth, company, customer
from app.models.supplier import Supplier
from app.models.category import Category
from app.models.unit import Unit
from app.models.stock_item import StockItem
from app.models.purchase import Purchase
from app.models.sales import Sales
from fastapi.middleware.cors import CORSMiddleware


from app.api import auth, company, customer, supplier, category, unit, stock_item,purchase,sales,dashboard,reports

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nexa ERP API",
    description="Keyboard First Billing, Inventory & Accounting System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(company.router)
app.include_router(customer.router)
app.include_router(supplier.router)
app.include_router(category.router)
app.include_router(unit.router)
app.include_router(stock_item.router)
app.include_router(purchase.router)
app.include_router(sales.router)
app.include_router(dashboard.router)
app.include_router(reports.router)

@app.get("/")
def home():
    return {
        "message": "Welcome to Nexa ERP",
        "status": "Backend Running",
        "database": "Connected"
    }