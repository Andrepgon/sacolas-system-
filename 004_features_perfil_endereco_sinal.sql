-- =====================================================
-- 004_features_perfil_endereco_sinal.sql
-- Aditivo: imagens do cliente, endereços múltiplos, marca do sinal,
-- e ajuste do trigger (sinal/confirmado promove lead -> cliente).
-- Não altera nada existente. Rode no SQL Editor do Supabase.
-- =====================================================

-- 1) Mídia do cliente (logo vetorizada, mockup, etc.)
CREATE TABLE IF NOT EXISTS contact_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  kind TEXT DEFAULT 'outro',     -- 'logo_vetor' | 'mockup' | 'outro'
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contact_media_contact
  ON contact_media(contact_id, created_at DESC);

-- 2) Endereços do cliente (pode ter vários)
CREATE TABLE IF NOT EXISTS contact_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  label TEXT,                    -- 'Loja centro', 'Depósito', etc.
  address TEXT NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contact_addresses_contact
  ON contact_addresses(contact_id);

-- 3) Pedido: liga a um endereço salvo.
--    Obs: "Sinal pago" SUBSTITUI "Confirmado" (mesmo momento), então reaproveitamos
--    a coluna existente confirmed_at como a data do sinal — sem coluna nova.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address_id UUID REFERENCES contact_addresses(id);

-- 4) RLS nas tabelas novas
ALTER TABLE contact_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_full_contact_media" ON contact_media;
CREATE POLICY "auth_full_contact_media" ON contact_media
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_full_contact_addresses" ON contact_addresses;
CREATE POLICY "auth_full_contact_addresses" ON contact_addresses
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5) Trigger: agora o SINAL (e confirmado) já promove lead -> cliente.
--    "O sinal garante a venda" => vira cliente. LTV continua só delivered/paid.
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
        AND status NOT IN ('quote', 'cancelled')
      ) > 0 THEN 'customer'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.contact_id, OLD.contact_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
