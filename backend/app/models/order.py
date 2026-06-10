from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

ORDER_STATUSES = [
    "quote", "signal_paid", "vector_pending", "factory_pending",
    "printing", "ready_to_deliver", "delivered", "paid", "cancelled"
]


class OrderBase(BaseModel):
    contact_id: UUID
    quantity: int = Field(gt=0)
    bag_model: Optional[str] = None
    bag_size: Optional[str] = None
    unit_price: Optional[float] = None
    total: float = Field(ge=0)
    paid_amount: float = 0
    status: str = "signal_paid"
    delivery_address: Optional[str] = None
    delivery_address_id: Optional[UUID] = None
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    quantity: Optional[int] = None
    bag_model: Optional[str] = None
    bag_size: Optional[str] = None
    unit_price: Optional[float] = None
    total: Optional[float] = None
    paid_amount: Optional[float] = None
    status: Optional[str] = None
    delivery_address: Optional[str] = None
    delivery_address_id: Optional[UUID] = None
    notes: Optional[str] = None
    delivered_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None


class OrderContactPreview(BaseModel):
    name: str
    business_name: Optional[str] = None


class Order(OrderBase):
    id: UUID
    confirmed_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    contact: Optional[OrderContactPreview] = None
