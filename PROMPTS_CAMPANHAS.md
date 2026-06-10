# Campanhas — disparo assistido 1-clique (prompts Claude Code)

Feature do momento PRE-SINAL: o dono compoe uma campanha (texto + imagem), seleciona os
clientes e o app monta uma FILA pra ele disparar do proprio WhatsApp, um contato por vez,
com 1 toque por contato. Sem WhatsApp Cloud API, sem SaaS, sem custo. O app e o
selecionador + fila + registro de envio — quem manda a mensagem e o WhatsApp do celular dele.

Decisao de transporte (travada): deep link `wa.me/<E164>?text=<urlencoded>`. Esse link so
carrega TEXTO, entao a imagem da campanha entra como LINK hospedado no Supabase Storage,
dentro do texto. Alvo preciso por contato + rastreio de quem recebeu.

Pre-requisito de banco: rodar a migration `supabase/migrations/007_campanhas.sql` no Supabase
ANTES de usar os endpoints (cria campaigns, campaign_sends e a coluna opt_out em contacts).
Criar tambem, uma vez, um bucket PUBLICO `campaigns` no Storage.

Placeholders do template (resolvidos no backend, por contato):
`{{primeiro_nome}}` · `{{nome}}` · `{{empresa}}` (business_name; cai pra name se vazio) ·
`{{imagem}}` (vira a image_url; se houver imagem e o placeholder nao estiver no texto,
anexa a URL ao final, em linha propria).

Rotulos de status da campanha (use em toda a UI):
draft=Rascunho · ready=Pronta · sending=Em disparo · done=Concluida · archived=Arquivada

---

## Prompt 7A — Backend: campanhas (model + router + render + upload)

> No backend FastAPI, crie a feature de campanhas de forma aditiva (as tabelas ja existem via
> migration 007 — NAO crie/altere schema; se achar que precisa, me pergunte antes).
>
> Models (Pydantic, tipados) em `app/models/campaign.py`:
> - `Campaign`: id, title, message_template, image_url?, image_storage_path?, status,
>   total_recipients, sent_count, skipped_count, created_at, updated_at.
> - `CampaignCreate` / `CampaignUpdate`: title, message_template, image_url?, status?.
> - `CampaignSend`: id, campaign_id, contact_id, phone, rendered_message, status, sent_at?,
>   position, e um `contact` aninhado opcional (name, business_name) pra UI.
>
> Router `app/routers/campaigns.py` (registre no main.py):
> - `POST   /campaigns`               cria rascunho (status='draft').
> - `GET    /campaigns`               lista (mais recentes primeiro), com os contadores.
> - `GET    /campaigns/{id}`          detalhe.
> - `PATCH  /campaigns/{id}`          edita titulo/texto/imagem/status.
> - `POST   /campaigns/{id}/image`    upload da imagem pro bucket publico `campaigns` no
>                                     Supabase Storage (reaproveite o padrao de `media.py`);
>                                     grava image_url + image_storage_path na campanha.
> - `POST   /campaigns/{id}/recipients`  body: `{ filter?: {...}, contact_ids?: string[] }`.
>     Resolve os destinatarios, EXCLUI quem tem `opt_out = true`, monta o texto renderizado por
>     contato (resolve os placeholders + imagem), e insere em `campaign_sends` (status='pending',
>     `position` sequencial, `phone` e `rendered_message` como snapshot). Idempotente: faca
>     UPSERT por (campaign_id, contact_id); nao duplique. Atualize `campaigns.total_recipients`.
>     Retorne `{ total_recipients, excluded_opt_out }`.
>     - `filter` reaproveita os filtros que ja existem em contacts: `segment`, `status`
>       (lead/customer/inactive/churned), `tags`, busca por nome, e um modo `top_ltv` (N
>       melhores por lifetime_value). Selecao manual = `contact_ids`.
> - `GET    /campaigns/{id}/sends?status=pending`  fila ordenada por `position` (paginavel),
>     com o `contact` aninhado e o `rendered_message`.
> - `PATCH  /campaigns/{id}/sends/{send_id}`  body `{ status: 'sent' | 'skipped' }`.
>     Em 'sent': grava `sent_at=now()`, incrementa `campaigns.sent_count`, atualiza
>     `contacts.last_campaign_at = now()` e `last_contact_at = now()`, e cria uma linha em
>     `interactions` (type='campanha', direction='outbound', summary=titulo da campanha).
>     Em 'skipped': incrementa `skipped_count`. Quando nao restar nenhum 'pending', marque a
>     campanha como 'done'.
> - `PATCH  /contacts/{id}` (ja existe): garanta que aceita `opt_out` (bool). Ao virar true,
>     setar `opt_out_at=now()`. Isso e o "nao perturbe" da LGPD.
>
> Funcao de render isolada e testavel (`app/services/campaign_render.py`):
> `render_message(template: str, contact: Contact, image_url: str | None) -> str`.
> Resolve os 4 placeholders; `{{primeiro_nome}}` = primeira palavra de name; `{{empresa}}` =
> business_name ou name. Trata imagem conforme a regra acima.
>
> Use o select embutido do Supabase pra trazer o contato aninhado (sem N+1):
> `select("*, contacts(name,business_name)")`. Rode `ruff check` e os testes. Adicione um teste
> unitario de `render_message` cobrindo: empresa vazia, nome composto, com e sem {{imagem}}.
> Me diga explicitamente que a migration 007 precisa estar rodada no Supabase (voce nao aplica SQL).

---

## Prompt 7B — Frontend: lista de campanhas + compor (/campanhas)

