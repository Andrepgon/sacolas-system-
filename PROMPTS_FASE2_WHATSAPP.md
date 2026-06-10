# Fase 2 — WhatsApp Cloud API via Coexistence (prompts Claude Code)

Objetivo da fase: integrar o numero do dono a Cloud API em modo **Coexistence** (mesmo numero
no app do WhatsApp Business + na API), receber e PERSISTIR as mensagens no Supabase, e mostrar
uma tela de conversas. Isso gera o substrato que os agentes (classificador, triagem) vao ler
depois. O webhook NAO le o passado por conta propria — quem traz ~6 meses de historico 1:1 e o
proprio onboarding do Coexistence, via o campo de webhook `history`.

Pre-requisitos antes destes prompts:
- Rodar `supabase/migrations/008_mensagens.sql` no Supabase (EU rodo, voce nao aplica SQL).
- Criar uma vez um bucket PRIVADO `whatsapp` no Storage.
- Setup Meta concluido (ver CHECKLIST_META_COEXISTENCE.md): app, numero no Coexistence, token
  permanente, e a assinatura dos campos de webhook.

Campos de webhook que vamos tratar (confirmados na doc da Meta):
- `messages`            -> mensagens que CHEGAM (entrada) + objetos de `statuses` (entrega/leitura).
- `smb_message_echoes`  -> mensagens que o dono MANDA pelo app do WhatsApp Business apos onboarding ("Echo").
- `history`             -> sync unico de ate ~6 meses de conversas 1:1, minutos apos o onboarding.
- `smb_app_state_sync`  -> contatos atuais e novos do app.

Variaveis de ambiente (painel do Render, nunca commitar):
`WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`.

---

## Prompt F2-A — Backend: endpoint do webhook (verify + assinatura)

> No backend FastAPI, crie o router `app/routers/whatsapp.py` (registre no main.py) com o
> webhook da Cloud API, de forma aditiva. Use Python tipado.
>
> 1. `GET /webhooks/whatsapp` — verificacao do webhook da Meta. Le os query params
>    `hub.mode`, `hub.verify_token`, `hub.challenge`. Se `hub.mode == "subscribe"` e o
>    `hub.verify_token` bater com `WHATSAPP_VERIFY_TOKEN`, retorne o `hub.challenge` como
>    texto puro (status 200). Senao, 403.
> 2. `POST /webhooks/whatsapp` — recebe os eventos. ANTES de processar, valide a assinatura:
>    header `X-Hub-Signature-256` = "sha256=" + HMAC-SHA256(corpo_bruto, WHATSAPP_APP_SECRET).
>    Compare em tempo constante (hmac.compare_digest). Assinatura invalida -> 403. IMPORTANTE:
>    use o CORPO BRUTO da requisicao (bytes), nao o JSON re-serializado.
> 3. Responda 200 o mais rapido possivel (a Meta re-tenta se demorar). Processe o payload e
>    persista; se o processamento puder falhar, capture a excecao, logue, e ainda assim
>    retorne 200 (a Meta nao deve ficar re-enviando por erro nosso de parsing) — mas guarde o
>    payload bruto pra reprocessar (observabilidade).
> 4. Observabilidade: logue cada evento recebido (tipo de campo, phone, qtd de mensagens) e,
>    em erro de parsing, persista o `raw` mesmo sem conseguir montar a mensagem.
>
> Rode `ruff check`. Me lembre que a migration 008 precisa estar rodada no Supabase.

---

## Prompt F2-B — Backend: ingestao das mensagens (messages, echoes, history, status)

> Implemente o processamento do payload do webhook, gravando em `messages` (tabela ja criada
> pela migration 008). Crie um service `app/services/whatsapp_ingest.py` testavel.
>
> Regras gerais:
> - Resolver o contato por telefone (E.164) com find-or-create: se nao existir, crie um contact
>   com `source='whatsapp'`, `status='lead'`, name = nome do perfil do WhatsApp se vier, senao
>   o proprio numero. Reaproveite a normalizacao E.164 que ja existe no projeto.
> - Inserir em `messages` com UPSERT por `wa_message_id` (ON CONFLICT DO NOTHING) — idempotente,
>   nunca duplica. Sempre gravar o `raw` do objeto da mensagem.
> - `wa_timestamp` vem do campo `timestamp` da Meta (epoch em segundos -> timestamptz).
>
> Por campo do webhook (entry[].changes[].field):
> - `messages`:
>     - objetos em `value.messages[]` -> direction='inbound', source='api'. Tratar tipos:
>       text (body), image/audio/video/document/sticker (tem `id` de midia -> baixar, ver F2-C;
>       guardar caption em body quando houver), location, etc. Tipos nao mapeados -> msg_type='other'.
>     - objetos em `value.statuses[]` -> atualizar o `status` da mensagem outbound correspondente
>       (por `id` = wa_message_id): sent/delivered/read/failed. Nao cria linha nova.
> - `smb_message_echoes` (value.message_echoes[]) -> direction='outbound', source='echo'
>   (mensagens que o dono mandou pelo app). Mesma logica de tipos/midia.
> - `history` (value.history[]) -> mensagens do sync de 6 meses. Para cada mensagem do thread,
>   direction conforme o campo `from`/metadata, source='history', wa_timestamp = o horario
>   original. UPSERT garante que nao duplica com o que ja chegou ao vivo.
> - `smb_app_state_sync` -> atualizar/criar contatos (nome, telefone). Aditivo: nunca apague
>   contato; so faz find-or-create e atualiza nome se vier melhor.
>
> O trigger da migration 008 cuida de last_message_at/preview/unread automaticamente no INSERT.
>
> Testes: um teste de ingestao por campo (messages texto, messages com imagem, echo, status
> update, e um lote de history) usando payloads de exemplo fixos. Rode `ruff check` e os testes.

