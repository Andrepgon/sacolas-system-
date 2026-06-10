# Contexto do Projeto — Sistema CRM/Automação Sacolas Personalizadas

> Como usar: cole este documento inteiro no início de uma nova conversa (Cowork, Claude Code,
> web ou mobile) para restabelecer o contexto completo. Depois disso, faça suas perguntas
> normalmente. Este documento reflete o estado do projeto ao FIM da Fase 1 (CRM manual no ar)
> e o início da Fase 2 (camada de automação).

---

## 1. Quem sou eu

Desenvolvedor sênior com especialização em IA. Tenho Claude Max e Gemini Pro. Estou
construindo um sistema próprio (não SaaS) de CRM + automação para o negócio do meu pai, que
vende sacolas de papel kraft personalizadas. Ele opera sozinho — uma pessoa cuidando de
vendas, produção e entrega. Sou brasileiro; use R$, fuso de Brasília e exemplos em PT-BR.

---

## 2. O que é a aplicação

Um CRM e plataforma de automação para o negócio de sacolas personalizadas. O dono vende
sacolas de papel kraft estampadas com a logo do cliente, para outros comércios (papelarias,
restaurantes, boutiques, confeitarias, moda, cosméticos, etc.).

Fluxo do negócio:
1. Captação: Facebook Ads (campanhas), leads chegam por WhatsApp.
2. Negociação: o dono manda campanha/tabela de preços pra centenas de pessoas no WhatsApp.
   Essa negociação acontece FORA do sistema.
3. Fechamento: a venda só "existe" quando o cliente paga o SINAL (metade do valor). É o que
   garante a venda. A partir daí o pedido entra no sistema.
4. Produção: vetorização da logo (designer externo) → fábrica (sacolas em branco) → gráfica
   (estampa).
5. Entrega: o próprio dono entrega; cobra o restante na entrega.
6. Pós-venda: hoje só uma lista de transmissão semanal (atinge poucos).

Volumes: ~40-50 leads/mês via Facebook; ~4.200 clientes importados na base; ~3 mil
seguidores no Facebook.

Dores que o sistema ataca: falta de CRM (não sabia quem comprou, ticket, LTV); leads que se
perdem; pós-venda inexistente; tempo em respostas repetitivas; pipeline de produção opaco.

---

## 3. Estado atual (o que JÁ está pronto e no ar)

A Fase 1 (CRM manual) está concluída e EM PRODUÇÃO. Tudo abaixo já funciona:

Deploy (gratuito):
- Frontend (Next.js): Vercel — https://sacolas-system.vercel.app
- Backend (FastAPI): Render (free tier, via Docker) — https://sacolas-system.onrender.com
- Banco + Auth: Supabase (free tier)
- Login: Supabase Auth, usuário único (o dono). PWA instalável no celular.

Observação Render free: o backend HIBERNA após ~15 min sem uso (primeira requisição do dia
demora ~1 min). Isso é tolerável pro uso manual, mas vira um PONTO DE ATENÇÃO pra automação
(webhooks precisam de servidor acordado) — ver seção 9.

Funcionalidades no ar:
- CRUD de clientes e pedidos, busca, filtros.
- ~4.200 clientes importados da agenda do dono (filtrados pelo sufixo "Sacolas" no nome do
  contato; números normalizados pra E.164; entraram como `lead`).
- Pipeline de pedidos: lista com filtros + Kanban arrastável (dnd-kit), com troca de status.
- Etapa do pipeline: quote (fora do quadro) → signal_paid (Sinal pago, onde o pedido nasce)
  → vector_pending → factory_pending → printing → ready_to_deliver → delivered → paid;
  cancelled fora do quadro.
- Dashboard ("Visão geral"): KPIs com receita do mês (DINHEIRO RECEBIDO, separando o que veio
  de sinais e o que veio de pedidos pagos), renda média diária, ticket médio, pedidos em
  aberto + saldo a receber, clientes ativos, leads. Gráfico de receita por mês e distribuição
  por segmento. Painel "Precisa de atenção hoje" (reativar / em risco / leads sem resposta).
