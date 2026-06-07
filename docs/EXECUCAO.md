# Protótipo CRM Sacolas — Documento de Execução

> **Stack:** FastAPI (Python 3.11+) + Next.js 14 + Supabase Postgres
> **Hospedagem:** Backend no Railway, Frontend na Vercel
> **Objetivo:** entregar CRM funcional em 5-7 dias úteis, já no formato do sistema final
> **Premissa:** este código **não vai pro lixo** — é o primeiro tijolo do sistema completo

---

## 1. Filosofia do protótipo

O protótipo entrega **apenas o que resolve a dor mais urgente do dono**: saber quem são os clientes, quando compraram pela última vez, e quanto faturam. Tudo o resto (WhatsApp, mockup IA, régua de pós-venda) virá depois, em cima dessa mesma base.

**Princípio chave:** schema do banco já é o final. Endpoints já são os finais. UI mínima mas no framework final. Quando adicionarmos módulos novos, só estendemos — não refazemos.

**Funcionalidades V1 (este documento):**
- [x] Cadastro e edição de contatos
- [x] Cadastro de pedidos vinculados a contatos
- [x] Listagem com filtros (status, segmento, dias sem comprar)
- [x] Busca rápida por nome ou telefone
- [x] Visões agregadas (clientes em risco, VIPs)
- [x] Importação em lote via vCard
- [x] Mobile-first (dono usa no celular)

**Fora do escopo da V1:**
- ❌ Integração WhatsApp (próxima entrega)
- ❌ Mockup IA, régua, etc
- ❌ Dashboard com gráficos pesados (pode entrar V1.5 se sobrar tempo)

---

## 2. Arquitetura

```
┌─────────────────────────────────────────────┐
│   Frontend Next.js 14 (App Router)          │
│   Hospedado na Vercel                       │
│   - shadcn/ui + Tailwind                    │
│   - Autenticação via Supabase Auth          │
│   - Mobile-first                            │
└────────────────┬────────────────────────────┘
                 │ HTTP/JSON
                 ▼
┌─────────────────────────────────────────────┐
│   Backend FastAPI                            │
│   Hospedado no Railway                       │
│   - Pydantic models                          │
│   - Supabase Python SDK                      │
│   - JWT validation (Supabase Auth)           │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│   Supabase                                   │
│   - Postgres (banco)                         │
│   - Auth (usuários)                          │
│   - Storage (futuro: logos, mockups)         │
└─────────────────────────────────────────────┘
```

**Por que FastAPI separado em vez de tudo via Next.js API Routes:**
- Mantém Python como linguagem do backend (que vai ter integrações com Claude, scripts de IA)
- Quando o sistema crescer com webhooks WhatsApp, jobs Inngest, geração de mockup — tudo já fica num lugar só
- Separação de responsabilidades: frontend é tela, backend é regra de negócio

---

## 3. Setup das contas externas (antes de começar)

Faz tudo isso ANTES de escrever uma linha de código:

### 3.1 Supabase

1. Criar conta em `supabase.com`
2. Criar projeto novo (escolhe região São Paulo se disponível, ou US East)
3. **Anotar credenciais** que vai usar:
   - `SUPABASE_URL` (algo como `https://xxxxx.supabase.co`)
   - `SUPABASE_ANON_KEY` (chave pública, vai pro frontend)
   - `SUPABASE_SERVICE_ROLE_KEY` (chave admin, **NUNCA exponha no frontend**, só backend)
   - `SUPABASE_DB_PASSWORD` (você define no setup, vai no connection string)
4. **Free tier serve pro protótipo** (500MB de banco, 1GB de storage). Pro Plano Pro depois quando crescer.

### 3.2 Railway

1. Conta em `railway.app`
2. Conectar com GitHub
3. **Não criar projeto ainda** — fazemos quando o backend estiver pronto pra deploy

### 3.3 Vercel

1. Conta em `vercel.com`
2. Conectar com GitHub
3. **Não criar projeto ainda** — fazemos quando o frontend estiver pronto

### 3.4 GitHub

1. Criar repositório `sacolas-system` (privado)
2. Estrutura monorepo simples:
   ```
   sacolas-system/
   ├── backend/
   ├── frontend/
   ├── scripts/
   └── README.md
   ```

---

## 4. Schema do banco — Migration 001

