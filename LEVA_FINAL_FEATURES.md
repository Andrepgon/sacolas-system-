# Leva final de features (pré-automação)

Quatro itens do feedback do dono. Schema só recebe ADIÇÕES (migration
004_features_perfil_endereco_sinal.sql) — nada existente é refeito.

Ordem: rode a migration 004 no Supabase primeiro, depois os prompts.

---

## Item 1 — Imagens no perfil do cliente

O dono quer guardar e acessar rápido imagens por cliente (logo vetorizada, mockup da
sacola feito por IA, etc.), salvas no banco. Usa Supabase Storage + a tabela
`contact_media` (na migration 004).

Prompt Claude Code:

> Implemente upload e galeria de imagens por cliente. Backend: endpoints para listar
> (`GET /contacts/{id}/media`), adicionar (`POST /contacts/{id}/media`) e remover
> (`DELETE /media/{media_id}`) registros em `contact_media`. Use um bucket do Supabase
> Storage chamado `contact-media` (crie se não existir; pode ser público para leitura).
> O upload do arquivo vai pro Storage e a URL pública é gravada em `contact_media.url`,
> com `kind` ('logo_vetor' | 'mockup' | 'outro') e `caption` opcional.
> Frontend: na tela de detalhe do cliente, uma seção "Imagens" com galeria em miniaturas,
> botão de upload, seletor de tipo, e ação de remover. O input de arquivo deve aceitar tanto
> foto da galeria quanto tirar na hora — use `<input type="file" accept="image/*">` SEM o
> atributo `capture`, pra no celular abrir o menu "tirar foto ou escolher da galeria".
> Mobile-first. Rode npm run build.

---

## Item 2 — Endereços múltiplos por cliente + uso no pedido

Cadastrar um ou mais endereços por cliente, e na criação do pedido escolher um deles
(em vez de digitar à mão). Usa `contact_addresses` + a coluna `orders.delivery_address_id`
(migration 004).

Endereço é TEXTO LIVRE (o dono escreve o que o cliente passa). Sem API, sem custo.
Vários endereços por cliente continuam suportados — só que digitados à mão.

Prompt Claude Code:

> Implemente endereços por cliente. Backend: CRUD de `contact_addresses`
> (`GET/POST /contacts/{id}/addresses`, `PATCH/DELETE /addresses/{id}`), com `label`
> (apelido opcional, ex: "Loja centro"), `address` (texto livre) e `is_default`.
> Frontend: na tela de detalhe e no formulário do cliente, uma seção "Endereços" pra
> adicionar/editar vários (campo de texto livre + apelido + marcar como padrão).
> No formulário de NOVO PEDIDO: depois de escolher o cliente, mostre um Select com os
> endereços salvos dele; ao escolher, preencha `delivery_address` (texto) e
> `delivery_address_id` do pedido automaticamente. Manter a opção de digitar um endereço
> avulso se o cliente não tiver nenhum salvo. Mobile-first. Rode npm run build.

---

## Item 3 — "Sinal pago" SUBSTITUI "Confirmado" no pipeline

Confirmar a venda = pagar o sinal (metade). São o mesmo momento, então o status
`confirmed` é trocado por `signal_paid` ("Sinal pago") — não é uma etapa nova, é a
substituição. Garante a venda e vem logo antes da vetorização. Status é texto livre
(sem mudança de schema); reaproveitamos a coluna existente `confirmed_at` como a data do
sinal. O trigger (migration 004) já promove lead → cliente nessa etapa.

Importante: a negociação acontece fora do sistema (campanha pra centenas). O pedido só
ENTRA no quadro quando o sinal é pago. Então "Orçamento" sai do quadro e o pedido nasce já
em "Sinal pago" (que é o padrão e a primeira coluna).

Pipeline do quadro (ordem):
**signal_paid** → vector_pending → factory_pending → printing → ready_to_deliver →
delivered → paid   (quote e cancelled ficam fora do quadro)

Prompt Claude Code:

> No pipeline de pedidos, SUBSTITUA o status `confirmed` por `signal_paid` ("Sinal pago") —
> não é etapa nova, é trocar o "Confirmado". O pedido nasce já em `signal_paid` (esse é o
> padrão do formulário de novo pedido), porque a negociação acontece fora do sistema e o
> pedido só entra quando o sinal é pago. Atualize em todo o código: o mapa de status → label
> pt-BR (remova "Confirmado", use "Sinal pago"), o StatusBadge, o Select de status do
> formulário, e as colunas do Kanban nesta ordem, SEM a coluna Orçamento:
> Sinal pago → Aguardando vetor → Na fábrica → Em impressão → Pronto p/ entregar → Entregue
> → Pago. (Orçamento e Cancelado ficam fora do quadro, como o Cancelado já fica.)
> No PATCH de pedido, ao mudar para `signal_paid`, preencha `confirmed_at` com agora
> (reusando a coluna) e defina `paid_amount = total / 2` (o sinal é metade), sem sobrescrever
> se já houver valor. Base nova, sem registros `confirmed` — não precisa migrar dados.
> Mobile-first. Rode npm run build.

---

## Item 4 — Bug: receita do mês e renda média diária (contar pedidos PAGOS)

Hoje a receita do mês soma o `total` de todos os pedidos criados no mês, ignorando o
status. Por isso marcar "Pago" não muda nada. Correção: receita = pedidos com status
`paid`, pela data `paid_at`.

Definições corretas:
- Receita do mês = SOMA de `total` dos pedidos com `status = 'paid'` e `paid_at` dentro do
  mês atual.
- Renda média diária = receita do mês ÷ nº de dias já decorridos no mês.
- Delta vs mês anterior = mesma conta para o mês passado (paid_at no mês anterior).

Prompt Claude Code:

> Corrija o cálculo de receita do dashboard. Hoje `receita_mes` (no endpoint `/views/stats`
> e/ou na view `v_dashboard_summary`) soma o total de todos os pedidos criados no mês,
> ignorando o status — por isso marcar um pedido como "Pago" não reflete na receita.
> Redefina assim, lendo as migrations atuais (002/003) pra ajustar as views existentes:
> - receita_mes = SUM(total) de orders WHERE status = 'paid' AND paid_at no mês atual.
> - renda_media_diaria = receita_mes ÷ dias decorridos no mês.
> - delta vs mês anterior = mesma regra para o mês passado.
> - Alinhe também a view `v_receita_mensal` (gráfico) pra agrupar por mês de `paid_at` com
>   status 'paid', em vez de delivered_at.
> Adicione o card "Renda média diária" ao dashboard. Se precisar mudar colunas de uma view,
> use DROP VIEW + CREATE (não CREATE OR REPLACE) pra evitar erro de mudança de coluna, e me
> dê o SQL final pra eu rodar no Supabase. Rode npm run build.

---

## Sequência
1. Rodar `004_features_perfil_endereco_sinal.sql` no Supabase.
2. Item 4 primeiro (é bug, e é rápido) → validar a receita marcando um pedido como Pago.
3. Item 3 (sinal) → 2 (endereços) → 1 (imagens).
4. Validar no celular do dono antes de fechar.
