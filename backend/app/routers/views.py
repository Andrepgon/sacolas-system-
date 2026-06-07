from fastapi import APIRouter
from app.db import supabase

router = APIRouter(prefix="/views", tags=["views"])


@router.get("/para-reativar")
async def clientes_para_reativar():
    """Clientes que não compram há +60 dias, ordenados por LTV"""
    result = supabase().table("v_clientes_para_reativar").select("*").execute()
    return result.data


@router.get("/vip")
async def clientes_vip():
    """Top clientes: 3+ pedidos OU LTV ≥ 1000"""
    result = supabase().table("v_clientes_vip").select("*").execute()
    return result.data


@router.get("/em-risco")
async def clientes_em_risco():
    """Janela 60-120 dias sem comprar"""
    result = supabase().table("v_clientes_em_risco").select("*").execute()
    return result.data


@router.get("/leads-sem-resposta")
async def leads_sem_resposta():
    """Leads cadastrados há +3 dias sem conversão"""
    result = supabase().table("v_leads_sem_resposta").select("*").execute()
    return result.data


@router.get("/receita-mensal")
async def receita_mensal():
    """Receita & pedidos por mês — últimos 12 meses"""
    result = supabase().table("v_receita_mensal").select("*").execute()
    return result.data


@router.get("/por-segmento")
async def clientes_por_segmento():
    """Distribuição de clientes (e receita) por segmento"""
    result = supabase().table("v_clientes_por_segmento").select("*").execute()
    return result.data


@router.get("/top-clientes")
async def top_clientes(limit: int = 20):
    """Ranking de clientes por LTV"""
    result = (
        supabase()
        .table("v_top_clientes")
        .select("*")
        .limit(limit)
        .execute()
    )
    return result.data


@router.get("/dashboard-summary")
async def dashboard_summary():
    """Snapshot agregado pro dashboard novo: receita do mês + delta vs mês
    anterior, ticket médio, LTV médio, leads sem resposta. Lê de v_dashboard_summary
    (migration 003)."""
    result = supabase().table("v_dashboard_summary").select("*").single().execute()
    return result.data


@router.get("/stats")
async def stats_gerais():
    """KPIs gerais pro dashboard"""
    sb = supabase()

    # Total de clientes ativos
    customers = sb.table("contacts").select("id", count="exact").eq("status", "customer").execute()
    leads = sb.table("contacts").select("id", count="exact").eq("status", "lead").execute()

    # Pedidos do mês atual
    from datetime import date
    primeiro_dia_mes = date.today().replace(day=1).isoformat()
    pedidos_mes = sb.table("orders").select("total").gte("created_at", primeiro_dia_mes).execute()

    receita_mes = sum(float(o["total"]) for o in pedidos_mes.data)

    return {
        "total_customers": customers.count,
        "total_leads": leads.count,
        "pedidos_mes": len(pedidos_mes.data),
        "receita_mes": receita_mes,
    }