Cole isso no **SQL Editor do Supabase** e executa. Esse é o schema final, não vai mudar.

```sql
-- =====================================================
-- 001_initial_schema.sql
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CONTACTS
-- =====================================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identificação
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT,
  
  -- Classificação
  segment TEXT,                         -- 'papelaria', 'restaurante', 'boutique', 'confeitaria', 'outro'
  source TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'facebook_ad', 'organic', 'indicacao', 'imported'
  status TEXT NOT NULL DEFAULT 'lead',  -- 'lead', 'customer', 'inactive', 'churned'
  tags TEXT[] DEFAULT '{}',
  
  -- Dados úteis
  has_vector_logo BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  -- Métricas (atualizadas por triggers)
  first_order_at TIMESTAMPTZ,
  last_order_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ DEFAULT NOW(),
  total_orders INT NOT NULL DEFAULT 0,
  lifetime_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  
  -- Auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_segment ON contacts(segment);
CREATE INDEX idx_contacts_last_order ON contacts(last_order_at DESC NULLS LAST);
CREATE INDEX idx_contacts_name_trgm ON contacts USING gin(name gin_trgm_ops);

-- Habilita busca por similaridade
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================================
-- ORDERS
-- =====================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Detalhes
  quantity INT NOT NULL CHECK (quantity > 0),
  bag_model TEXT,
  bag_size TEXT,
  unit_price NUMERIC(10,2),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  
  -- Pipeline
  status TEXT NOT NULL DEFAULT 'quote',
  -- 'quote' | 'confirmed' | 'vector_pending' | 'factory_pending' |
  -- 'printing' | 'ready_to_deliver' | 'delivered' | 'paid' | 'cancelled'
  
  -- Datas importantes
  confirmed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- Logística (preenchidos depois)
  delivery_address TEXT,
  delivery_lat NUMERIC,
  delivery_lng NUMERIC,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_contact ON orders(contact_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_delivered ON orders(delivered_at DESC NULLS LAST);

-- =====================================================
-- INTERACTIONS (log manual de contatos — útil enquanto WhatsApp não está integrado)
-- =====================================================
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                   -- 'whatsapp', 'call', 'visit', 'other'
  direction TEXT NOT NULL,              -- 'inbound', 'outbound'
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interactions_contact ON interactions(contact_id, created_at DESC);

-- =====================================================
-- TRIGGER: atualizar agregados em contacts
-- =====================================================
CREATE OR REPLACE FUNCTION update_contact_aggregates()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contacts SET
    total_orders = (
      SELECT COUNT(*) FROM orders 
      WHERE contact_id = COALESCE(NEW.contact_id, OLD.contact_id) 
      AND status NOT IN ('cancelled', 'quote')
    ),
    lifetime_value = (
      SELECT COALESCE(SUM(total), 0) FROM orders 
      WHERE contact_id = COALESCE(NEW.contact_id, OLD.contact_id) 
      AND status IN ('delivered', 'paid')
    ),
    first_order_at = (
      SELECT MIN(created_at) FROM orders 
      WHERE contact_id = COALESCE(NEW.contact_id, OLD.contact_id) 
      AND status NOT IN ('cancelled', 'quote')
    ),
    last_order_at = (
      SELECT MAX(delivered_at) FROM orders 
      WHERE contact_id = COALESCE(NEW.contact_id, OLD.contact_id) 
      AND status IN ('delivered', 'paid')
    ),
    status = CASE
      WHEN (
        SELECT COUNT(*) FROM orders
        WHERE contact_id = COALESCE(NEW.contact_id, OLD.contact_id)
        AND status IN ('delivered', 'paid')
      ) > 0 THEN 'customer'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.contact_id, OLD.contact_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_update_contact
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION update_contact_aggregates();

-- =====================================================
-- TRIGGER: updated_at automático
-- =====================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contacts_updated_at
BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- VIEWS úteis
-- =====================================================
CREATE OR REPLACE VIEW v_clientes_para_reativar AS
SELECT
  c.*,
  EXTRACT(DAY FROM (NOW() - c.last_order_at))::INT AS dias_sem_comprar
FROM contacts c
WHERE c.status = 'customer'
  AND c.last_order_at < NOW() - INTERVAL '60 days'
ORDER BY c.lifetime_value DESC, c.last_order_at ASC;

CREATE OR REPLACE VIEW v_clientes_vip AS
SELECT *
FROM contacts
WHERE total_orders >= 3 OR lifetime_value >= 1000
ORDER BY lifetime_value DESC;

CREATE OR REPLACE VIEW v_clientes_em_risco AS
SELECT
  c.*,
  EXTRACT(DAY FROM (NOW() - c.last_order_at))::INT AS dias_sem_comprar
FROM contacts c
WHERE c.status = 'customer'
  AND c.last_order_at BETWEEN NOW() - INTERVAL '120 days' 
                          AND NOW() - INTERVAL '60 days'
ORDER BY c.lifetime_value DESC;

CREATE OR REPLACE VIEW v_leads_sem_resposta AS
SELECT
  c.*,
  EXTRACT(DAY FROM (NOW() - c.created_at))::INT AS dias_como_lead
FROM contacts c
WHERE c.status = 'lead'
  AND c.created_at < NOW() - INTERVAL '3 days'
ORDER BY c.created_at ASC;

-- =====================================================
-- RLS (Row Level Security) — habilitar mas permitir tudo pro service_role
-- Política mais restritiva quando frontend tiver auth multi-user
-- =====================================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Permite acesso completo pra usuários autenticados (ajustar depois)
CREATE POLICY "authenticated_full_access_contacts" ON contacts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_full_access_orders" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_full_access_interactions" ON interactions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 5. Backend FastAPI

### 5.1 Estrutura de pastas

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── deps.py             # dependências injetadas (auth, db)
│   ├── db.py               # cliente Supabase
│   ├── models/
│   │   ├── __init__.py
│   │   ├── contact.py
│   │   ├── order.py
│   │   └── interaction.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── contacts.py
│   │   ├── orders.py
│   │   └── views.py
│   └── services/
│       ├── __init__.py
│       └── contact_service.py
├── tests/
├── .env.example
├── .gitignore
├── pyproject.toml
├── Dockerfile
└── railway.toml
```

