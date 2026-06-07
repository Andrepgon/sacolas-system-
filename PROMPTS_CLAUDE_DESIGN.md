# Prompts para o Claude Design — repaginação das telas

Use um prompt por tela. O Claude Design já tem o design system (base neutra slate,
acento âmbar único, tipografia Geist, shadcn/ui, mobile-first) — então os prompts focam em
layout, hierarquia e conteúdo. Regra geral pra colar junto se precisar:
"Mantenha o design system configurado, estilo limpo e corporativo, e desenhe desktop e mobile."

---

## 1. Navegação (faça primeiro — todas as telas usam)

> Desenhe a navegação principal do app. No desktop, uma sidebar fixa de ~220px à esquerda com
> os itens: Visão geral, Clientes, Pedidos, Melhores clientes, e um botão de ação "+ Novo".
> O item ativo tem fundo neutro suave e uma barra de acento âmbar à esquerda. No mobile, a
> sidebar vira uma bottom tab bar fixa com 4-5 ícones e rótulos curtos. Logo/nome "Sacolas"
> no topo da sidebar. Estilo limpo, ícones de linha.

---

## 2. Dashboard (Visão geral) — tela principal

> Desenhe o dashboard de um CRM, estilo limpo e corporativo. Estrutura de cima pra baixo:
>
> - Cabeçalho: título "Visão geral" + um seletor de período à direita (Este mês / 30 dias / 90 dias).
> - Linha de 4 KPIs (cards de métrica, fundo neutro suave, sem borda): "Receita do mês" com
>   um delta colorido vs mês anterior (verde pra positivo, vermelho pra negativo); "Pedidos do
>   mês" com ticket médio como sublinha; "Clientes ativos" com LTV médio como sublinha;
>   "Leads abertos" com quantos estão sem resposta (em vermelho se houver).
> - Gráfico de barras "Receita e pedidos por mês": paleta azul monocromática, o mês de pico
>   destacado num tom mais forte que os demais. Legenda discreta.
> - Abaixo, duas colunas lado a lado (empilham no mobile):
>   - Card "Precisa de atenção hoje": três linhas — Clientes pra reativar, Clientes em risco,
>     Leads sem resposta — cada uma com um ponto colorido (âmbar/vermelho/azul), a contagem e
>     uma seta que leva pra lista. É a parte acionável da tela.
>   - Card "Clientes por segmento": barras horizontais (papelaria, restaurante, confeitaria,
>     boutique, outro), cada uma com rótulo, contagem e barra na paleta azul. Sem pizza.
>
> Desenhe os estados: carregando (skeletons) e vazio. Desktop e mobile.

---

## 3. Lista de clientes (Contatos)

> Desenhe a lista de clientes de um CRM. Cabeçalho com título "Clientes" e botão primário
> "+ Novo" à direita. Abaixo, uma barra com: campo de busca (nome ou telefone), um Select de
> status (Todos / Leads / Clientes / Inativos) e um Select de ordenação (Maior LTV / Compra
> mais recente / Nome). Cada cliente é uma linha com: avatar de iniciais, nome, nome do
> negócio (cinza), badge de segmento, badge de status sutil (verde discreto pra "customer",
> cinza pra "lead" — nada de laranja sólido), tempo desde a última compra e o LTV em destaque
> à direita. Linhas separadas por divisores finos, densidade de "tabela de app". Clicar abre o
> detalhe. Desktop e mobile (no mobile, a linha vira card compacto).

---

## 4. Detalhe do cliente

> Desenhe a tela de detalhe de um cliente. Cabeçalho: avatar de iniciais, nome, nome do
> negócio, badges de status e segmento, e um botão "Abrir WhatsApp" (acento). Abaixo, uma
> linha de métricas em cards pequenos: total de pedidos, LTV, última compra, dias sem comprar.
> Depois, duas seções: "Histórico de pedidos" (tabela com status, quantidade, total e datas) e
> "Observações" (texto livre editável). Botões de ação no topo: "Editar" e "+ Novo pedido".
> Estilo limpo, bastante respiro. Desktop e mobile.

---

## 5. Melhores clientes

> Desenhe uma tabela de ranking dos melhores clientes. Colunas: posição (1, 2, 3...), cliente
> (avatar de iniciais + nome + negócio), segmento, nº de pedidos, LTV (com uma mini barra
> proporcional ao lado do valor, destacando quem fatura mais) e última compra. Cabeçalho fixo,
> zebra striping bem sutil. Um pequeno filtro de segmento no topo. Estilo corporativo e
> legível. No mobile, vira cards ranqueados em vez de tabela.

---

## 6. Formulário — Novo cliente

> Desenhe um formulário de cadastro de cliente, largura confortável (~480px), centrado ou em
> coluna. Campos: Nome (obrigatório), Telefone (obrigatório, com máscara), Nome do negócio,
> Segmento (um Select com opções fixas: papelaria, restaurante, boutique, confeitaria, outro),
> "Tem logo vetorizada?" (checkbox), Observações (textarea). Rodapé com botão primário "Salvar"
> (âmbar, tamanho normal, não largura total) e um "Cancelar" secundário ao lado. Mostre o
> estado de erro inline (ex: telefone já cadastrado). Desktop e mobile.

---

## 7. Formulário — Novo pedido

> Desenhe um formulário de novo pedido. Campos: Cliente (autocomplete buscando por nome ou
> telefone, com sugestões), Quantidade (obrigatório), Total em R$ (obrigatório), Modelo da
> sacola, Tamanho, Status (Select com os estados do pipeline, padrão "Confirmado"), Endereço de
> entrega, Observações. Agrupe quantidade/total e modelo/tamanho em pares lado a lado.
> Rodapé com botão primário "Salvar pedido" e "Cancelar" secundário. Desktop e mobile.

---

## 8. Páginas de view (reativar / em risco / leads sem resposta)

> Desenhe uma página de lista filtrada de clientes (ex: "Clientes pra reativar"). Cabeçalho
> com o título, a contagem de contatos e uma frase de contexto ("Sem comprar há mais de 60
> dias"). Cada linha reusa o estilo da lista de clientes (avatar, nome, negócio, segmento,
> tempo sem comprar, LTV) e adiciona um botão de ação rápida "WhatsApp" que abre a conversa.
> O objetivo da tela é virar ação, então o botão de contato é proeminente. Desktop e mobile.

---

## Ordem sugerida

Faça a navegação (1) primeiro, depois o dashboard (2) — é a tela que mais muda. Aprove o
visual nessas duas antes de seguir, porque elas firmam os padrões (cards, badges, listas) que
as outras telas reaproveitam. Depois 3 → 4 → 5 → 6 → 7 → 8.
