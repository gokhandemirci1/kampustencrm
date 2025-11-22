from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import CollaborationCode
from app.schemas import CollaborationCodeCreate, CollaborationCodeUpdate, CollaborationCodeResponse
from app.dependencies import get_current_user, require_permission

router = APIRouter()


@router.get("", response_model=List[CollaborationCodeResponse])
async def get_collaboration_codes(
    current_user = Depends(require_permission("can_manage_collaboration_codes")),
    db: Session = Depends(get_db)
):
    """Tüm işbirliği kodlarını getir"""
    codes = db.query(CollaborationCode).order_by(CollaborationCode.created_at.desc()).all()
    return codes


@router.post("", response_model=CollaborationCodeResponse, status_code=status.HTTP_201_CREATED)
async def create_collaboration_code(
    code_data: CollaborationCodeCreate,
    current_user = Depends(require_permission("can_manage_collaboration_codes")),
    db: Session = Depends(get_db)
):
    """Yeni işbirliği kodu ekle"""
    # Kod zaten var mı kontrol et
    existing_code = db.query(CollaborationCode).filter(
        CollaborationCode.code == code_data.code
    ).first()
    
    if existing_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu kod zaten mevcut"
        )
    
    code = CollaborationCode(
        code=code_data.code,
        is_active=code_data.is_active
    )
    
    db.add(code)
    db.commit()
    db.refresh(code)
    
    return code


@router.patch("/{code_id}", response_model=CollaborationCodeResponse)
async def update_collaboration_code(
    code_id: str,
    code_data: CollaborationCodeUpdate,
    current_user = Depends(require_permission("can_manage_collaboration_codes")),
    db: Session = Depends(get_db)
):
    """İşbirliği kodunu güncelle"""
    code = db.query(CollaborationCode).filter(CollaborationCode.id == code_id).first()
    
    if not code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kod bulunamadı"
        )
    
    code.is_active = code_data.is_active
    
    db.commit()
    db.refresh(code)
    
    return code


@router.delete("/{code_id}")
async def delete_collaboration_code(
    code_id: str,
    current_user = Depends(require_permission("can_manage_collaboration_codes")),
    db: Session = Depends(get_db)
):
    """İşbirliği kodunu sil"""
    code = db.query(CollaborationCode).filter(CollaborationCode.id == code_id).first()
    
    if not code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kod bulunamadı"
        )
    
    db.delete(code)
    db.commit()
    
    return {"message": "Kod silindi"}

