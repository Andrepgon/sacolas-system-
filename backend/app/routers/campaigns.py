import mimetypes
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, File, HTTPException, Query, UploadFile

from app.db import ensure_campaigns_bucket, supabase
from app.models.campaign import (
    CAMPAIGN_STATUSES,
    Campaign,
    CampaignCreate,
    CampaignSend,
    CampaignSendUpdate,
    CampaignUpdate,
    RecipientsRequest,
)
from app.services.campaign_render import render_message

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

CAMPAIGNS_BUCKET = "campaigns"
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.post("/", response_model=Campaign, status_code=201)
async def create_campaign(payload: CampaignCreate):
    data = payload.model_dump(mode="json")
    data["status"] = "draft"
    result = supabase().table("campaigns").insert(data).execute()
    if not result.data:
        raise HTTPException(500, "Falha ao criar campanha")
    return result.data[0]


@router.get("/", response_model=list[Campaign])
async def list_campaigns(
    status: Optional[str] = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
):
    query = supabase().table("campaigns").select("*")
    if status:
        query = query.eq("status", status)
    query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
    result = query.execute()
    return result.data or []


@router.get("/{campaign_id}", response_model=Campaign)
async def get_campaign(campaign_id: UUID):
    result = (
        supabase()
        .table("campaigns")
        .select("*")
        .eq("id", str(campaign_id))
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Campanha não encontrada")
    return result.data[0]


@router.patch("/{campaign_id}", response_model=Campaign)
async def update_campaign(campaign_id: UUID, payload: CampaignUpdate):
    update_data = payload.model_dump(exclude_none=True, mode="json")
    if not update_data:
        raise HTTPException(400, "Nenhum campo pra atualizar")

    update_data["updated_at"] = _now_iso()
    result = (
        supabase()
        .table("campaigns")
        .update(update_data)
        .eq("id", str(campaign_id))
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Campanha não encontrada")
    return result.data[0]


@router.post("/{campaign_id}/image", response_model=Campaign)
async def upload_campaign_image(campaign_id: UUID, file: UploadFile = File(...)):
    content_type = (file.content_type or "").lower()
    if not content_type.startswith("image/"):
        raise HTTPException(400, "Arquivo precisa ser uma imagem")

    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(400, "Imagem maior que 10 MB")
    if len(content) == 0:
        raise HTTPException(400, "Arquivo vazio")

    # Garante a campanha (404 cedo, evita lixo no storage).
    existing = (
        supabase()
        .table("campaigns")
        .select("id, image_storage_path")
        .eq("id", str(campaign_id))
        .execute()
    )
    if not existing.data:
        raise HTTPException(404, "Campanha não encontrada")
    old_path = existing.data[0].get("image_storage_path")

    ext = ""
    if file.filename and "." in file.filename:
        ext = "." + file.filename.rsplit(".", 1)[-1].lower()
    if not ext:
        guessed = mimetypes.guess_extension(content_type) or ""
        ext = guessed if guessed else ".bin"

    ensure_campaigns_bucket()

    storage_path = f"campaigns/{campaign_id}/{uuid4()}{ext}"
    try:
        supabase().storage.from_(CAMPAIGNS_BUCKET).upload(
            storage_path,
            content,
            {"content-type": content_type, "upsert": "false"},
        )
    except Exception as e:
        raise HTTPException(500, f"Falha no upload pro storage: {e}")

    public_url = supabase().storage.from_(CAMPAIGNS_BUCKET).get_public_url(storage_path)
    if isinstance(public_url, str):
        public_url = public_url.rstrip("?")

    update = (
        supabase()
        .table("campaigns")
        .update(
            {
                "image_url": public_url,
                "image_storage_path": storage_path,
                "updated_at": _now_iso(),
            }
        )
        .eq("id", str(campaign_id))
        .execute()
    )
    if not update.data:
        try:
            supabase().storage.from_(CAMPAIGNS_BUCKET).remove([storage_path])
        except Exception:
            pass
        raise HTTPException(500, "Falha ao salvar imagem da campanha")

    # Remove imagem antiga do storage (best-effort).
    if old_path and old_path != storage_path:
        try:
            supabase().storage.from_(CAMPAIGNS_BUCKET).remove([old_path])
        except Exception:
            pass

    return update.data[0]


@router.post("/{campaign_id}/recipients")
async def set_recipients(campaign_id: UUID, payload: RecipientsRequest):
    campaign_q = (
        supabase()
        .table("campaigns")
        .select("*")
        .eq("id", str(campaign_id))
        .execute()
    )
    if not campaign_q.data:
        raise HTTPException(404, "Campanha não encontrada")
    campaign = campaign_q.data[0]

    contacts = _resolve_contacts(payload)

    # Exclui opt_out.
    eligible = [c for c in contacts if not c.get("opt_out")]
    excluded_opt_out = len(contacts) - len(eligible)

    # Pega o próximo position a partir do max atual (preserva ordem em re-runs).
    existing_sends = (
        supabase()
        .table("campaign_sends")
        .select("contact_id, position")
        .eq("campaign_id", str(campaign_id))
        .execute()
    )
    existing_by_contact = {row["contact_id"]: row for row in (existing_sends.data or [])}
    next_position = max(
        (row["position"] for row in (existing_sends.data or [])), default=-1
    ) + 1

    rows = []
    for c in eligible:
        rendered = render_message(
            campaign["message_template"], c, campaign.get("image_url")
        )
        contact_id_str = str(c["id"])
        existing_row = existing_by_contact.get(contact_id_str)
        # Mantém position se já existir, para não bagunçar a ordem da fila.
        position = (
            existing_row["position"] if existing_row else next_position
        )
        if not existing_row:
            next_position += 1
        rows.append(
            {
                "campaign_id": str(campaign_id),
                "contact_id": contact_id_str,
                "phone": c["phone"],
                "rendered_message": rendered,
                "status": "pending",
                "position": position,
            }
        )

    if rows:
        supabase().table("campaign_sends").upsert(
            rows, on_conflict="campaign_id,contact_id"
        ).execute()

    total_q = (
        supabase()
        .table("campaign_sends")
        .select("id", count="exact")
        .eq("campaign_id", str(campaign_id))
        .execute()
    )
    total_recipients = total_q.count or 0

    supabase().table("campaigns").update(
        {"total_recipients": total_recipients, "updated_at": _now_iso()}
    ).eq("id", str(campaign_id)).execute()

    return {
        "total_recipients": total_recipients,
        "excluded_opt_out": excluded_opt_out,
    }


def _resolve_contacts(payload: RecipientsRequest) -> list[dict]:
    """Aplica `contact_ids` (precedência) ou `filter`. Retorna lista de contatos."""
    if payload.contact_ids:
        ids = [str(cid) for cid in payload.contact_ids]
        result = (
            supabase()
            .table("contacts")
            .select("*")
            .in_("id", ids)
            .execute()
        )
        return result.data or []

    query = supabase().table("contacts").select("*")
    f = payload.filter
    if f:
        if f.status:
            query = query.eq("status", f.status)
        if f.segment:
            query = query.eq("segment", f.segment)
        if f.tags:
            query = query.overlaps("tags", f.tags)
        if f.search:
            query = query.or_(
                f"name.ilike.%{f.search}%,phone.ilike.%{f.search}%,business_name.ilike.%{f.search}%"
            )
        if f.top_ltv:
            query = query.order("lifetime_value", desc=True).limit(f.top_ltv)
    result = query.execute()
    return result.data or []


@router.get("/{campaign_id}/sends", response_model=list[CampaignSend])
async def list_campaign_sends(
    campaign_id: UUID,
    status: Optional[str] = None,
    limit: int = Query(200, le=500),
    offset: int = 0,
):
    query = (
        supabase()
        .table("campaign_sends")
        .select("*, contact:contacts(name,business_name)")
        .eq("campaign_id", str(campaign_id))
    )
    if status:
        query = query.eq("status", status)
    query = query.order("position", desc=False).range(offset, offset + limit - 1)
    result = query.execute()
    return result.data or []


@router.patch("/{campaign_id}/sends/{send_id}", response_model=CampaignSend)
async def update_campaign_send(
    campaign_id: UUID, send_id: UUID, payload: CampaignSendUpdate
):
    send_q = (
        supabase()
        .table("campaign_sends")
        .select("*")
        .eq("id", str(send_id))
        .eq("campaign_id", str(campaign_id))
        .execute()
    )
    if not send_q.data:
        raise HTTPException(404, "Envio não encontrado")
    send = send_q.data[0]
    if send["status"] != "pending":
        raise HTTPException(409, f"Envio já está marcado como '{send['status']}'")

    campaign_q = (
        supabase()
        .table("campaigns")
        .select("title, status, sent_count, skipped_count")
        .eq("id", str(campaign_id))
        .execute()
    )
    if not campaign_q.data:
        raise HTTPException(404, "Campanha não encontrada")
    campaign = campaign_q.data[0]

    now = _now_iso()
    send_update: dict = {"status": payload.status}
    if payload.status == "sent":
        send_update["sent_at"] = now
    update_q = (
        supabase()
        .table("campaign_sends")
        .update(send_update)
        .eq("id", str(send_id))
        .execute()
    )
    if not update_q.data:
        raise HTTPException(500, "Falha ao atualizar envio")
    updated_send = update_q.data[0]

    # Atualiza contadores da campanha + transições de status.
    campaign_update: dict = {"updated_at": now}
    if payload.status == "sent":
        campaign_update["sent_count"] = (campaign.get("sent_count") or 0) + 1
    else:
        campaign_update["skipped_count"] = (campaign.get("skipped_count") or 0) + 1

    if campaign["status"] == "ready":
        campaign_update["status"] = "sending"

    # Se não restam pendentes, fecha a campanha.
    pending_q = (
        supabase()
        .table("campaign_sends")
        .select("id", count="exact")
        .eq("campaign_id", str(campaign_id))
        .eq("status", "pending")
        .execute()
    )
    if (pending_q.count or 0) == 0:
        campaign_update["status"] = "done"

    supabase().table("campaigns").update(campaign_update).eq(
        "id", str(campaign_id)
    ).execute()

    # Em "sent": marca o contato e registra interação.
    if payload.status == "sent":
        supabase().table("contacts").update(
            {"last_campaign_at": now, "last_contact_at": now}
        ).eq("id", send["contact_id"]).execute()

        supabase().table("interactions").insert(
            {
                "contact_id": send["contact_id"],
                "type": "campanha",
                "direction": "outbound",
                "summary": campaign.get("title"),
            }
        ).execute()

    # Re-fetch com contact aninhado pra resposta consistente.
    final = (
        supabase()
        .table("campaign_sends")
        .select("*, contact:contacts(name,business_name)")
        .eq("id", str(send_id))
        .execute()
    )
    return final.data[0] if final.data else updated_send


# Sanity check pra IDE/lint: CAMPAIGN_STATUSES exportado pra evitar `imported but unused`
# caso seja referenciado externamente no futuro.
__all__ = ["router", "CAMPAIGN_STATUSES"]
