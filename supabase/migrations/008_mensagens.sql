-- =====================================================
-- 008_mensagens.sql
-- Fase 2 (WhatsApp Cloud API via Coexistence): persistencia das mensagens.
-- Gera o substrato que os agentes vao ler. NAO toca no WhatsApp; so guarda o
-- que o webhook entrega: entrada (messages), ~6 meses de historico do onboarding
-- (history), o que o dono manda pelo app (smb_message_echoes) e status.
-- Aditivo e idempotente. Rode no SQL Editor do Supabase.
-- Pre-req: criar uma vez um bucket PRIVADO 'whatsapp' no Storage (midia).
-- =====================================================

-- 1) Mensagens. wa_message_id UNIQUE garante idempotencia (history, echo e
--    entrega podem reenviar a mesma mensagem -> UPSERT, nunca duplica).
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wa_message_id TEXT UNIQUE,                 -- id da Meta (chave de dedup)
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL, -- resolvido por telefone no backend
  wa_phone TEXT NOT NULL,                    -- E.164 do outro lado da conversa
  direction TEXT NOT NULL,                   -- 'inbound' | 'outbound'
  source TEXT NOT NULL DEFAULT 'api',        -- 'api' | 'echo' (mandado pelo app) | 'history' (sync 6 meses)
  msg_type TEXT NOT NULL DEFAULT 'text',     -- text | image | audio | document | video | sticker | location | other
  body TEXT,                                 -- texto ou legenda da midia
  media_url TEXT,                            -- URL no Storage (se midia)
  media_storage_path TEXT,
  status TEXT,                               -- received | sent | delivered | read | failed
  wa_timestamp TIMESTAMPTZ NOT NULL,         -- horario REAL da mensagem (history traz antigos)
  raw JSONB,                                 -- payload bruto (observabilidade / debug)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_thread
  ON messages(contact_id, wa_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_phone
  ON messages(wa_phone, wa_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_direction
  ON messages(direction, wa_timestamp DESC);

-- 2) Agregados de conversa no contato (alimentam a lista de conversas e os agentes).
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_inbound_at TIMESTAMPTZ;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_message_preview TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS unread_count INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_contacts_last_message
  ON contacts(last_message_at DESC NULLS LAST);

-- 3) Trigger: ao inserir uma mensagem, atualiza os agregados do contato.
--    Usa GREATEST pra nao retroceder quando o history (antigo) chega depois.
CREATE OR REPLACE FUNCTION update_contact_message_aggregates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contact_id IS NULL THEN
    RETURN NEW;
  END IF;

  UPDATE contacts SET
    last_message_at = GREATEST(COALESCE(last_message_at, NEW.wa_timestamp), NEW.wa_timestamp),
    last_inbound_at = CASE
      WHEN NEW.direction = 'inbound'
        THEN GREATEST(COALESCE(last_inbound_at, NEW.wa_timestamp), NEW.wa_timestamp)
      ELSE last_inbound_at END,
    last_contact_at = GREATEST(COALESCE(last_contact_at, NEW.wa_timestamp), NEW.wa_timestamp),
    -- so atualiza o preview se esta mensagem for a mais recente do contato
    last_message_preview = CASE
      WHEN NEW.wa_timestamp >= COALESCE(last_message_at, NEW.wa_timestamp)
        THEN LEFT(COALESCE(NEW.body, '[' || NEW.msg_type || ']'), 120)
      ELSE last_message_preview END,
    -- nao incrementa unread pra mensagens antigas do sync de historico
    unread_count = CASE
      WHEN NEW.direction = 'inbound' AND NEW.source <> 'history'
        THEN unread_count + 1
      ELSE unread_count END,
    updated_at = NOW()
  WHERE id = NEW.contact_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_messages_aggregates ON messages;
CREATE TRIGGER trg_messages_aggregates
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_contact_message_aggregates();

-- 4) RLS. O webhook grava usando a service role (bypassa RLS); o dono le como
--    usuario autenticado.
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_full_messages" ON messages;
CREATE POLICY "auth_full_messages" ON messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- Observacoes (nao executam nada):
-- * unread_count zera quando o dono abre a conversa (PATCH no backend), nao aqui.
-- * Mensagens de numero desconhecido: o backend faz find-or-create do contato por
--   telefone (source='whatsapp', status='lead') ANTES de inserir, pra o trigger ligar.
-- * 'history' e 'echo' usam o mesmo INSERT; o que muda e source/direction/wa_timestamp.
-- =====================================================
