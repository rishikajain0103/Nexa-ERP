from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.customer import Customer
from app.models.user import User
from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.auth.current_user import get_current_user

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post("/")
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_customer = Customer(
        customer_name=customer.customer_name,
        mobile_number=customer.mobile_number,
        email=customer.email,
        gst_number=customer.gst_number,
        address=customer.address,
        opening_balance=customer.opening_balance,
        company_id=customer.company_id,
        owner_id=current_user.id
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return {
        "message": "Customer created successfully",
        "customer": new_customer
    }


@router.get("/")
def get_customers(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Customer).filter(
        Customer.owner_id == current_user.id,
        Customer.company_id == company_id
    ).all()


@router.get("/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.owner_id == current_user.id
    ).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    return customer


@router.put("/{customer_id}")
def update_customer(
    customer_id: int,
    updated_customer: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.owner_id == current_user.id
    ).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    update_data = updated_customer.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(customer, key, value)

    db.commit()
    db.refresh(customer)

    return {
        "message": "Customer updated successfully",
        "customer": customer
    }


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.owner_id == current_user.id
    ).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    db.delete(customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }