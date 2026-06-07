-- =====================================================
-- seed_test_data.sql
-- Dados de teste pro protótipo CRM Sacolas.
-- Cole no SQL Editor do Supabase e execute.
-- Tudo vem com a tag 'teste' — pra apagar depois, role até o fim.
-- =====================================================

-- ---------- CONTATOS ----------
-- 6 que vão virar clientes (via pedidos abaixo) + 4 leads
INSERT INTO contacts (phone, name, business_name, segment, source, status, tags, created_at, last_contact_at) VALUES
  ('+5521988880001', 'Ana Souza',      'Papelaria Central',     'papelaria',   'manual',       'lead', '{teste}', NOW() - INTERVAL '120 days', NOW() - INTERVAL '10 days'),
  ('+5521988880002', 'Carlos Pereira', 'Cantina do Zé',         'restaurante', 'facebook_ad',  'lead', '{teste}', NOW() - INTERVAL '100 days', NOW() - INTERVAL '90 days'),
  ('+5521988880003', 'Bella Lima',     'Boutique Bella',        'boutique',    'indicacao',    'lead', '{teste}', NOW() - INTERVAL '210 days', NOW() - INTERVAL '200 days'),
  ('+5521988880004', 'Marcos Dias',    'Confeitaria Doce Mel',  'confeitaria', 'organic',      'lead', '{teste}', NOW() - INTERVAL '80 days',  NOW() - INTERVAL '75 days'),
  ('+5521988880005', 'Pedro Alves',    'Papelaria do Saber',    'papelaria',   'manual',       'lead', '{teste}', NOW() - INTERVAL '30 days',  NOW() - INTERVAL '5 days'),
  ('+5521988880006', 'Marina Castro',  'Floricultura Jardim',   'outro',       'facebook_ad',  'lead', '{teste}', NOW() - INTERVAL '140 days', NOW() - INTERVAL '130 days'),
  ('+5521988880007', 'João Mendes',    'Padaria Pão Quente',    'restaurante', 'facebook_ad',  'lead', '{teste}', NOW() - INTERVAL '10 days',  NOW() - INTERVAL '10 days'),
  ('+5521988880008', 'Lúcia Ramos',    'Café da Esquina',       'restaurante', 'organic',      'lead', '{teste}', NOW() - INTERVAL '7 days',   NOW() - INTERVAL '7 days'),
  ('+5521988880009', 'Rafael Gomes',   'Burger House',          'restaurante', 'facebook_ad',  'lead', '{teste}', NOW() - INTERVAL '1 days',   NOW() - INTERVAL '1 days'),
  ('+5521988880010', 'Sofia Martins',  'Ateliê de Doces',       'confeitaria', 'indicacao',    'lead', '{teste}', NOW(),                       NOW());

-- ---------- PEDIDOS ----------
-- O trigger recalcula status/LTV/last_order_at do contato a cada insert.
-- delivered_at no passado é o que alimenta as views de reativação/risco.

-- Ana / Papelaria Central: VIP saudável (3 pedidos, LTV alto, compra recente)
INSERT INTO orders (contact_id, quantity, bag_model, total, paid_amount, status, delivered_at, paid_at, created_at)
SELECT id, 500, 'Kraft P', 700, 700, 'paid',      NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days', NOW() - INTERVAL '102 days' FROM contacts WHERE phone='+5521988880001';
INSERT INTO orders (contact_id, quantity, bag_model, total, paid_amount, status, delivered_at, paid_at, created_at)
SELECT id, 600, 'Kraft M', 800, 800, 'paid',      NOW() - INTERVAL '50 days',  NOW() - INTERVAL '50 days',  NOW() - INTERVAL '52 days'  FROM contacts WHERE phone='+5521988880001';
INSERT INTO orders (contact_id, quantity, bag_model, total, paid_amount, status, delivered_at, paid_at, created_at)
SELECT id, 700, 'Kraft G', 900, 900, 'delivered', NOW() - INTERVAL '10 days',  NULL,                        NOW() - INTERVAL '12 days'  FROM contacts WHERE phone='+5521988880001';

-- Carlos / Cantina do Zé: VIP por LTV + em risco (última compra 90 dias)
INSERT INTO orders (contact_id, quantity, bag_model, total, paid_amount, status, delivered_at, paid_at, created_at)
SELECT id, 1000, 'Kraft M', 1200, 1200, 'paid', NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days', NOW() - INTERVAL '92 days' FROM contacts WHERE phone='+5521988880002';

-- Bella / Boutique Bella: para reativar (200 dias, fora da janela de risco)
INSERT INTO orders (contact_id, quantity, bag_model, total, paid_amount, status, delivered_at, paid_at, created_at)
SELECT id, 400, 'Luxo P', 600, 600, 'paid', NOW() - INTERVAL '200 days', NOW() - INTERVAL '200 days', NOW() - INTERVAL '202 days' FROM contacts WHERE phone='+5521988880003';

-- Marcos / Confeitaria Doce Mel: em risco (75 dias)
INSERT INTO orders (contact_id, quantity, bag_model, total, paid_amount, status, delivered_at, paid_at, created_at)
SELECT id, 300, 'Kraft P', 450, 450, 'delivered', NOW() - INTERVAL '75 days', NULL, NOW() - INTERVAL '77 days' FROM contacts WHERE phone='+5521988880004';

-- Pedro / Papelaria do Saber: cliente ativo recente (5 dias) + 1 pedido em produção
INSERT INTO orders (contact_id, quantity, bag_model, total, paid_amount, status, delivered_at, paid_at, created_at)
SELECT id, 250, 'Kraft P', 300, 300, 'delivered', NOW() - INTERVAL '5 days', NULL, NOW() - INTERVAL '7 days' FROM contacts WHERE phone='+5521988880005';
INSERT INTO orders (contact_id, quantity, bag_model, total, paid_amount, status, created_at)
SELECT id, 500, 'Kraft M', 650, 0, 'printing', NOW() - INTERVAL '1 days' FROM contacts WHERE phone='+5521988880005';

-- Marina / Floricultura Jardim: para reativar (130 dias)
INSERT INTO orders (contact_id, quantity, bag_model, total, paid_amount, status, delivered_at, paid_at, created_at)
SELECT id, 350, 'Luxo M', 900, 900, 'paid', NOW() - INTERVAL '130 days', NOW() - INTERVAL '130 days', NOW() - INTERVAL '132 days' FROM contacts WHERE phone='+5521988880006';

-- João: lead com 1 orçamento em aberto (não vira customer — status 'quote' não conta)
INSERT INTO orders (contact_id, quantity, bag_model, total, paid_amount, status, created_at)
SELECT id, 200, 'Kraft P', 280, 0, 'quote', NOW() - INTERVAL '2 days' FROM contacts WHERE phone='+5521988880007';

-- Leads 8, 9, 10 ficam sem pedido de propósito.

-- =====================================================
-- Resultado esperado nas views:
--   VIP                 -> Ana (3 pedidos, LTV 2400) e Carlos (LTV 1200)
--   em risco (60-120d)  -> Carlos (90d), Marcos (75d)
--   para reativar (>60d)-> Carlos, Marcos, Bella (200d), Marina (130d)
--   leads sem resposta  -> João (10d), Lúcia (7d)
-- =====================================================

-- ---------- PARA APAGAR TODOS OS DADOS DE TESTE DEPOIS ----------
-- DELETE FROM contacts WHERE 'teste' = ANY(tags);  -- cascade remove os pedidos junto
