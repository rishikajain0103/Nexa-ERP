from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.auth.current_user import get_current_user

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("/")
def create_category(category: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_category = Category(
        category_name=category.category_name,
        company_id=category.company_id,
        owner_id=current_user.id
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return {"message": "Category created successfully", "category": new_category}


@router.get("/")
def get_categories(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Category).filter(
        Category.company_id == company_id,
        Category.owner_id == current_user.id
    ).all()


@router.get("/{category_id}")
def get_category(category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.owner_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


@router.put("/{category_id}")
def update_category(category_id: int, updated_category: CategoryUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.owner_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    for key, value in updated_category.model_dump(exclude_unset=True).items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)

    return {"message": "Category updated successfully", "category": category}


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.owner_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()

    return {"message": "Category deleted successfully"}