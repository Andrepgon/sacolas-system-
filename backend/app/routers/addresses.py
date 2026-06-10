from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.db import supabase
from app.models.address import ContactAddress, ContactAddressUpdate

router = APIRouter(prefix="/addresses", tags=["addresses"])


def _unset_other_defaults(contact_id: str, except_address_id: str) -> None:
    supabase().table("contact_addresses").update({"is_default": False}).eq(
        "contact_id", contact_id
    ).neq("id", except_address_id).execute()


@router.patch("/{address_id}", response_model=ContactAddress)
async def update_address(address_id: UUID, payload: ContactAddressUpdate):
    update_data = payload.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(400, "Nenhum campo pra atualizar")

    current = (
        supabase()
        .table("contact_addresses")
        .select("contact_id")
        .eq("id", str(address_id))
        .execute()
    )
    if not current.data:
        raise HTTPException(404, "Endereço não encontrado")

    contact_id = current.data[0]["contact_id"]

    result = (
        supabase()
        .table("contact_addresses")
        .update(update_data)
        .eq("id", str(address_id))
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Endereço não encontrado")

    if update_data.get("is_default") is True:
        _unset_other_defaults(contact_id, str(address_id))

    return result.data[0]


@router.delete("/{address_id}", status_code=204)
async def delete_address(address_id: UUID):
    supabase().table("contact_addresses").delete().eq("id", str(address_id)).execute()
    return None
