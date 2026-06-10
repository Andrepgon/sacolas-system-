-- =====================================================
-- 006_dashboard_receita_caixa.sql
-- Receita do mês = DINHEIRO RECEBIDO (paid_amount), separando:
--   receita_de_pagos  = de pedidos 100% pagos (status='paid')
--   receita_de_sinais = dos sinais de pedidos em aberto (status='signal_paid')
--   receita_mes       = soma dos dois
-- Expõe também pedidos_em_aberto e saldo_a_receber.
-- DROP + CREATE por mudança de colunas.
-- =====================================================

DROP VIEW IF EXISTS v_dashboard_summary;

CREATE VIEW v_dashboard_summary AS
WITH pagos_mes AS (
  SELECT COALESCE(SUM(paid_amount), 0)::NUMERIC(12,2) AS receita,
         COUNT(*)::INT                                AS pedidos
  FROM orders
  WHERE status = 'paid'
    AND COALESCE(paid_at, created_at) >= date_trunc('month', NOW())
    AND COALESCE(paid_at, created_at) <  date_trunc('month', NOW()) + INTERVAL '1 month'
),
sinais_mes AS (
  SELECT COALESCE(SUM(paid_amount), 0)::NUMERIC(12,2) AS receita,
         COUNT(*)::INT                                AS pedidos
  FROM orders
  WHERE status = 'signal_paid'
    AND COALESCE(confirmed_at, created_at) >= date_trunc('month', NOW())
    AND COALESCE(confirmed_at, created_at) <  date_trunc('month', NOW()) + INTERVAL '1 month'
),
pagos_ant AS (
  SELECT COALESCE(SUM(paid_amount), 0)::NUMERIC(12,2) AS receita
  FROM orders
  WHERE status = 'paid'
    AND COALESCE(paid_at, created_at) >= date_trunc('month', NOW() - INTERVAL '1 month')
    AND COALESCE(paid_at, created_at) <  date_trunc('month', NOW())
),
sinais_ant AS (
  SELECT COALESCE(SUM(paid_amount), 0)::NUMERIC(12,2) AS receita
  FROM orders
  WHERE status = 'signal_paid'
    AND COALESCE(confirmed_at, created_at) >= date_trunc('month', NOW() - INTERVAL '1 month')
    AND COALESCE(confirmed_at, created_at) <  date_trunc('month', NOW())
),
abertos AS (
  SELECT COUNT(*)::INT                                         AS pedidos_em_aberto,
         COALESCE(SUM(total - paid_amount), 0)::NUMERIC(12,2)  AS saldo_a_receber
  FROM orders
  WHERE status NOT IN ('paid', 'cancelled', 'quote')
),
customers AS (
  SELECT COUNT(*)::INT                                   AS total_customers,
         COALESCE(AVG(lifetime_value), 0)::NUMERIC(12,2) AS ltv_medio
  FROM contacts WHERE status = 'customer'
),
leads AS (
  SELECT COUNT(*)::INT                                                       AS total_leads,
         COUNT(*) FILTER (WHERE created_at < NOW() - INTERVAL '3 days')::INT AS leads_sem_resposta
  FROM contacts WHERE status = 'lead'
)
SELECT
  (pg.receita + sn.receita)::NUMERIC(12,2)                  AS receita_mes,
  pg.receita                                               AS receita_de_pagos,
  sn.receita                                               AS receita_de_sinais,
  (pg.pedidos + sn.pedidos)                                AS pedidos_mes,
  CASE WHEN (pg.pedidos + sn.pedidos) > 0
       THEN ((pg.receita + sn.receita) / (pg.pedidos + sn.pedidos))::NUMERIC(12,2)
       ELSE 0::NUMERIC(12,2) END                           AS ticket_medio,
  ((pg.receita + sn.receita) / GREATEST(EXTRACT(DAY FROM NOW())::INT, 1))::NUMERIC(12,2)
                                                           AS renda_media_diaria,
  (pga.receita + sna.receita)::NUMERIC(12,2)               AS receita_mes_anterior,
  CASE WHEN (pga.receita + sna.receita) > 0
       THEN (((pg.receita + sn.receita) - (pga.receita + sna.receita))
              / (pga.receita + sna.receita) * 100)::NUMERIC(6,2)
       ELSE NULL END                                       AS delta_receita_pct,
  ab.pedidos_em_aberto,
  ab.saldo_a_receber,
  c.total_customers,
  c.ltv_medio,
  l.total_leads,
  l.leads_sem_resposta
FROM pagos_mes pg, sinais_mes sn, pagos_ant pga, sinais_ant sna,
     abertos ab, customers c, leads l;
