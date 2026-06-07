# M2 — Controle de pedidos (prompts Claude Code)

Tela de controle do pipeline de pedidos. Manual, sem nada externo. Usa o schema atual
(nada de mudança de schema — só endpoints/views aditivos) e o design system já integrado.

Rótulos de status em pt-BR (use estes em toda a UI):
quote=Orçamento · confirmed=Confirmado · vector_pending=Aguardando vetor ·
factory_pending=Na fábrica · printing=Em impressão · ready_to_deliver=Pronto p/ entregar ·
delivered=Entregue · paid=Pago · cancelled=Cancelado

---

## Prompt 2A — Backend: enriquecer pedidos + contagem por status

> No backend FastAPI, prepare os dados pra tela de controle de pedidos, de forma aditiva
> (sem alterar tabelas):
>
> 1. Ajuste o GET /orders pra retornar, junto de cada pedido, o nome e o business_name do
>    contato. Use o recurso embutido do Supabase em vez de N+1:
>    `supabase.table("orders").select("*, contacts(name,business_name)")`. Reflita isso no
>    Pydantic (um campo aninhado opcional `contact`).
> 2. Crie um endpoint GET /orders/por-status que retorna a contagem de pedidos agrupada por
>    status (todos os 9 status). Pode ser uma view SQL aditiva `v_pedidos_por_status` ou uma
>    agregação no endpoint — o que for mais simples. Se criar view, me dê o SQL pra rodar no
>    Supabase.
> 3. Confirme que o PATCH /orders/{id} já troca status e preenche os timestamps (confirmed_at,
>    delivered_at, paid_at) automaticamente — ele será usado pelo arrastar do Kanban.
>
> Rode ruff check e me diga se precisei rodar algum SQL.

---

## Prompt 2B — Frontend: tela de lista de pedidos (/orders)

> Crie a tela `app/orders/page.tsx` (rota /orders) — a lista de controle de pedidos, usando os
> componentes e tokens do design system. A rota /orders/new (formulário) continua existindo;
> esta é a listagem. No nav, "Pedidos" passa a apontar pra /orders.
>
> Conteúdo:
> - Cabeçalho "Pedidos" + botão primário "+ Novo pedido" (vai pra /orders/new).
> - Uma faixa de contagem por etapa no topo (chips clicáveis: Orçamento 3, Confirmado 2, Na
>   fábrica 1...), consumindo GET /orders/por-status. Clicar no chip filtra a lista.
> - Filtros: Select de status e busca por nome do cliente.
> - Lista de pedidos (linha de "tabela de app"): cliente (nome + negócio), quantidade, total em
>   R$, saldo a receber (total - paid_amount) quando houver, badge de status (use o StatusBadge
>   com os rótulos pt-BR acima), e a data relevante (criado / entregue). Clicar abre o pedido.
> - Em cada linha, um Select rápido de status que faz PATCH /orders/{id} inline (troca de etapa
>   sem abrir o pedido).
> - Estados de carregando (skeleton) e vazio ("Sem pedidos ainda.").
> - Mobile-first: no celular a linha vira card compacto. Testar a 375px.
>
> Dados reais via lib/api.ts, TypeScript estrito (tipar o pedido com o contato aninhado).

---

## Prompt 2C — Frontend: Kanban arrastável

> Adicione uma visão Kanban ao controle de pedidos. Pode ser um toggle "Lista / Quadro" no topo
> da /orders, ou a rota /orders/board — você escolhe o que for mais limpo no App Router.
>
> - Use @dnd-kit/core (+ @dnd-kit/sortable) — NÃO use react-beautiful-dnd (descontinuado).
>   Configure sensores de ponteiro E de toque, porque o uso principal é no celular.
> - Uma coluna por etapa do pipeline, na ordem: Orçamento, Confirmado, Aguardando vetor, Na
>   fábrica, Em impressão, Pronto p/ entregar, Entregue, Pago. (Cancelado fica fora do quadro,
>   acessível por um filtro.)
> - Cada cartão: cliente, quantidade, total. Arrastar o cartão pra outra coluna dispara
>   PATCH /orders/{id} com o novo status (atualização otimista na UI, com rollback se a API
>   falhar).
> - Cabeçalho de cada coluna com a contagem e o somatório de R$ daquela etapa.
> - No mobile, as colunas rolam horizontalmente; o arrastar funciona no toque.
> - Estilo do design system, mobile-first. TypeScript estrito.
>
> Rode npm run build ao final e me mostre as duas visões (lista e quadro).

---

## Validação do M2
Ao fim: criar 2-3 pedidos de teste, mover um pela lista (Select inline) e outro pelo Kanban
(arrastando), e confirmar que o status persiste (recarregar a página) e que os timestamps
foram preenchidos. No celular (375px), confirmar que dá pra arrastar com o dedo.