### 5.2 `pyproject.toml`

```toml
[project]
name = "sacolas-backend"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.110.0",
    "uvicorn[standard]>=0.27.0",
    "pydantic>=2.6.0",
    "pydantic-settings>=2.2.0",
    "supabase>=2.4.0",
    "python-jose[cryptography]>=3.3.0",
    "python-multipart>=0.0.9",
    "httpx>=0.27.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
    "ruff>=0.3.0",
    "mypy>=1.9.0",
]
```

Instala com `uv pip install -e .` ou `pip install -e ".[dev]"`.

### 5.3 `app/config.py`

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)
    
    APP_ENV: str = "development"
    APP_NAME: str = "Sacolas API"
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_ANON_KEY: str
    SUPABASE_JWT_SECRET: str  # pra validar tokens do frontend
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    
settings = Settings()
```

### 5.4 `app/db.py`

```python
from supabase import create_client, Client
from app.config import settings

def get_supabase() -> Client:
    """Cliente com service_role — usar APENAS no backend, nunca expor."""
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )

# Singleton simples
_supabase: Client | None = None

def supabase() -> Client:
    global _supabase
    if _supabase is None:
        _supabase = get_supabase()
    return _supabase
```

### 5.5 `app/models/contact.py`

```python
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator
import re

PHONE_REGEX = re.compile(r"^\+?[1-9]\d{1,14}$")  # E.164

class ContactBase(BaseModel):
    phone: str
    name: str = Field(min_length=1, max_length=200)
    business_name: Optional[str] = None
    segment: Optional[str] = None
    source: str = "manual"
    status: str = "lead"
    tags: list[str] = Field(default_factory=list)
    has_vector_logo: bool = False
    notes: Optional[str] = None
    
    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Limpa caracteres
        cleaned = re.sub(r"[^\d+]", "", v)
        # Adiciona +55 se for número BR sem código
        if not cleaned.startswith("+"):
            if len(cleaned) in (10, 11):  # número BR
                cleaned = "+55" + cleaned
            else:
                cleaned = "+" + cleaned
        if not PHONE_REGEX.match(cleaned):
            raise ValueError(f"Telefone inválido: {v}")
        return cleaned

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    business_name: Optional[str] = None
    segment: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[list[str]] = None
    has_vector_logo: Optional[bool] = None
    notes: Optional[str] = None

