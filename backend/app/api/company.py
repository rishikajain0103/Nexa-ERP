from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.company import Company
from app.models.user import User
from app.schemas.company import CompanyCreate, CompanyUpdate
from app.auth.current_user import get_current_user

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


@router.post("/")
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_company = Company(
        company_name=company.company_name,
        address=company.address,
        state=company.state,
        gst_number=company.gst_number,
        financial_year=company.financial_year,
        contact_number=company.contact_number,
        owner_id=current_user.id
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return {
        "message": "Company created successfully",
        "company": new_company
    }


@router.get("/")
def get_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Company).filter(
        Company.owner_id == current_user.id
    ).all()


@router.get("/{company_id}")
def get_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    company = db.query(Company).filter(
        Company.id == company_id,
        Company.owner_id == current_user.id
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    return company


@router.put("/{company_id}")
def update_company(
    company_id: int,
    updated_company: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    company = db.query(Company).filter(
        Company.id == company_id,
        Company.owner_id == current_user.id
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    update_data = updated_company.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(company, key, value)

    db.commit()
    db.refresh(company)

    return {
        "message": "Company updated successfully",
        "company": company
    }


@router.delete("/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    company = db.query(Company).filter(
        Company.id == company_id,
        Company.owner_id == current_user.id
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    db.delete(company)
    db.commit()

    return {"message": "Company deleted successfully"}