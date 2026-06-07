from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from uuid import UUID
from app.db import supabase
from app.models.contact import Contact, ContactCreate, ContactUpdate

router = APIRouter(prefix="/contacts", tags=["contacts"])


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

    result = supabase().table("contacts").update(update_data).eq("id", str(contact_id)).execute()
    if not result.data:
        raise HTTPException(404, "Contato não encontrado")
    return result.data[0]


@router.delete("/{contact_id}", status_code=204)
async def delete_contact(contact_id: UUID):
    supabase().table("contacts").delete().eq("id", str(contact_id)).execute()
    return None