class Contact(ContactBase):
    id: UUID
    first_order_at: Optional[datetime] = None
    last_order_at: Optional[datetime] = None
    last_contact_at: Optional[datetime] = None
    total_orders: int = 0
    lifetime_value: float = 0
    created_at: datetime
    updated_at: datetime
```

### 5.6 `app/models/order.py`

```python
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

ORDER_STATUSES = [
    "quote", "confirmed", "vector_pending", "factory_pending",
    "printing", "ready_to_deliver", "delivered", "paid", "cancelled"
]

class OrderBase(BaseModel):
    contact_id: UUID
    quantity: int = Field(gt=0)
    bag_model: Optional[str] = None
    bag_size: Optional[str] = None
    unit_price: Optional[float] = None
    total: float = Field(ge=0)
    paid_amount: float = 0
    status: str = "quote"
    delivery_address: Optional[str] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    quantity: Optional[int] = None
    bag_model: Optional[str] = None
    bag_size: Optional[str] = None
    unit_price: Optional[float] = None
    total: Optional[float] = None
    paid_amount: Optional[float] = None
    status: Optional[str] = None
    delivery_address: Optional[str] = None
    notes: Optional[str] = None
    delivered_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None

class Order(OrderBase):
    id: UUID
    confirmed_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
```

### 5.7 `app/routers/contacts.py`

```python
from fastapi import APIRouter, Depends, HTTPException, Query
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
```

### 5.8 `app/routers/orders.py`

```python
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.db import supabase
from app.models.order import Order, OrderCreate, OrderUpdate

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("/", response_model=list[Order])
async def list_orders(
    contact_id: Optional[UUID] = None,
    status: Optional[str] = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
):
    query = supabase().table("orders").select("*")
    
    if contact_id:
        query = query.eq("contact_id", str(contact_id))
    if status:
        query = query.eq("status", status)
    
    query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
    result = query.execute()
    return result.data

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
```

### 5.9 `app/routers/views.py`

```python
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
```

### 5.10 `app/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import contacts, orders, views

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contacts.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(views.router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "ok"}
```

### 5.11 `.env.example`

```bash
APP_ENV=development
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-settings
FRONTEND_URL=http://localhost:3000
```

### 5.12 `Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir -e .

COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 5.13 Rodando local

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate no Windows
pip install -e ".[dev]"
cp .env.example .env  # preencher valores
uvicorn app.main:app --reload
# API em http://localhost:8000
# Docs em http://localhost:8000/docs
```

---

## 6. Frontend Next.js

### 6.1 Estrutura de pastas

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # /  (dashboard)
│   ├── globals.css
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── contacts/
│   │   ├── page.tsx              # lista
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx         # detalhe
│   ├── orders/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   └── api/                      # opcional, proxy pra FastAPI se quiser
├── components/
│   ├── ui/                       # shadcn
│   ├── ContactForm.tsx
│   ├── ContactList.tsx
│   ├── OrderForm.tsx
│   └── nav.tsx
├── lib/
│   ├── api.ts                    # client HTTP pro FastAPI
│   ├── supabase.ts               # cliente browser (só pra auth)
│   ├── types.ts
│   └── utils.ts
├── .env.local.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### 6.2 Setup inicial

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"

# shadcn
npx shadcn@latest init
npx shadcn@latest add button input label card table dialog form select badge sonner

# Supabase pra auth
pnpm add @supabase/supabase-js @supabase/ssr

# Outras
pnpm add date-fns react-hook-form zod @hookform/resolvers axios
```

### 6.3 `.env.local.example`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 6.4 `lib/api.ts`

```typescript
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor pra adicionar token do Supabase
api.interceptors.request.use(async (config) => {
  const { createBrowserClient } = await import('@supabase/ssr')
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})
```

### 6.5 `lib/types.ts`

