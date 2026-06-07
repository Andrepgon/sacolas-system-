# Roadmap — Aplicação 100% manual (sem WhatsApp API)

Objetivo: um CRM completo e operável inteiramente à mão — o dono controla clientes,
pedidos e follow-up sem nenhuma automação ou integração externa. Tudo aqui usa só o
schema atual (com adições aditivas) + Supabase + o frontend já existente.

Princípio: nada que dependa de WhatsApp Cloud API, Replicate/IA, ou Inngest entra aqui.
Essas peças ficam para depois, encaixando em cima desta base.

---

## M1 — Fase 1 polida (fundação)
O que: terminar o redesign (integração do design system, as 3 levas) e corrigir a
lógica lead→cliente no trigger (promover no primeiro pedido `confirmed`, não só `delivered`).
Entrega: o CRM manual atual, completo e com cara profissional. Cadastro/edição de clientes
e pedidos, listas, views, dashboard.
Depende de: nada externo. É só código.

## M2 — Controle de pedidos (Fase 4, versão manual) — a maior lacuna hoje
O que:
- Tela `/orders` (lista): todos os pedidos com filtro por status, busca por cliente,
  e contagem por etapa no topo. Resolve "onde está cada pedido" imediatamente.
- Depois, Kanban arrastável: colunas por etapa (Orçamento → Confirmado → Aguardando vetor →
  Na fábrica → Em impressão → Pronto p/ entregar → Entregue → Pago), arrastar o cartão muda
  o status (PATCH /orders, que já preenche os timestamps automaticamente).
- (Opcional, depois) Supabase Realtime pra sincronizar entre celular e desktop.
Entrega: o dono vê e move o pipeline inteiro com a mão. Mata a dor "pipeline opaco".
Depende de: nada externo. O endpoint PATCH já existe.

## M3 — Histórico de interações manual
O que: usar a tabela `interactions` que JÁ existe no schema. Na tela de detalhe do cliente,
um botão "Registrar contato" (tipo: ligação / visita / WhatsApp manual / outro; direção;
resumo) e uma timeline mostrando o histórico. Cada registro atualiza `last_contact_at`.
Entrega: memória de cada toque com o cliente, mesmo sem integração de WhatsApp. É a versão
manual do que a Fase 2 faria automático.
Depende de: nada — a tabela já está pronta. Só falta a UI e o endpoint de interactions.

## M4 — Fluxo de reativação manual (follow-up)
O que: transformar as views (reativar / em risco / leads sem resposta) em uma lista de
trabalho. Em cada cliente dessas listas: botão "Marcar como contatado" (que cria uma
interaction) e um campo de próxima ação / lembrete (`next_action_at` — uma coluna nova,
aditiva, em contacts, OU uma tabela `tasks` simples). Uma visão "para hoje" no dashboard.
Entrega: o dono trabalha a base ativamente — sabe quem chamar, marca que chamou, agenda o
próximo toque. Tudo manual, mas organizado.
Depende de: 1 adição aditiva no schema (coluna ou tabela de tarefas).

## M5 — Anexos manuais: logo e mockup (opcional)
O que: usar Supabase Storage pra anexar a logo (PNG) e o mockup ao cliente ou ao pedido.
O campo `has_vector_logo` já existe; aqui você guarda o arquivo de fato e marca quando tem
vetor. É a versão manual da Fase 3 (você sobe o mockup que mandou fazer, sem geração por IA).
Entrega: tudo do cliente num lugar só — contato, pedidos e artes.
Depende de: ativar Supabase Storage + 1 tabela de mídia (aditiva).

---

## O que fica explicitamente para depois (precisa de externo/automação)
- Fase 2 — webhook WhatsApp, resposta automática a lead, tela de conversas (Cloud API)
- Fase 3 — geração de mockup por IA (Replicate + Gemini)
- Fase 5 — régua de pós-venda automática com templates (WhatsApp + Inngest)
- Fase 6 — otimização de rotas + bot operador
- Fase 7 — UGC, indicação automatizada, A/B, preditiva

Toda esta base manual foi pensada pra que essas fases encaixem em cima sem refazer nada:
quando o WhatsApp entrar, as mensagens caem na MESMA tabela de interactions; quando a régua
entrar, ela lê as MESMAS views; quando o mockup IA entrar, usa o MESMO storage.

---

## Ordem sugerida
M1 (terminar o que já está em andamento) → M2 (a lacuna que mais te incomoda) →
M3 (histórico) → M4 (reativação ativa) → M5 (anexos, se quiser).
Ao fim do M4 você já tem um sistema que um operador usa o dia inteiro sem depender de nada
automático.
