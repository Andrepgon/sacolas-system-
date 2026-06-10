-- =====================================================
-- 007_campanhas.sql
-- Aditivo: campanhas de WhatsApp (disparo ASSISTIDO 1-clique, sem API/SaaS)
-- + opt-out (LGPD). O dono compoe a campanha (texto + imagem), seleciona os
-- contatos, e o app monta uma fila pra ele disparar do proprio WhatsApp.
-- Nada existente e alterado. Rode no SQL Editor do Supabase.
-- =====================================================

-- 1) Opt-out (LGPD): contato que pediu pra nao receber campanhas.
--    Tambem guardamos a data do ultimo disparo p/ evitar excesso na mesma pessoa.
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS opt_out BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS opt_out_at TIMESTAMPTZ;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_campaign_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_contacts_opt_out ON contacts(opt_out);

-- 2) Campanha. message_template aceita placeholders resolvidos no backend:
--    {{primeiro_nome}}, {{nome}}, {{empresa}}, {{imagem}}
--    A imagem fica hospedada no Supabase Storage; image_url e o link publico que
--    entra no texto (substitui {{imagem}}, ou e anexado ao fim se o placeholder
--    nao estiver presente e houver imagem).
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message_template TEXT NOT NULL,
  image_url TEXT,
  image_storage_path TEXT,
  status TEXT NOT NULL DEFAULT 'draft',   -- draft | ready | sending | done | archived
  total_recipients INT NOT NULL DEFAULT 0,
  sent_count INT NOT NULL DEFAULT 0,
  skipped_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status
  ON campaigns(status, created_at DESC);

-- 3) Fila de disparo: 1 linha por (campanha, contato).
--    Guarda phone e rendered_message como SNAPSHOT no momento em que a fila e
--    gerada (reprodutibilidade: o texto enviado fica registrado mesmo que o
--    contato mude depois). status acompanha o disparo assistido.
CREATE TABLE IF NOT EXISTS campaign_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,                    -- E.164 (snapshot)
  rendered_message TEXT NOT NULL,         -- texto final (placeholders ja resolvidos)
  status TEXT NOT NULL DEFAULT 'pending', -- pending | sent | skipped
  sent_at TIMESTAMPTZ,
  position INT NOT NULL DEFAULT 0,        -- ordem na fila
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, contact_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_sends_fila
  ON campaign_sends(campaign_id, status, position);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_contact
  ON campaign_sends(contact_id, created_at DESC);

-- 4) RLS (mesmo padrao das demais tabelas: usuario unico autenticado).
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_sends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_full_campaigns" ON campaigns;
CREATE POLICY "auth_full_campaigns" ON campaigns
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_full_campaign_sends" ON campaign_sends;
CREATE POLICY "auth_full_campaign_sends" ON campaign_sends
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- Observacoes (nao executam nada):
-- * Os contadores (sent_count/skipped_count/total_recipients) sao mantidos pelo
--   backend a cada PATCH de campaign_sends. Se preferir robustez via trigger no
--   futuro, e aditivo e pode entrar numa 00X posterior.
-- * Imagem: criar (uma vez, no painel do Supabase) um bucket PUBLICO chamado
--   'campaigns' no Storage. O upload reaproveita o padrao ja usado em media.py.
-- =====================================================
