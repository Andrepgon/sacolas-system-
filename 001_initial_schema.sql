-- =====================================================
-- 001_initial_schema.sql
-- Protótipo CRM Sacolas — schema final
-- =====================================================

-- Extensões necessárias (ANTES de qualquer índice que dependa delas)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

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
  segment TEXT,                          -- 'papelaria', 'restaurante', 'boutique', 'confeitaria', 'outro'
  source TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'facebook_ad', 'organic', 'indicacao', 'imported'
  status TEXT NOT NULL DEFAULT 'lead',   -- 'lead', 'customer', 'inactive', 'churned'
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
  type TEXT NOT NULL,        -- 'whatsapp', 'call', 'visit', 'other'
  direction TEXT NOT NULL,   -- 'inbound', 'outbound'
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
-- RLS (Row Level Security)
-- =====================================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_full_access_contacts" ON contacts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_full_access_orders" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_full_access_interactions" ON interactions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
