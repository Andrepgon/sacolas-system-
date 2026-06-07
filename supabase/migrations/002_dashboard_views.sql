-- =====================================================
-- 002_dashboard_views.sql
-- Views agregadas pra dashboard V1.5 (aditivo)
-- Não altera tabelas nem views da migration 001.
-- =====================================================

-- Receita & pedidos por mês (últimos 12 meses, baseado em delivered_at)
CREATE OR REPLACE VIEW v_receita_mensal AS
SELECT
  date_trunc('month', delivered_at)::date AS mes,
  COUNT(*)::INT                            AS pedidos,
  COALESCE(SUM(total), 0)::NUMERIC(12,2)   AS receita
FROM orders
WHERE status IN ('delivered', 'paid')
  AND delivered_at IS NOT NULL
  AND delivered_at >= date_trunc('month', NOW() - INTERVAL '11 months')
GROUP BY date_trunc('month', delivered_at)
ORDER BY mes ASC;

-- Distribuição de clientes por segmento
CREATE OR REPLACE VIEW v_clientes_por_segmento AS
SELECT
  COALESCE(NULLIF(segment, ''), 'sem_segmento') AS segment,
  COUNT(*)::INT                                  AS total_clientes,
  COALESCE(SUM(lifetime_value), 0)::NUMERIC(12,2) AS receita_total
FROM contacts
WHERE status = 'customer'
GROUP BY COALESCE(NULLIF(segment, ''), 'sem_segmento')
ORDER BY receita_total DESC;

-- Ranking de melhores clientes (LTV desc)
CREATE OR REPLACE VIEW v_top_clientes AS
SELECT
  id,
  name,
  business_name,
  segment,
  total_orders,
  lifetime_value,
  last_order_at
FROM contacts
WHERE status = 'customer'
ORDER BY lifetime_value DESC NULLS LAST;
