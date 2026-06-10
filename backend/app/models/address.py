from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ContactAddressBase(BaseModel):
    label: Optional[str] = None
    address: str = Field(min_length=1)
    is_default: bool = False


class ContactAddressCreate(ContactAddressBase):
    pass


class ContactAddressUpdate(BaseModel):
    label: Optional[str] = None
    address: Optional[str] = Field(default=None, min_length=1)
    is_default: Optional[bool] = None


class ContactAddress(ContactAddressBase):
    id: UUID
    contact_id: UUID
    lat: Optional[float] = None
    lng: Optional[float] = None
    created_at: datetime
