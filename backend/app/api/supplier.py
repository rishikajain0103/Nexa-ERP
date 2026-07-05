from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.supplier import Supplier
from app.models.user import User
from app.schemas.supplier import SupplierCreate, SupplierUpdate
from app.auth.current_user import get_current_user

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])


@router.post("/")
def create_supplier(supplier: SupplierCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_supplier = Supplier(**supplier.model_dump(), owner_id=current_user.id)
    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)
    return {"message": "Supplier created successfully", "supplier": new_supplier}


@router.get("/")
def get_suppliers(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Supplier).filter(Supplier.owner_id == current_user.id, Supplier.company_id == company_id).all()


@router.get("/{supplier_id}")
def get_supplier(supplier_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id, Supplier.owner_id == current_user.id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier


@router.put("/{supplier_id}")
def update_supplier(supplier_id: int, updated_supplier: SupplierUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id, Supplier.owner_id == current_user.id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    for key, value in updated_supplier.model_dump(exclude_unset=True).items():
        setattr(supplier, key, value)

    db.commit()
    db.refresh(supplier)
    return {"message": "Supplier updated successfully", "supplier": supplier}


@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id, Supplier.owner_id == current_user.id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    db.delete(supplier)
    db.commit()
    return {"message": "Supplier deleted successfully"}