-- =====================================================
-- 005_dashboard_revenue_paid.sql
-- Receita do dashboard passa a contar pedidos PAGOS (status='paid')
-- pela data paid_at, não mais por delivered_at. Adiciona
-- renda_media_diaria. Mudança de colunas em v_dashboard_summary
-- exige DROP + CREATE.
-- =====================================================

-- v_dashboard_summary: nova coluna renda_media_diaria + semântica de receita
-- redefinida (status='paid' + paid_at). DROP obrigatório por mudança de colunas.
DROP VIEW IF EXISTS v_dashboard_summary;

CREATE VIEW v_dashboard_summary AS
WITH this_month AS (
  SELECT
    COALESCE(SUM(total), 0)::NUMERIC(12,2) AS receita,
    COUNT(*)::INT                          AS pedidos
  FROM orders
  WHERE status = 'paid'
    AND paid_at >= date_trunc('month', NOW())
    AND paid_at <  date_trunc('month', NOW()) + INTERVAL '1 month'
),
prev_month AS (
  SELECT
    COALESCE(SUM(total), 0)::NUMERIC(12,2) AS receita
  FROM orders
  WHERE status = 'paid'
    AND paid_at >= date_trunc('month', NOW() - INTERVAL '1 month')
    AND paid_at <  date_trunc('month', NOW())
),
customers AS (
  SELECT
    COUNT(*)::INT                                   AS total_customers,
    COALESCE(AVG(lifetime_value), 0)::NUMERIC(12,2) AS ltv_medio
  FROM contacts
  WHERE status = 'customer'
),
leads AS (
  SELECT
    COUNT(*)::INT                                                       AS total_leads,
    COUNT(*) FILTER (WHERE created_at < NOW() - INTERVAL '3 days')::INT AS leads_sem_resposta
  FROM contacts
  WHERE status = 'lead'
)
SELECT
  t.receita                                                AS receita_mes,
  t.pedidos                                                AS pedidos_mes,
  CASE
    WHEN t.pedidos > 0 THEN (t.receita / t.pedidos)::NUMERIC(12,2)
    ELSE 0::NUMERIC(12,2)
  END                                                      AS ticket_medio,
  (t.receita / GREATEST(EXTRACT(DAY FROM NOW())::INT, 1))::NUMERIC(12,2)
                                                           AS renda_media_diaria,
  p.receita                                                AS receita_mes_anterior,
  CASE
    WHEN p.receita > 0 THEN ((t.receita - p.receita) / p.receita * 100)::NUMERIC(6,2)
    ELSE NULL
  END                                                      AS delta_receita_pct,
  c.total_customers,
  c.ltv_medio,
  l.total_leads,
  l.leads_sem_resposta
FROM this_month t, prev_month p, customers c, leads l;

-- v_receita_mensal: mesmas colunas, mas filtro/agrupamento agora é
-- status='paid' + paid_at (no lugar de delivered/paid + delivered_at).
-- Drop + create por consistência com a regra "se mudar coluna, recria do zero"
-- (aqui as colunas continuam iguais, mas a semântica muda — preferimos
-- ser explícitos a usar CREATE OR REPLACE escondendo a quebra).
DROP VIEW IF EXISTS v_receita_mensal;

CREATE VIEW v_receita_mensal AS
SELECT
  date_trunc('month', paid_at)::date     AS mes,
  COUNT(*)::INT                          AS pedidos,
  COALESCE(SUM(total), 0)::NUMERIC(12,2) AS receita
FROM orders
WHERE status = 'paid'
  AND paid_at IS NOT NULL
  AND paid_at >= date_trunc('month', NOW() - INTERVAL '11 months')
GROUP BY date_trunc('month', paid_at)
ORDER BY mes ASC;