- Segmentos: 24 tipos por produto (Lanchonete, Restaurante, Moda feminina/masculina/infantil,
  Cosméticos, Eletrônicos, etc.), usados na importação (inferência por palavra-chave) e no
  formulário.
- Melhores clientes (ranking por LTV), páginas de view (reativar/em risco/leads) com ação
  rápida de WhatsApp (link wa.me).
- Imagens por cliente (logo vetorizada, mockup) via Supabase Storage — galeria no perfil.
- Endereços múltiplos por cliente (texto livre), selecionáveis ao criar um pedido.

Design system: gerado no Claude Design e integrado — base neutra slate, UM acento âmbar/kraft
(#BA7517), tipografia Geist (pesos 400/500), componentes shadcn/ui, estilo limpo/corporativo,
mobile-first. Existe uma página /styleguide no app como contrato visual.

---

## 4. Stack real (como foi de fato construído)

- Backend: FastAPI (Python 3.11+), Pydantic, SDK do Supabase. Deploy no Render via Dockerfile
  (build com requirements.txt; start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
- Frontend: Next.js 14 (App Router) + TypeScript estrito + Tailwind 3 + shadcn/ui + recharts
  + react-hook-form/zod + @supabase/ssr. PWA com next-pwa. Deploy na Vercel.
- Banco: Supabase Postgres. Auth: Supabase Auth. Storage: Supabase Storage (imagens).
- LLM em produção (a partir da Fase 2): Claude API (Sonnet/Haiku). NÃO usar assinatura Max em
  automação (proibido desde abr/2026).
- Futuro (automação): WhatsApp Cloud API (Meta oficial), Replicate (mockup IA), Gemini Pro
  Vision (análise de logo), Inngest (jobs), Google Maps + OR-Tools (rotas).

Mudança vs plano original: o Railway (que era o plano pro backend) tirou o free tier, então o
backend foi pro Render. O resto da stack se manteve.

---

## 5. Schema do banco (final + adições já aplicadas)

Tabelas:
- contacts: id, phone (único, E.164), name, business_name, segment, source, status
  (lead/customer/inactive/churned), tags[], has_vector_logo, notes, first_order_at,
  last_order_at, last_contact_at, total_orders, lifetime_value (agregados por trigger),
  created_at, updated_at.
- orders: id, contact_id (FK), quantity, bag_model, bag_size, unit_price, total, paid_amount,
  status, confirmed_at (reaproveitado como data do SINAL), delivered_at, paid_at,
  delivery_address, delivery_lat, delivery_lng, delivery_address_id (FK p/ endereço salvo),
  notes, created_at, updated_at.
- interactions: id, contact_id (FK), type, direction, summary, created_at. (Tabela existe;
  log manual de contatos. UI de timeline é opcional/pendente — base pronta para quando o
  WhatsApp integrar, as mensagens caem aqui.)
- contact_media: id, contact_id (FK), url, storage_path, kind (logo_vetor/mockup/outro),
  caption, created_at. (Imagens do cliente.)
- contact_addresses: id, contact_id (FK), label, address (texto livre), lat, lng, is_default,
  created_at.

Regras importantes:
- Trigger em orders recalcula agregados de contacts. Promove lead → customer no PRIMEIRO
  pedido que não seja quote/cancelled (ou seja, o SINAL já vira o cliente). lifetime_value
  soma só delivered/paid.
- "Sinal pago" (signal_paid) SUBSTITUI o antigo "confirmed". Ao entrar nesse status,
  paid_amount = total/2 e confirmed_at = agora. Ao marcar "paid", paid_amount = total e
  paid_at = agora.

Views (migrations aplicadas no Supabase): 001 (schema base), 002 (dashboard views), 003
(dashboard summary), 004 (contact_media, contact_addresses, delivery_address_id, trigger do
sinal), 005 (receita por pedidos pagos/paid_at), 006 (receita = dinheiro recebido, separando
receita_de_sinais e receita_de_pagos, + pedidos_em_aberto e saldo_a_receber).

Princípio: schema é final; ADIÇÕES são bem-vindas, refazer não. Toda mudança de banco é
aditiva e idempotente.

---

## 6. Como o dono usa (fluxo esperado)

- Manhã (5 min): abre o app no celular, olha "Precisa de atenção hoje" (reativar/em risco/
  leads), aciona alguns clientes pelo WhatsApp manualmente.
- Durante o dia: fechou venda (recebeu o sinal) → cadastra/acha o cliente → "+ Pedido" →
  preenche → o pedido nasce em "Sinal pago".
- Move os pedidos pelo Kanban conforme a produção anda; marca "Entregue" e "Pago".
- Toda semana: olha o dashboard (quanto entrou, quanto é sinal vs pago, saldo a receber,
  quem está sumindo).

---

## 7. Como trabalhamos (fluxo do projeto — META, importante)

Este projeto é tocado com uma divisão clara de ferramentas. O novo chat deve respeitar isso:

- Cowork (esta conversa): planejamento, arquitetura, DECISÕES, escrita dos PROMPTS que vão pro
  Claude Code, escrita das MIGRATIONS SQL, e revisão. NÃO implementa o código do app aqui.
- Claude Code (CLI, com o repositório aberto): implementa o código (frontend/backend), roda
  builds e testes. Recebe os prompts prontos que o Cowork escreve.
- Supabase SQL Editor: EU (o dev) rodo as migrations manualmente. O Claude Code escreve o
  arquivo .sql, mas quem executa no banco sou eu. (Erro comum: achar que rodar o prompt no
  Claude Code já aplicou o SQL — não aplica; tem que colar no Supabase.)
- Deploy: automático a partir do GitHub (Vercel e Render fazem deploy no push). Variáveis de
  ambiente ficam nos painéis (nunca commitar .env; o .gitignore cobre).

Padrão de uma mudança: Cowork planeja e escreve o prompt + a migration → eu mando o prompt pro
Claude Code → rodo a migration no Supabase → valido (de preferência no celular, 375px).

Repositório: monorepo no GitHub (backend/, frontend/, scripts/, supabase/migrations/).

---

## 8. Fases do projeto e onde estamos

- Fase 1 — CRM manual: CONCLUÍDA e no ar (seções 3-6).
- Fase 2 — Integração WhatsApp: PRÓXIMA. Webhook recebendo/persistindo mensagens, resposta
  automática a lead novo de Facebook Ad (<30s), tela de conversas.
- Fase 3 — Mockup IA: lead manda logo → recebe mockup em <2min (Replicate Flux + IP-Adapter;
  Gemini Vision calibra o prompt).
- Fase 4 — Pipeline visual: já ANTECIPADA na Fase 1 (Kanban existe). Falta o Realtime
  multi-dispositivo, se quiser.
- Fase 5 — Régua de pós-venda + segmentação: templates Meta (D+3/D+15/D+60/D+120), jobs
  Inngest, campanhas pelas views SQL.
- Fase 6 — Rotas + bot operador: Google Maps + OR-Tools; bot no WhatsApp do operador.
- Fase 7 — Crescimento: UGC, indicação, A/B testing, preditiva.

ESTOU INICIANDO A FASE 2 (automação). O objetivo desta nova etapa é construir a camada de
automação em cima da base manual que já está no ar.

---

## 9. Próxima etapa: automação (Fase 2) — pré-requisitos e decisões em aberto

Decisão crítica (trava tudo): o NÚMERO de WhatsApp. Um número na Cloud API não pode estar no
WhatsApp comum. Opções: (a) migrar o número atual do dono (clientes já conhecem, mas perde o
app/listas no número) ou (b) número novo (mantém o atual, mas migra clientes aos poucos).

Conta Meta: criar Meta Business + VERIFICAÇÃO de negócio (lenta, pede CNPJ), app no Meta for
Developers, número verificado, nome de exibição aprovado, System User + token permanente,
permissões whatsapp_business_messaging/management.

Atribuição: o `referral.source_id` (qual anúncio gerou o lead) só vem se os anúncios forem
Click-to-WhatsApp (CTWA) apontando pro número da API.

Infra: webhook público HTTPS (o backend no Render já é público) + validação de assinatura
(X-Hub-Signature-256). ATENÇÃO: o Render free hiberna; pra webhooks confiáveis pode ser
preciso um keep-alive (ping no /health a cada ~10 min via cron-job.org grátis) ou subir pra
um tier pago. Avaliar no começo da Fase 2.

Schema: a tabela `interactions` já existe; o WhatsApp pode precisar de uma tabela
`messages`/`conversations` dedicada (wa_message_id, timestamp, status, mídia, direção) — tudo
aditivo. Mídia (logo PNG) baixa pela API de mídia e vai pro Supabase Storage.

Custo WhatsApp (2026, atualizado): a Meta cobra POR MENSAGEM desde jul/2025. Conversas
iniciadas pelo CLIENTE (service) são gratuitas na janela de 24h (e há 1.000 service grátis/
mês). O fluxo principal da Fase 2 (responder lead que chamou) cai em service → custo ~zero. O
que é PAGO: mensagens iniciadas por você fora da janela (templates de marketing/utility) — ou
seja, a régua da Fase 5, não a Fase 2.

LGPD: opt-in pra mensagens iniciadas por você; política publicada; endpoint de "esquecer
cliente".

---

## 10. Princípios que sigo (e que o Claude deve respeitar)

1. Schema é final — adições sim, refazer não. Se eu propuser mudar schema, questione se
   precisa mesmo.
2. Cada fase entrega valor sozinha; não construir Y que depende de Z não pronto.
3. Mobile-first — o dono usa muito mais o celular. Testar a 375px.
4. Dados estruturados desde o dia 1.
5. LGPD respeitada.
6. Observabilidade desde cedo (erros, logs).
7. Toda mudança de banco é aditiva e idempotente, num arquivo .sql que EU rodo no Supabase.

---

## 11. Como quero que o Claude se comporte

Faça:
- Assuma a arquitetura como dada — não me explique de novo o que é FastAPI/Supabase/Cloud API.
- Quando eu pedir "como faço X", proponha 2-3 abordagens curtas e me peça pra escolher antes
  de aprofundar.
- Para mudanças no app, ESCREVA O PROMPT pronto pro Claude Code (não tente implementar o
  código aqui no Cowork). Para banco, ESCREVA A MIGRATION .sql pra eu rodar no Supabase.
- Use Python tipado e TypeScript estrito nos exemplos.
- Pesquise/verifique fatos do presente (preços, APIs) antes de afirmar — não confie em memória
  pra coisas que mudam (ex: preços do WhatsApp, free tiers).
- Seja direto e técnico, sem introduções longas. Não use emoji em código/respostas técnicas.
- Use minha realidade brasileira (R$, fuso de Brasília, PT-BR).

Não faça:
- Não sugira SaaS prontos (ManyChat, RD Station, Respond.io, Z-API) — sistema próprio já
  decidido.
- Não sugira assinatura Max pra rodar produção.
- Não invente APIs/bibliotecas — se não souber, diga "preciso verificar".
- Não tente rodar o SQL pelo Claude Code achando que aplicou no banco — sempre me entregue o
  .sql pra eu colar no Supabase.

---

## 12. Arquivos de referência do projeto (na minha pasta)

Documentos já produzidos (em C:\Users\andre.goncalves\Sacolas):
- ROADMAP_APP_MANUAL.md — plano da app 100% manual (Fase 1).
- DESIGN_SYSTEM.md / REDESIGN_DASHBOARD.md — direção visual.
- LEVA_FINAL_FEATURES.md — imagens, endereços, sinal, bug de receita.
- PROMPTS_M2_PEDIDOS.md — tela de controle de pedidos.
- DEPLOY_GRATIS.md — deploy Vercel + Render + Supabase e importação vCard.
- scripts/import_vcard.py — importador (filtra clientes "Sacolas", normaliza, infere segmento).
- supabase/migrations/ — 001 a 006.

Se eu mencionar qualquer um, sei do que estou falando; posso colar o conteúdo se precisar.

---

## 13. Status atual (preencha/atualize antes de colar numa nova conversa)

- Última coisa feita: [ex: rodei a migration 006, dashboard mostra receita por sinal/pago]
- Próxima coisa: [ex: começar a Fase 2 — decidir o número do WhatsApp]
- Bloqueios: [ex: aguardando verificação da Meta Business]