```typescript
export interface Contact {
  id: string
  phone: string
  name: string
  business_name?: string
  segment?: string
  source: string
  status: 'lead' | 'customer' | 'inactive' | 'churned'
  tags: string[]
  has_vector_logo: boolean
  notes?: string
  first_order_at?: string
  last_order_at?: string
  last_contact_at?: string
  total_orders: number
  lifetime_value: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  contact_id: string
  quantity: number
  bag_model?: string
  bag_size?: string
  unit_price?: number
  total: number
  paid_amount: number
  status: 'quote' | 'confirmed' | 'vector_pending' | 'factory_pending' 
        | 'printing' | 'ready_to_deliver' | 'delivered' | 'paid' | 'cancelled'
  confirmed_at?: string
  delivered_at?: string
  paid_at?: string
  delivery_address?: string
  notes?: string
  created_at: string
  updated_at: string
}
```

### 6.6 Telas mínimas (V1)

Por prioridade de implementação:

**Tela 1 — Lista de contatos (`app/contacts/page.tsx`)**

Funcionalidades:
- Tabela com: nome, telefone, segmento, dias sem comprar, LTV, status (badge)
- Filtros: status (todos/lead/customer/inactive), segmento, busca por nome/telefone
- Botão "+ Novo cliente" sempre visível
- Click na linha abre detalhe
- **Mobile:** vira lista de cards em vez de tabela

**Tela 2 — Detalhe do contato (`app/contacts/[id]/page.tsx`)**

Funcionalidades:
- Header: nome, telefone (com botão "abrir WhatsApp" usando `https://wa.me/{phone}`), status, segmento
- Métricas: total de pedidos, LTV, última compra, dias sem comprar
- Botões: "Editar contato", "+ Novo pedido"
- Histórico de pedidos (tabela com status, quantidade, total, datas)
- Histórico de interações (futuro)
- Notas livres

**Tela 3 — Novo contato (`app/contacts/new/page.tsx`)**

Formulário simples com:
- Nome*
- Telefone* (com mask e validação)
- Nome do negócio
- Segmento (select com opções predefinidas)
- Status (default: lead)
- Tags (input livre)
- Tem logo vetorizada? (checkbox)
- Observações (textarea)

**Tela 4 — Novo pedido (`app/orders/new/page.tsx` ou modal em /contacts/[id])**

Formulário:
- Cliente (autocomplete buscando contatos — ou pré-preenchido se vier de /contacts/[id])
- Quantidade*
- Modelo da sacola
- Tamanho
- Valor total*
- Status (default: confirmed)
- Endereço de entrega
- Observações

**Tela 5 — Dashboard (`app/page.tsx`)**

Cards com:
- Receita do mês
- Pedidos do mês
- Total de clientes
- Total de leads
- **Lista clicável:** "Clientes pra reativar (X)" → leva pra view
- **Lista clicável:** "Clientes em risco (X)" → leva pra view
- **Lista clicável:** "Leads sem resposta há +3 dias (X)" → leva pra view

### 6.7 Exemplo de implementação — Lista de contatos

```tsx
// app/contacts/page.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Contact } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const t = setTimeout(() => fetchContacts(), 300) // debounce
    return () => clearTimeout(t)
  }, [search, status])
  
  async function fetchContacts() {
    setLoading(true)
    try {
      const params: any = {}
      if (search) params.search = search
      if (status !== 'all') params.status = status
      const { data } = await api.get<Contact[]>('/contacts/', { params })
      setContacts(data)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Link href="/contacts/new">
          <Button>+ Novo</Button>
        </Link>
      </div>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <Input
          placeholder="Buscar por nome ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3"
        >
          <option value="all">Todos</option>
          <option value="lead">Leads</option>
          <option value="customer">Clientes</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>
      
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <Link key={c.id} href={`/contacts/${c.id}`}>
              <Card className="p-3 hover:bg-accent cursor-pointer">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {c.business_name || c.phone}
                    </div>
                    {c.segment && (
                      <Badge variant="outline" className="mt-1">{c.segment}</Badge>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <Badge variant={c.status === 'customer' ? 'default' : 'secondary'}>
                      {c.status}
                    </Badge>
                    {c.last_order_at && (
                      <div className="text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(c.last_order_at), { locale: ptBR, addSuffix: true })}
                      </div>
                    )}
                    {c.lifetime_value > 0 && (
                      <div className="font-medium mt-1">
                        R$ {c.lifetime_value.toFixed(0)}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

Esse componente já é mobile-first: usa cards que ficam bonitos em qualquer tamanho.

### 6.8 PWA pra ele instalar como app

No `next.config.mjs`:

```javascript
import withPWA from 'next-pwa'

