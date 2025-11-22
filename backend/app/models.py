from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text
from sqlalchemy.sql import func
from app.database import Base
import uuid


def generate_id():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_id)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    
    # Yetkiler
    can_manage_customers = Column(Boolean, default=False)
    can_manage_financial = Column(Boolean, default=False)
    can_manage_collaboration_codes = Column(Boolean, default=False)
    can_view_collaboration_stats = Column(Boolean, default=False)
    can_manage_access = Column(Boolean, default=False)
    can_delete_users = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, default=generate_id)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, index=True, nullable=False)
    grade = Column(String, nullable=False)  # Kaçıncı sınıf
    camps = Column(Text, nullable=False)  # Satın aldığı kamplar (JSON string)
    prices = Column(Text, nullable=False)  # Fiyatlar (JSON string)
    code = Column(String, nullable=True, index=True)  # İşbirliği kodu
    previous_rank = Column(String, nullable=True)  # Önceki YKS derecesi
    city = Column(String, nullable=False)
    is_deleted = Column(Boolean, default=False)
    deleted_reason = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class CollaborationCode(Base):
    __tablename__ = "collaboration_codes"

    id = Column(String, primary_key=True, default=generate_id)
    code = Column(String, unique=True, nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

