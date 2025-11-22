from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Customer, CollaborationCode
from app.schemas import CollaborationStatsResponse
from typing import Dict, Any
from app.dependencies import get_current_user, require_permission
from app.utils import parse_prices

router = APIRouter()


@router.get("", response_model=CollaborationStatsResponse)
async def get_collaboration_stats(
    current_user = Depends(require_permission("can_view_collaboration_stats")),
    db: Session = Depends(get_db)
):
    """İşbirliği kodları istatistiklerini getir"""
    # Tüm aktif kodları çek
    codes = db.query(CollaborationCode).filter(
        CollaborationCode.is_active == True
    ).order_by(CollaborationCode.created_at.desc()).all()
    
    stats = []
    
    for code in codes:
        # Bu kodla kaydolan müşterileri bul
        customers = db.query(Customer).filter(
            Customer.code == code.code,
            Customer.is_deleted == False
        ).all()
        
        # Toplam fiyatı hesapla
        total_revenue = 0
        for customer in customers:
            prices = parse_prices(customer.prices)
            total_revenue += sum(prices)
        
        stats.append({
            "code_id": code.id,
            "code": code.code,
            "customer_count": len(customers),
            "total_revenue": total_revenue
        })
    
    # Kodu olmayan müşteriler için istatistik
    customers_without_code = db.query(Customer).filter(
        Customer.code == None,
        Customer.is_deleted == False
    ).all()
    
    revenue_without_code = 0
    for customer in customers_without_code:
        prices = parse_prices(customer.prices)
        revenue_without_code += sum(prices)
    
    return CollaborationStatsResponse(
        stats=stats,
        without_code={
            "customer_count": len(customers_without_code),
            "total_revenue": revenue_without_code
        }
    )

