from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.unit import Unit
from app.models.user import User
from app.schemas.unit import UnitCreate, UnitUpdate
from app.auth.current_user import get_current_user

router = APIRouter(prefix="/units", tags=["Units"])


@router.post("/")
def create_unit(unit: UnitCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_unit = Unit(
        unit_name=unit.unit_name,
        short_name=unit.short_name,
        company_id=unit.company_id,
        owner_id=current_user.id
    )

    db.add(new_unit)
    db.commit()
    db.refresh(new_unit)

    return {"message": "Unit created successfully", "unit": new_unit}


@router.get("/")
def get_units(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Unit).filter(
        Unit.company_id == company_id,
        Unit.owner_id == current_user.id
    ).all()


@router.get("/{unit_id}")
def get_unit(unit_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    unit = db.query(Unit).filter(
        Unit.id == unit_id,
        Unit.owner_id == current_user.id
    ).first()

    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    return unit


@router.put("/{unit_id}")
def update_unit(unit_id: int, updated_unit: UnitUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    unit = db.query(Unit).filter(
        Unit.id == unit_id,
        Unit.owner_id == current_user.id
    ).first()

    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    for key, value in updated_unit.model_dump(exclude_unset=True).items():
        setattr(unit, key, value)

    db.commit()
    db.refresh(unit)

    return {"message": "Unit updated successfully", "unit": unit}


@router.delete("/{unit_id}")
def delete_unit(unit_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    unit = db.query(Unit).filter(
        Unit.id == unit_id,
        Unit.owner_id == current_user.id
    ).first()

    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    db.delete(unit)
    db.commit()

    return {"message": "Unit deleted successfully"}