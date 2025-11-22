from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserUpdate, UserResponse
from app.dependencies import get_current_user, require_permission
from app.utils import get_password_hash

router = APIRouter()


@router.get("", response_model=List[UserResponse])
async def get_users(
    current_user = Depends(require_permission("can_manage_access")),
    db: Session = Depends(get_db)
):
    """Tüm kullanıcıları getir"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    current_user = Depends(require_permission("can_manage_access")),
    db: Session = Depends(get_db)
):
    """Yeni kullanıcı oluştur"""
    # E-posta kontrolü
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu e-posta adresi zaten kullanılıyor"
        )
    
    hashed_password = get_password_hash(user_data.password)
    
    user = User(
        email=user_data.email,
        password=hashed_password,
        can_manage_customers=user_data.can_manage_customers,
        can_manage_financial=user_data.can_manage_financial,
        can_manage_collaboration_codes=user_data.can_manage_collaboration_codes,
        can_view_collaboration_stats=user_data.can_view_collaboration_stats,
        can_manage_access=user_data.can_manage_access,
        can_delete_users=user_data.can_delete_users
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user = Depends(require_permission("can_manage_access")),
    db: Session = Depends(get_db)
):
    """Kullanıcı bilgilerini güncelle"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kullanıcı bulunamadı"
        )
    
    # E-posta kontrolü
    if user_data.email and user_data.email != user.email:
        existing_user = db.query(User).filter(
            User.email == user_data.email,
            User.id != user_id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu e-posta adresi zaten kullanılıyor"
            )
        user.email = user_data.email
    
    # Şifre güncelleme
    if user_data.password:
        user.password = get_password_hash(user_data.password)
    
    # Yetkileri güncelle
    if user_data.can_manage_customers is not None:
        user.can_manage_customers = user_data.can_manage_customers
    if user_data.can_manage_financial is not None:
        user.can_manage_financial = user_data.can_manage_financial
    if user_data.can_manage_collaboration_codes is not None:
        user.can_manage_collaboration_codes = user_data.can_manage_collaboration_codes
    if user_data.can_view_collaboration_stats is not None:
        user.can_view_collaboration_stats = user_data.can_view_collaboration_stats
    if user_data.can_manage_access is not None:
        user.can_manage_access = user_data.can_manage_access
    if user_data.can_delete_users is not None:
        user.can_delete_users = user_data.can_delete_users
    
    db.commit()
    db.refresh(user)
    
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_user = Depends(require_permission("can_manage_access")),
    db: Session = Depends(get_db)
):
    """Kullanıcıyı sil"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kullanıcı bulunamadı"
        )
    
    # gokhan ve emre silinemez
    if user.email in ["gokhan@kampus.com", "emre@kampus.com"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu kullanıcı silinemez"
        )
    
    # Yetki kontrolü
    if not current_user.can_delete_users:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kullanıcı silme yetkisi yok"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "Kullanıcı silindi"}

