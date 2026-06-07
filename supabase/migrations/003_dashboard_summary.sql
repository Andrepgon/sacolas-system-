-- =====================================================
-- 003_dashboard_summary.sql
-- View agregada para o Dashboard novo. Adita campos que o
-- /views/stats antigo não calcula: delta de receita vs mês
-- anterior, ticket médio, LTV médio, e leads sem resposta.
-- Não altera tabelas nem views existentes.
-- =====================================================

CREATE OR REPLACE VIEW v_dashboard_summary AS
WITH this_month AS (
  SELECT
    COALESCE(SUM(total), 0)::NUMERIC(12,2) AS receita,
    COUNT(*)::INT                            AS pedidos
  FROM orders
  WHERE status IN ('delivered', 'paid')
    AND delivered_at >= date_trunc('month', NOW())
    AND delivered_at <  date_trunc('month', NOW()) + INTERVAL '1 month'
),
prev_month AS (
  SELECT
    COALESCE(SUM(total), 0)::NUMERIC(12,2) AS receita
  FROM orders
  WHERE status IN ('delivered', 'paid')
    AND delivered_at >= date_trunc('month', NOW() - INTERVAL '1 month')
    AND delivered_at <  date_trunc('month', NOW())
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
    COUNT(*)::INT                                                              AS total_leads,
    COUNT(*) FILTER (WHERE created_at < NOW() - INTERVAL '3 days')::INT        AS leads_sem_resposta
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
