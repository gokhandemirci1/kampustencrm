from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Customer, CollaborationCode
from app.schemas import CustomerCreate, CustomerResponse
from app.dependencies import get_current_user, require_permission
from app.utils import parse_prices

router = APIRouter()


@router.get("", response_model=List[CustomerResponse])
async def get_customers(
    include_deleted: bool = Query(False, alias="includeDeleted"),
    current_user = Depends(require_permission("can_manage_customers")),
    db: Session = Depends(get_db)
):
    """Tüm müşterileri getir"""
    query = db.query(Customer)
    if not include_deleted:
        query = query.filter(Customer.is_deleted == False)
    
    customers = query.order_by(Customer.created_at.desc()).all()
    return customers


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(
    customer_data: CustomerCreate,
    current_user = Depends(require_permission("can_manage_customers")),
    db: Session = Depends(get_db)
):
    """Yeni müşteri ekle"""
    # Kod kontrolü
    if customer_data.code:
        code_exists = db.query(CollaborationCode).filter(
            CollaborationCode.code == customer_data.code,
            CollaborationCode.is_active == True
        ).first()
        
        if not code_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Geçersiz işbirliği kodu"
            )
    
    # Fiyatları JSON string'e çevir
    import json
    try:
        # Eğer zaten JSON değilse
        json.loads(customer_data.prices)
        prices_str = customer_data.prices
    except json.JSONDecodeError:
        # Comma-separated string ise array'e çevir
        prices_array = parse_prices(customer_data.prices)
        prices_str = json.dumps(prices_array)
    
    customer = Customer(
        name=customer_data.name,
        surname=customer_data.surname,
        phone=customer_data.phone,
        email=customer_data.email,
        grade=customer_data.grade,
        camps=customer_data.camps,
        prices=prices_str,
        code=customer_data.code,
        previous_rank=customer_data.previous_rank,
        city=customer_data.city
    )
    
    db.add(customer)
    db.commit()
    db.refresh(customer)
    
    return customer


@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: str,
    reason: Optional[str] = Query("Ödeme alınmadı"),
    current_user = Depends(require_permission("can_manage_customers")),
    db: Session = Depends(get_db)
):
    """Müşteriyi sil (soft delete)"""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Müşteri bulunamadı"
        )
    
    customer.is_deleted = True
    customer.deleted_reason = reason
    
    db.commit()
    db.refresh(customer)
    
    return {"message": "Müşteri silindi"}