---

## Prompt F2-C — Backend: download de midia pro Storage

> Implemente o download de midia da Cloud API pro bucket privado `whatsapp` do Supabase Storage,
> reaproveitando o padrao de upload de `media.py`.
>
> - Fluxo da Meta: GET `https://graph.facebook.com/v<versao>/<media_id>` (com Bearer
>   WHATSAPP_ACCESS_TOKEN) retorna uma `url` temporaria -> GET nessa url (com o mesmo Bearer)
>   retorna os bytes.
> - Salvar em `whatsapp/<contact_id>/<wa_message_id>.<ext>`, gravar `media_storage_path` e
>   `media_url` (signed URL ou path, voce escolhe o mais simples pra exibir na tela) na mensagem.
> - Fazer isso de forma resiliente: se o download falhar, a mensagem ainda e gravada (sem midia)
>   e o erro e logado. Confirme a versao atual da Graph API que voce vai usar (nao chute) e me diga qual foi.

---

## Prompt F2-D — Backend: endpoints de conversas

> Endpoints aditivos pra tela de conversas:
> - `GET /conversations` — lista de contatos que tem mensagem, ordenada por last_message_at
>   desc, retornando name, business_name, last_message_preview, last_message_at, unread_count.
>   Paginavel. (Le direto de contacts, que o trigger ja mantem.)
> - `GET /conversations/{contact_id}/messages` — thread de um contato, ordenada por
>   wa_timestamp asc, paginavel. Retorna direction, msg_type, body, media_url, status, wa_timestamp.
> - `PATCH /conversations/{contact_id}/read` — zera unread_count do contato.
>
> Rode `ruff check`.

---

## Prompt F2-E — Frontend: tela de conversas (/conversas)

> Crie a area de conversas no App Router, com os tokens/componentes do design system. Adicione
> "Conversas" no nav (com badge de total de unread, se simples).
>
> - `app/conversas/page.tsx` — lista estilo inbox: por contato, avatar/inicial, nome + negocio,
>   preview da ultima mensagem, horario relativo, e badge de nao-lidas. Ordenada por mais recente.
>   Busca por nome. Clicar abre o thread.
> - `app/conversas/[contactId]/page.tsx` — thread: bolhas (entrada a esquerda, saida a direita;
>   echo do app tambem como saida), texto e imagens (renderiza media_url), horario. Ao abrir,
>   chama PATCH .../read pra zerar unread. Atalho pro perfil do contato.
> - Escopo desta fase: LEITURA (sem enviar pela API ainda — responder por template/sessao fica
>   pra depois). Deixe o layout pronto pra um campo de envio futuro, mas nao implemente o envio agora.
> - Mobile-first de verdade, testar a 375px. TypeScript estrito, dados via lib/api.ts.
>
> Rode `npm run build`.

---

## Prompt F2-F — Ops: keep-alive do Render (sem codigo de app)

> O backend no Render free hiberna apos ~15 min. Pra o webhook nao perder eventos (a Meta
> re-tenta, mas com limite), garanta um endpoint `GET /health` (se ja nao existir, crie, retorna
> 200 e um {"status":"ok"}). NAO configure cron aqui — eu vou criar um ping externo a cada ~10
> min no cron-job.org apontando pro /health. So me confirme a URL do health.

---

## Validacao da Fase 2
1. Apontar o webhook no painel da Meta pro Render e passar na verificacao (GET challenge).
2. Mandar uma mensagem de um numero de teste pro WhatsApp -> confirmar que cai em `messages`
   (direction inbound), cria/acha o contato, e aparece na /conversas com preview e unread.
3. Responder pelo app do WhatsApp Business -> confirmar que chega como `echo` (outbound).
4. Conferir que apos o onboarding o `history` populou conversas antigas (ate ~6 meses) com os
   wa_timestamp corretos e SEM marcar tudo como nao-lido.
5. Mandar uma imagem -> confirmar download pro bucket e exibicao no thread.
6. Conferir last_message_at preenchido nos contatos (o campo que faltava).
Lembrar: as migrations (008) sou EU que rodo no Supabase; o setup da Meta e manual (checklist).