const config = {
  // ...
}

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})(config)
```

Adiciona `public/manifest.json` e ícones (192x192 e 512x512). Quando o dono abrir no celular, vai aparecer "Adicionar à tela inicial" — vira app.

---

## 7. Script de importação vCard

Para importar a base atual do celular dele:

### 7.1 Como o dono exporta a agenda

**iOS (iPhone):**
1. Abre app Contatos
2. Vai em listas → seleciona "Todos" os contatos "SACOLA"
3. Compartilhar contatos → Mail → manda pra você
4. Você recebe um `.vcf` com todos

**Android:**
1. App Contatos → Configurações → Exportar → Exportar para arquivo VCF
2. Manda pra você

Resultado: arquivo `.vcf` com formato:

```
BEGIN:VCARD
VERSION:3.0
FN:SACOLA João Papelaria
TEL;TYPE=CELL:+5521999999999
END:VCARD
```

### 7.2 `scripts/import_vcard.py`

```python
"""
Importa contatos de arquivo .vcf pra base do Supabase.
Uso: python scripts/import_vcard.py path/to/contatos.vcf
"""
import sys
import re
from pathlib import Path
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

PREFIX_PATTERN = re.compile(r"^SACOLA[\s\-_]*", re.IGNORECASE)

def parse_vcard(content: str) -> list[dict]:
    """Parser simples de vCard."""
    contacts = []
    cards = content.split("BEGIN:VCARD")
    
    for card in cards[1:]:  # primeiro item é vazio
        # Nome
        fn_match = re.search(r"FN[^:]*:(.+)", card)
        name = fn_match.group(1).strip() if fn_match else None
        
        # Telefone — pega o primeiro
        tel_match = re.search(r"TEL[^:]*:(.+)", card)
        phone = tel_match.group(1).strip() if tel_match else None
        
        if not name or not phone:
            continue
        
        # Limpa prefixo SACOLA
        cleaned_name = PREFIX_PATTERN.sub("", name).strip()
        if not cleaned_name:
            cleaned_name = name  # fallback
        
        # Normaliza telefone
        phone_digits = re.sub(r"[^\d+]", "", phone)
        if not phone_digits.startswith("+"):
            if len(phone_digits) in (10, 11):
                phone_digits = "+55" + phone_digits
            else:
                phone_digits = "+" + phone_digits
        
        contacts.append({
            "name": cleaned_name,
            "phone": phone_digits,
            "source": "imported",
            "status": "lead",  # importa todos como lead; promove a customer quando registrar pedido
            "tags": ["importado_vcard"],
        })
    
    return contacts

def main():
    if len(sys.argv) < 2:
        print("Uso: python import_vcard.py path/to/contatos.vcf")
        sys.exit(1)
    
    vcf_path = Path(sys.argv[1])
    if not vcf_path.exists():
        print(f"Arquivo não encontrado: {vcf_path}")
        sys.exit(1)
    
    content = vcf_path.read_text(encoding="utf-8")
    contacts = parse_vcard(content)
    
    # Filtra: apenas os que têm prefixo SACOLA (se quiser limitar)
    only_sacola = [c for c in contacts if "importado_vcard" in c["tags"]]
    
    print(f"Encontrados {len(contacts)} contatos. Vai importar {len(only_sacola)}.")
    confirm = input("Continuar? (s/N): ")
    if confirm.lower() != "s":
        print("Cancelado.")
        return
    
    sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # Importa em batch, tratando duplicatas
    imported = 0
    skipped = 0
    errors = 0
    
    for c in only_sacola:
        try:
            # Verifica se já existe
            existing = sb.table("contacts").select("id").eq("phone", c["phone"]).execute()
            if existing.data:
                skipped += 1
                continue
            
            sb.table("contacts").insert(c).execute()
            imported += 1
        except Exception as e:
            print(f"Erro em {c['name']}: {e}")
            errors += 1
    
    print(f"\n✅ Importados: {imported}")
    print(f"⏭️  Pulados (já existiam): {skipped}")
    print(f"❌ Erros: {errors}")

if __name__ == "__main__":
    main()
