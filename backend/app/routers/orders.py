from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from uuid import UUID
from datetime import datetime
from collections import Counter
from app.db import supabase
from app.models.order import Order, OrderCreate, OrderUpdate, ORDER_STATUSES

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/", response_model=list[Order])
async def list_orders(
    contact_id: Optional[UUID] = None,
    status: Optional[str] = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
):
    query = supabase().table("orders").select("*, contact:contacts(name,business_name)")

    if contact_id:
        query = query.eq("contact_id", str(contact_id))
    if status:
        query = query.eq("status", status)

    query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
    result = query.execute()
    return result.data


@router.get("/por-status")
async def orders_por_status():
    """Contagem de pedidos por status — todos os 9, na ordem do pipeline,
    com zeros incluídos. Pro contador do Kanban."""
    result = supabase().table("orders").select("status").execute()
    counts = Counter(row["status"] for row in result.data)
    return [{"status": s, "count": counts.get(s, 0)} for s in ORDER_STATUSES]


@router.post("/", response_model=Order, status_code=201)
async def create_order(payload: OrderCreate):
    data = payload.model_dump(mode="json")
    result = supabase().table("orders").insert(data).execute()
    return result.data[0]


@router.patch("/{order_id}", response_model=Order)
async def update_order(order_id: UUID, payload: OrderUpdate):
    update_data = payload.model_dump(exclude_none=True, mode="json")

    # Auto-preenche timestamps baseado em mudança de status
    if "status" in update_data:
        if update_data["status"] == "confirmed" and "confirmed_at" not in update_data:
            update_data["confirmed_at"] = datetime.now().isoformat()
        elif update_data["status"] == "delivered" and "delivered_at" not in update_data:
            update_data["delivered_at"] = datetime.now().isoformat()
        elif update_data["status"] == "paid" and "paid_at" not in update_data:
            update_data["paid_at"] = datetime.now().isoformat()

    result = supabase().table("orders").update(update_data).eq("id", str(order_id)).execute()
    if not result.data:
        raise HTTPException(404, "Pedido não encontrado")
    return result.data[0]


@router.delete("/{order_id}", status_code=204)
async def delete_order(order_id: UUID):
    supabase().table("orders").delete().eq("id", str(order_id)).execute()
    return None