> Crie a area de campanhas no App Router, usando os tokens/componentes do design system
> (slate + acento ambar #BA7517, Geist, shadcn). Adicione "Campanhas" no nav.
>
> `app/campanhas/page.tsx` (rota /campanhas) — lista:
> - Cabecalho "Campanhas" + botao primario "+ Nova campanha" (vai pra /campanhas/nova).
> - Cards de campanha: titulo, badge de status (rotulos pt-BR acima), destinatarios, enviados/
>   pulados, data. Clicar abre /campanhas/[id]. Estados de carregando (skeleton) e vazio.
>
> `app/campanhas/nova/page.tsx` e `app/campanhas/[id]/page.tsx` — compor/editar (react-hook-form
> + zod):
> - Campo Titulo (interno, so pra organizar).
> - Textarea da Mensagem, com uma legenda mostrando os placeholders disponiveis
>   ({{primeiro_nome}}, {{nome}}, {{empresa}}, {{imagem}}) e botoes que inserem o placeholder no
>   cursor.
> - Upload da imagem (POST /campaigns/{id}/image) com preview da miniatura.
> - PREVIEW ao vivo "como o cliente vai ver": renderiza o texto trocando os placeholders por um
>   contato de exemplo e mostra o link/miniatura da imagem ao final. Deixe claro na UI que a
>   imagem vai como LINK no texto (nao anexada).
> - Salvar (cria/atualiza rascunho). Botao "Selecionar destinatarios ->" leva pra etapa do 7C.
> - Mobile-first, testar a 375px. TypeScript estrito, dados via lib/api.ts.

---

## Prompt 7C — Frontend: selecao de destinatarios

> Na campanha aberta (/campanhas/[id]), uma etapa "Destinatarios" que reaproveita os filtros de
> contatos que ja existem no app:
> - Filtros: Segmento (os 24 tipos), Status (lead/cliente/inativo/churned), Tags, busca por
>   nome, e um atalho "Melhores clientes (top N por LTV)".
> - Selecao manual: lista com checkboxes (selecionar todos do filtro atual / limpar).
> - Mostrar contagem ao vivo: "X destinatarios selecionados" e, abaixo, "Y excluidos por
>   opt-out (nao perturbe)" — sempre excluir opt_out automaticamente.
> - AVISO nao-bloqueante (numero pessoal, nao e API): se a selecao passar de ~200 contatos,
>   mostrar um alerta ambar curto: "Disparar muitas mensagens iguais de um numero pessoal de
>   uma vez aumenta o risco de bloqueio do WhatsApp. Considere fatiar em lotes e espacar os
>   envios." Nao impede o disparo, so orienta.
> - Botao "Gerar fila" -> POST /campaigns/{id}/recipients (com filter ou contact_ids). Ao
>   concluir, leva pra tela de disparo (7D) e marca a campanha como 'ready'.
> - TypeScript estrito, mobile-first 375px.

---

## Prompt 7D — Frontend: tela de disparo assistido (a fila)

> A tela que mata a dor do "de 5 em 5". Rota `app/campanhas/[id]/disparar/page.tsx`.
> Consome GET /campaigns/{id}/sends?status=pending (ordenado por position).
>
> - Barra de progresso no topo: "Enviados X de N" (sent + skipped sobre total) + barra ambar.
> - Modo foco: mostra UM contato por vez (o proximo 'pending'):
>     - Nome + empresa + telefone.
>     - A mensagem renderizada exata (rendered_message), num bloco read-only.
>     - Botao primario grande "Abrir no WhatsApp": abre
>       `https://wa.me/<phone_digits>?text=<encodeURIComponent(rendered_message)>` em nova aba
>       (phone_digits = E.164 sem '+' nem outros caracteres).
>     - Depois de abrir, aparecem dois botoes: "Enviado" (PATCH .../sends/{id} status='sent' e
>       AVANCA pro proximo) e "Pular" (status='skipped' e avanca).
> - Persistencia/retomada: como abrir o wa.me TIRA o foco do PWA, ao voltar pro app a tela
>   retoma exatamente no proximo 'pending'. Nada se perde se ele fechar e voltar depois.
> - Ao acabar a fila: estado de conclusao ("Campanha concluida — X enviados, Y pulados") com
>   atalho de volta pra /campanhas. A campanha vira 'done' (o backend ja faz isso).
> - Tambem ofereca uma visao lista (todos os pending com botao "Abrir" em cada linha) como
>   alternativa ao modo foco — toggle "Foco / Lista".
> - Mobile-first de verdade: o uso e 100% no celular, botoes grandes, alvo de toque confortavel.
>   Testar a 375px. TypeScript estrito.

---

## Prompt 7E — Opt-out no perfil do contato (LGPD)

> No perfil do contato (app/contacts/[id]), adicione um toggle "Nao perturbar (opt-out de
> campanhas)" que faz PATCH /contacts/{id} com `opt_out`. Quando ligado, mostrar um aviso
> discreto de que esse contato nao entra em nenhuma fila de campanha. Estilo do design system.

---

## Validacao
Ao fim: (1) criar uma campanha com texto usando os 4 placeholders + uma imagem; conferir no
preview que renderiza certo. (2) Gerar fila pra um segmento pequeno (3-4 contatos de teste, com
1 deles marcado opt_out — confirmar que ele NAO entra na fila). (3) No celular (375px), abrir a
tela de disparo, tocar "Abrir no WhatsApp" (confirmar que abre a conversa certa com o texto e o
link da imagem preenchidos), marcar "Enviado" e ver a fila avancar e o progresso subir. (4)
Recarregar a pagina no meio da fila e confirmar que retoma do proximo pendente. (5) Conferir que
cada "Enviado" gerou uma linha em interactions e atualizou last_campaign_at do contato.
Rodar `npm run build`. Lembrar: a migration 007 sou EU que rodo no Supabase.
