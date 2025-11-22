from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database import get_db
from app.models import Customer
from app.schemas import FinancialStats, CustomerRevenue
from app.dependencies import get_current_user, require_permission
from app.utils import parse_prices

router = APIRouter()


@router.get("/stats", response_model=FinancialStats)
async def get_financial_stats(
    current_user = Depends(require_permission("can_manage_financial")),
    db: Session = Depends(get_db)
):
    """Finansal istatistikleri getir"""
    now = datetime.utcnow()
    
    # Tarih aralıkları
    daily_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    daily_end = now
    
    # Haftalık başlangıç (Pazartesi)
    days_since_monday = now.weekday()
    weekly_start = (now - timedelta(days=days_since_monday)).replace(hour=0, minute=0, second=0, microsecond=0)
    weekly_end = now
    
    # Aylık başlangıç
    monthly_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_end = now
    
    # Yıllık başlangıç
    yearly_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    yearly_end = now
    
    # Tüm müşterileri çek
    all_customers = db.query(Customer).filter(Customer.is_deleted == False).all()
    
    def calculate_revenue(customers):
        total = 0
        for customer in customers:
            prices = parse_prices(customer.prices)
            total += sum(prices)
        return total
    
    # Filtreleme
    daily_customers = [c for c in all_customers if daily_start <= c.created_at <= daily_end]
    weekly_customers = [c for c in all_customers if weekly_start <= c.created_at <= weekly_end]
    monthly_customers = [c for c in all_customers if monthly_start <= c.created_at <= monthly_end]
    yearly_customers = [c for c in all_customers if yearly_start <= c.created_at <= yearly_end]
    
    return FinancialStats(
        daily={
            "revenue": calculate_revenue(daily_customers),
            "customer_count": len(daily_customers)
        },
        weekly={
            "revenue": calculate_revenue(weekly_customers),
            "customer_count": len(weekly_customers)
        },
        monthly={
            "revenue": calculate_revenue(monthly_customers),
            "customer_count": len(monthly_customers)
        },
        yearly={
            "revenue": calculate_revenue(yearly_customers),
            "customer_count": len(yearly_customers)
        },
        total={
            "revenue": calculate_revenue(all_customers),
            "customer_count": len(all_customers)
        }
    )


@router.get("/customer-revenue", response_model=List[Dict[str, Any]])
async def get_customer_revenue(
    current_user = Depends(require_permission("can_manage_financial")),
    db: Session = Depends(get_db)
):
    """Müşteri bazlı gelirleri getir"""
    customers = db.query(Customer).filter(Customer.is_deleted == False).all()
    
    revenue_list = []
    for customer in customers:
        prices = parse_prices(customer.prices)
        revenue = sum(prices)
        
        revenue_list.append({
            "id": customer.id,
            "name": f"{customer.name} {customer.surname}",
            "email": customer.email,
            "revenue": revenue,
            "created_at": customer.created_at.isoformat()
        })
    
    # Gelire göre sırala (yüksekten düşüğe)
    revenue_list.sort(key=lambda x: x.revenue, reverse=True)
    
    return revenue_list

