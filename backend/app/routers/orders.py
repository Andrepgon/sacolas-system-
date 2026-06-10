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
    now = datetime.now().isoformat()
    status = data.get("status")
    total = float(data.get("total") or 0)
    existing_paid = float(data.get("paid_amount") or 0)

    if status == "signal_paid":
        if not data.get("confirmed_at"):
            data["confirmed_at"] = now
        if existing_paid == 0 and total > 0:
            data["paid_amount"] = total / 2
    elif status == "paid":
        if not data.get("paid_at"):
            data["paid_at"] = now
        if existing_paid == 0 and total > 0:
            data["paid_amount"] = total
    elif status == "delivered":
        if not data.get("delivered_at"):
            data["delivered_at"] = now

    result = supabase().table("orders").insert(data).execute()
    return result.data[0]


@router.patch("/{order_id}", response_model=Order)
async def update_order(order_id: UUID, payload: OrderUpdate):
    update_data = payload.model_dump(exclude_none=True, mode="json")

    # Auto-preenche timestamps e paid_amount baseado em mudança de status
    if "status" in update_data:
        new_status = update_data["status"]
        now = datetime.now().isoformat()

        current_row = None
        if new_status in ("signal_paid", "paid"):
            current = (
                supabase()
                .table("orders")
                .select("paid_amount, total")
                .eq("id", str(order_id))
                .execute()
            )
            if current.data:
                current_row = current.data[0]

        if new_status == "signal_paid":
            if "confirmed_at" not in update_data:
                update_data["confirmed_at"] = now
            if "paid_amount" not in update_data and current_row:
                existing_paid = float(current_row.get("paid_amount") or 0)
                total = float(
                    update_data.get("total") or current_row.get("total") or 0
                )
                # Sinal é metade. Não sobrescreve se já houver valor pago.
                if existing_paid == 0 and total > 0:
                    update_data["paid_amount"] = total / 2
        elif new_status == "paid":
            if "paid_at" not in update_data:
                update_data["paid_at"] = now
            if "paid_amount" not in update_data and current_row:
                total = float(
                    update_data.get("total") or current_row.get("total") or 0
                )
                if total > 0:
                    update_data["paid_amount"] = total
        elif new_status == "delivered":
            if "delivered_at" not in update_data:
                update_data["delivered_at"] = now

    result = supabase().table("orders").update(update_data).eq("id", str(order_id)).execute()
    if not result.data:
        raise HTTPException(404, "Pedido não encontrado")
    return result.data[0]


@router.delete("/{order_id}", status_code=204)
async def delete_order(order_id: UUID):
    supabase().table("orders").delete().eq("id", str(order_id)).execute()
    return None
