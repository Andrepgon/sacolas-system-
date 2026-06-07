from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator
import re

PHONE_REGEX = re.compile(r"^\+?[1-9]\d{1,14}$")  # E.164


class ContactBase(BaseModel):
    phone: str
    name: str = Field(min_length=1, max_length=200)
    business_name: Optional[str] = None
    segment: Optional[str] = None
    source: str = "manual"
    status: str = "lead"
    tags: list[str] = Field(default_factory=list)
    has_vector_logo: bool = False
    notes: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Limpa caracteres
        cleaned = re.sub(r"[^\d+]", "", v)
        # Adiciona +55 se for número BR sem código
        if not cleaned.startswith("+"):
            if len(cleaned) in (10, 11):  # número BR
                cleaned = "+55" + cleaned
            else:
                cleaned = "+" + cleaned
        if not PHONE_REGEX.match(cleaned):
            raise ValueError(f"Telefone inválido: {v}")
        return cleaned


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    business_name: Optional[str] = None
    segment: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[list[str]] = None
    has_vector_logo: Optional[bool] = None
    notes: Optional[str] = None


class Contact(ContactBase):
    id: UUID
    first_order_at: Optional[datetime] = None
    last_order_at: Optional[datetime] = None
    last_contact_at: Optional[datetime] = None
    total_orders: int = 0
    lifetime_value: float = 0
    created_at: datetime
    updated_at: datetime