```

Roda com:

```bash
cd scripts
pip install supabase python-dotenv
python import_vcard.py ~/Downloads/contatos.vcf
```

---

## 8. Plano de execução por dia

### Dia 1 — Setup e banco
- [ ] Criar contas (Supabase, GitHub, Railway, Vercel)
- [ ] Repositório criado e estrutura inicial commitada
- [ ] Migration 001 rodada no Supabase
- [ ] Testar inserir 2-3 contatos diretamente no Supabase Studio pra validar schema

### Dia 2 — Backend
- [ ] FastAPI rodando local
- [ ] Endpoints `/contacts` (CRUD) testados via `/docs`
- [ ] Endpoints `/orders` (CRUD) testados
- [ ] Endpoints `/views` testados
- [ ] Tratamento de erros básico (404, 409)

### Dia 3 — Frontend base
- [ ] Next.js criado, shadcn instalado
- [ ] Tela de login (Supabase Auth)
- [ ] Layout com navbar (Contatos, Pedidos, Dashboard)
- [ ] Cliente API funcionando (testar com endpoint /contacts)

### Dia 4 — Telas principais
- [ ] Lista de contatos com filtros e busca
- [ ] Detalhe de contato com histórico de pedidos
- [ ] Form de criar/editar contato
- [ ] Form de criar/editar pedido

### Dia 5 — Dashboard + importação
- [ ] Tela de dashboard com KPIs e listas de visualizações
- [ ] Script de importação vCard testado com base do dono
- [ ] Cadastro manual dos top 50 clientes (sessão de 1h com o dono)

### Dia 6 — Deploy
- [ ] Backend deployado no Railway com domínio
- [ ] Frontend deployado na Vercel com domínio
- [ ] Variáveis de ambiente configuradas
- [ ] PWA configurado, ícones criados
- [ ] Testar instalação como app no celular do dono

### Dia 7 — Treinamento e ajustes
- [ ] Sessão de 1-2h com o dono explicando o sistema
- [ ] Cadastrar pedidos juntos pra ele pegar o ritmo
- [ ] Anotar feedbacks pra ajustes da semana seguinte

---

## 9. Como o dono vai usar (fluxo de uso esperado)

**Manhã (5min):**
- Abre o app no celular
- Olha "Clientes pra reativar" no dashboard
- Pega 2-3 contatos pra contatar via WhatsApp pessoalmente

**Durante o dia (segundos por venda):**
- Fechou venda no WhatsApp → abre app → busca cliente → "+ Pedido" → preenche → salva
- 30 segundos
- Cliente novo? Cadastra antes (mais 30 segundos)

**Fim do dia (opcional, 2min):**
- Vai em Pedidos → marca os entregues como `delivered`
- Marca os pagos como `paid`

**Toda segunda:**
- Olha dashboard → quanto vendeu na semana, quantos clientes novos, quem tá sumindo

---

## 10. Próximos passos depois do protótipo

Quando esse CRM tiver rodando 2-3 semanas e ele estiver acostumado:

1. **Pipeline visual (Kanban) de pedidos** — drag-and-drop entre status
2. **Integração WhatsApp Cloud API** — todo módulo do PRD original
3. **Mockup IA automático**
4. **Régua de pós-venda**
5. **Bot do operador** ("como tá a semana?")

Tudo isso **encaixa em cima** desse mesmo banco e desse mesmo backend. Você não joga nada fora.

---

## 11. Decisões técnicas que valem registrar

**Por que Supabase service_role no backend:**
RLS habilitado, mas backend usa service_role pra simplicidade no protótipo. Quando tiver múltiplos usuários, refina policies pra user_id.

**Por que telefone como chave natural única:**
No fluxo do negócio, telefone identifica cliente univocamente — mais que e-mail (que muita gente não tem) ou CPF (que ninguém vai dar). Vira a chave estrangeira lógica pra integração futura com WhatsApp.

**Por que separar Backend FastAPI e Frontend Next.js:**
Permite que módulos futuros (webhooks WhatsApp, jobs assíncronos, integração com Claude/Replicate) rodem no Python sem espalhar lógica pelo Next.js. Frontend só pinta tela.

**Por que `interactions` desde já:**
Mesmo sem WhatsApp integrado, o dono pode logar manualmente "liguei pro João" — gera histórico. Quando WhatsApp integrar, dados estruturados continuam no mesmo formato.

**Status do contato `lead → customer` automático:**
Trigger promove pra `customer` quando tem 1+ pedido entregue. Manual override possível via UI.