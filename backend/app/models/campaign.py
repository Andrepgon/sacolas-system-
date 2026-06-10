from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

CAMPAIGN_STATUSES = ["draft", "ready", "sending", "done", "archived"]
SEND_STATUSES = ["pending", "sent", "skipped"]


class CampaignBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    message_template: str = Field(min_length=1)
    image_url: Optional[str] = None


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    message_template: Optional[str] = Field(default=None, min_length=1)
    image_url: Optional[str] = None
    status: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in CAMPAIGN_STATUSES:
            raise ValueError(f"status inválido: {v}")
        return v


class Campaign(CampaignBase):
    id: UUID
    image_storage_path: Optional[str] = None
    status: str = "draft"
    total_recipients: int = 0
    sent_count: int = 0
    skipped_count: int = 0
    created_at: datetime
    updated_at: datetime


class CampaignSendContactPreview(BaseModel):
    name: str
    business_name: Optional[str] = None


class CampaignSend(BaseModel):
    id: UUID
    campaign_id: UUID
    contact_id: UUID
    phone: str
    rendered_message: str
    status: str
    sent_at: Optional[datetime] = None
    position: int
    contact: Optional[CampaignSendContactPreview] = None


class CampaignSendUpdate(BaseModel):
    status: Literal["sent", "skipped"]


class RecipientsFilter(BaseModel):
    segment: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[list[str]] = None
    search: Optional[str] = None
    top_ltv: Optional[int] = Field(default=None, ge=1, le=2000)


class RecipientsRequest(BaseModel):
    filter: Optional[RecipientsFilter] = None
    contact_ids: Optional[list[UUID]] = None
