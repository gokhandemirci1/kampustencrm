from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str
    can_manage_customers: bool = False
    can_manage_financial: bool = False
    can_manage_collaboration_codes: bool = False
    can_view_collaboration_stats: bool = False
    can_manage_access: bool = False
    can_delete_users: bool = False


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    can_manage_customers: Optional[bool] = None
    can_manage_financial: Optional[bool] = None
    can_manage_collaboration_codes: Optional[bool] = None
    can_view_collaboration_stats: Optional[bool] = None
    can_manage_access: Optional[bool] = None
    can_delete_users: Optional[bool] = None


class UserResponse(UserBase):
    id: str
    can_manage_customers: bool
    can_manage_financial: bool
    can_manage_collaboration_codes: bool
    can_view_collaboration_stats: bool
    can_manage_access: bool
    can_delete_users: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Customer Schemas
class CustomerBase(BaseModel):
    name: str
    surname: str
    phone: str
    email: EmailStr
    grade: str
    camps: str
    prices: str
    code: Optional[str] = None
    previous_rank: Optional[str] = None
    city: str


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: str
    is_deleted: bool
    deleted_reason: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Collaboration Code Schemas
class CollaborationCodeBase(BaseModel):
    code: str
    is_active: bool = True


class CollaborationCodeCreate(CollaborationCodeBase):
    pass


class CollaborationCodeUpdate(BaseModel):
    is_active: bool


class CollaborationCodeResponse(CollaborationCodeBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Financial Schemas
class FinancialStats(BaseModel):
    daily: dict
    weekly: dict
    monthly: dict
    yearly: dict
    total: dict


class CustomerRevenue(BaseModel):
    id: str
    name: str
    email: str
    revenue: float
    created_at: datetime

    class Config:
        from_attributes = True


class CollaborationStat(BaseModel):
    code_id: str
    code: str
    customer_count: int
    total_revenue: float


class CollaborationStatsResponse(BaseModel):
    stats: List[dict]  # CollaborationStat yerine dict kullanıyoruz
    without_code: dict

