import mimetypes
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile

from app.db import ensure_contact_media_bucket, supabase
from app.models.address import ContactAddress, ContactAddressCreate
from app.models.contact import Contact, ContactCreate, ContactUpdate
from app.models.media import ContactMedia, MediaKind

router = APIRouter(prefix="/contacts", tags=["contacts"])

MEDIA_BUCKET = "contact-media"
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_KINDS = {"logo_vetor", "mockup", "outro"}


@router.get("/", response_model=list[Contact])
async def list_contacts(
    status: Optional[str] = None,
    segment: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
):
    query = supabase().table("contacts").select("*")

    if status:
        query = query.eq("status", status)
    if segment:
        query = query.eq("segment", segment)
    if search:
        # busca por nome ou telefone
        query = query.or_(f"name.ilike.%{search}%,phone.ilike.%{search}%,business_name.ilike.%{search}%")

    query = query.order("last_order_at", desc=True, nullsfirst=False)
    query = query.range(offset, offset + limit - 1)

    result = query.execute()
    return result.data


@router.get("/{contact_id}", response_model=Contact)
async def get_contact(contact_id: UUID):
    result = supabase().table("contacts").select("*").eq("id", str(contact_id)).single().execute()
    if not result.data:
        raise HTTPException(404, "Contato não encontrado")
    return result.data


@router.post("/", response_model=Contact, status_code=201)
async def create_contact(payload: ContactCreate):
    # Verificar telefone duplicado
    existing = supabase().table("contacts").select("id").eq("phone", payload.phone).execute()
    if existing.data:
        raise HTTPException(409, f"Já existe contato com telefone {payload.phone}")

    data = payload.model_dump(mode="json")
    result = supabase().table("contacts").insert(data).execute()
    return result.data[0]


@router.patch("/{contact_id}", response_model=Contact)
async def update_contact(contact_id: UUID, payload: ContactUpdate):
    update_data = payload.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(400, "Nenhum campo pra atualizar")

    if update_data.get("opt_out") is True:
        update_data["opt_out_at"] = datetime.now(timezone.utc).isoformat()

    result = supabase().table("contacts").update(update_data).eq("id", str(contact_id)).execute()
    if not result.data:
        raise HTTPException(404, "Contato não encontrado")
    return result.data[0]


@router.delete("/{contact_id}", status_code=204)
async def delete_contact(contact_id: UUID):
    supabase().table("contacts").delete().eq("id", str(contact_id)).execute()
    return None


@router.get("/{contact_id}/media", response_model=list[ContactMedia])
async def list_contact_media(contact_id: UUID):
    result = (
        supabase()
        .table("contact_media")
        .select("*")
        .eq("contact_id", str(contact_id))
        .order("created_at", desc=True)
        .execute()
    )
    return result.data or []


@router.post("/{contact_id}/media", response_model=ContactMedia, status_code=201)
async def upload_contact_media(
    contact_id: UUID,
    file: UploadFile = File(...),
    kind: str = Form("outro"),
    caption: Optional[str] = Form(None),
):
    if kind not in ALLOWED_KINDS:
        raise HTTPException(400, f"kind inválido: {kind}")

    content_type = (file.content_type or "").lower()
    if not content_type.startswith("image/"):
        raise HTTPException(400, "Arquivo precisa ser uma imagem")

    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(400, "Imagem maior que 10 MB")
    if len(content) == 0:
        raise HTTPException(400, "Arquivo vazio")

    # Garante o contato (404 cedo, evita lixo no storage).
    contact_exists = (
        supabase().table("contacts").select("id").eq("id", str(contact_id)).execute()
    )
    if not contact_exists.data:
        raise HTTPException(404, "Contato não encontrado")

    ext = ""
    if file.filename and "." in file.filename:
        ext = "." + file.filename.rsplit(".", 1)[-1].lower()
    if not ext:
        guessed = mimetypes.guess_extension(content_type) or ""
        ext = guessed if guessed else ".bin"

    ensure_contact_media_bucket()

    storage_path = f"contacts/{contact_id}/{uuid4()}{ext}"
    try:
        supabase().storage.from_(MEDIA_BUCKET).upload(
            storage_path,
            content,
            {"content-type": content_type, "upsert": "false"},
        )
    except Exception as e:
        raise HTTPException(500, f"Falha no upload pro storage: {e}")

    public_url = supabase().storage.from_(MEDIA_BUCKET).get_public_url(storage_path)
    # Algumas versões retornam com `?` no final — limpa.
    if isinstance(public_url, str):
        public_url = public_url.rstrip("?")

    record = {
        "contact_id": str(contact_id),
        "url": public_url,
        "storage_path": storage_path,
        "kind": kind,
        "caption": caption,
    }
    insert = supabase().table("contact_media").insert(record).execute()
    if not insert.data:
        # rollback do storage se o insert falhou silenciosamente
        try:
            supabase().storage.from_(MEDIA_BUCKET).remove([storage_path])
        except Exception:
            pass
        raise HTTPException(500, "Falha ao salvar registro da imagem")
    return insert.data[0]


@router.get("/{contact_id}/addresses", response_model=list[ContactAddress])
async def list_contact_addresses(contact_id: UUID):
    result = (
        supabase()
        .table("contact_addresses")
        .select("*")
        .eq("contact_id", str(contact_id))
        .order("is_default", desc=True)
        .order("created_at", desc=False)
        .execute()
    )
    return result.data or []


@router.post(
    "/{contact_id}/addresses", response_model=ContactAddress, status_code=201
)
async def create_contact_address(contact_id: UUID, payload: ContactAddressCreate):
    contact_exists = (
        supabase().table("contacts").select("id").eq("id", str(contact_id)).execute()
    )
    if not contact_exists.data:
        raise HTTPException(404, "Contato não encontrado")

    data = payload.model_dump()
    data["contact_id"] = str(contact_id)
    result = supabase().table("contact_addresses").insert(data).execute()
    if not result.data:
        raise HTTPException(500, "Falha ao salvar endereço")
    created = result.data[0]

    if created.get("is_default"):
        supabase().table("contact_addresses").update({"is_default": False}).eq(
            "contact_id", str(contact_id)
        ).neq("id", created["id"]).execute()

    return created
