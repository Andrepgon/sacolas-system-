from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from pydantic import BaseModel

MediaKind = Literal["logo_vetor", "mockup", "outro"]


class ContactMedia(BaseModel):
    id: UUID
    contact_id: UUID
    url: str
    storage_path: Optional[str] = None
    kind: MediaKind = "outro"
    caption: Optional[str] = None
    created_at: datetime
