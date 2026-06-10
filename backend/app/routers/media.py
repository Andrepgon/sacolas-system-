from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.db import supabase

router = APIRouter(prefix="/media", tags=["media"])

BUCKET = "contact-media"


@router.delete("/{media_id}", status_code=204)
async def delete_media(media_id: UUID):
    existing = (
        supabase()
        .table("contact_media")
        .select("id, storage_path")
        .eq("id", str(media_id))
        .execute()
    )
    if not existing.data:
        raise HTTPException(404, "Imagem não encontrada")

    storage_path = existing.data[0].get("storage_path")
    if storage_path:
        try:
            supabase().storage.from_(BUCKET).remove([storage_path])
        except Exception:
            # Arquivo já pode ter sumido do storage — segue removendo o registro.
            pass

    supabase().table("contact_media").delete().eq("id", str(media_id)).execute()
    return None
