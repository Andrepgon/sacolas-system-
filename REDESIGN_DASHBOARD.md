# Repaginação visual — CRM Sacolas

Direção: limpo e corporativo (SaaS moderno, tipo Linear/Stripe/Notion). Mobile-first.
Objetivo: tirar o ar de protótipo, criar hierarquia, e transformar números soltos em
informação acionável. Nada de mudar dados ou schema — é só camada visual e de UX.

---

## 1. Princípios

1. Neutro com UM acento. Hoje o laranja vibrante está em tudo (badges, botões) e cansa.
   Reduzir o laranja a um único acento usado com parcimônia (botão primário, estado ativo).
   Todo o resto em escala de cinza/slate neutro.
2. Respiro. Mais espaço em branco, menos bordas grossas. Bordas de 0.5px, cantos suaves.
3. Cada número responde a uma pergunta de negócio. Se não ajuda a decidir, sai da tela.
4. Cor encoda significado, não enfeite. Acabar com a paleta arco-íris dos gráficos.

---

## 2. Sistema de cores

Base neutra (use os tokens do Tailwind/shadcn já existentes):
- Fundo da página: `slate-50` / `background`
- Cards: branco, borda `slate-200` 0.5px, radius `lg`
- Texto primário: `slate-900`; secundário: `slate-500`; dica: `slate-400`

Acento único (manter identidade kraft, mas contido):
- Primário: âmbar/laranja queimado `amber-600` (#BA7517) — só botão primário e estado ativo do nav
- Hover de primário: `amber-700`

Cores semânticas (status, deltas):
- Sucesso/positivo: `emerald-600`
- Atenção/risco baixo: `amber-600`
- Risco alto/negativo: `red-600`
- Informação: `blue-600`

Status do cliente (badges) — parar de usar laranja sólido gritante:
- `customer`: badge sutil — fundo `emerald-50`, texto `emerald-700`
- `lead`: fundo `slate-100`, texto `slate-600`
- `inactive`/`churned`: fundo `slate-100`, texto `slate-400`

Paleta dos gráficos (monocromática azul — coesa, corporativa):
- Barras de receita: `#378ADD` (mês de pico em tom forte, demais em `#85B7EB`)
- Segmentos: tons da MESMA família azul em degraus — `#185FA5`, `#378ADD`, `#85B7EB`,
  `#B5D4F4`, e `#D3D1C7` (cinza) para "outro". Nunca vermelho/verde/roxo juntos.

---

## 3. Tipografia

- Fonte: a padrão do projeto (Geist) está ótima, manter.
- Pesos: só 400 (regular) e 500 (medium). Nunca 700 — pesa demais no estilo corporativo.
- Títulos de página: 20px/500. Títulos de card: 14px/500. Números de KPI: 24px/500.
- Sentence case sempre. Nada de TÍTULOS EM CAIXA ALTA.

---

## 4. Navegação e layout

- Desktop: sidebar fixa à esquerda (220px) com os itens (Visão geral, Clientes, Pedidos,
  Melhores clientes, + Novo), item ativo com fundo `slate-100` e barra de acento âmbar.
  Substitui o nav horizontal atual, que parece um menu de site, não de app.
- Mobile: a sidebar vira uma bottom tab bar fixa (4-5 ícones com label). É o padrão de app
  e resolve o mobile-first de verdade.
- Conteúdo com largura máxima de ~1100px, centralizado, padding generoso.

---

## 5. Telas, uma a uma

### 5.1 Dashboard (Visão geral) — a maior mudança
Hoje: 4 KPIs planos + 2 gráficos coloridos demais + 3 números gigantes empilhados.

Repaginar para:
- Cabeçalho: título "Visão geral" + seletor de período (Este mês / 30 dias / 90 dias) à direita.
- Linha de KPIs (4 cards estilo "metric card": fundo cinza claro, sem borda):
  - Receita do mês + delta vs mês anterior (▲ +18% em verde / ▼ em vermelho)
  - Pedidos do mês + ticket médio como sublinha
  - Clientes ativos + LTV médio como sublinha
  - Leads abertos + quantos sem resposta (em vermelho se houver)
  Os deltas e médias são o que torna o KPI "construtivo" — exigem 2 endpoints novos
  (comparativo mês anterior, ticket médio). São agregações aditivas, sem mexer no schema.
- Gráfico de receita/pedidos por mês: barras na paleta azul monocromática, mês de pico
  destacado em tom forte, legenda discreta. Tirar a paleta arco-íris.
- Painel "Precisa de atenção hoje": consolida reativar / em risco / leads sem resposta em
  UM card, cada linha com um ponto colorido (âmbar/vermelho/azul), o número e uma seta que
  leva pra lista filtrada. Substitui os 3 blocões empilhados. É a parte mais acionável da tela.
- "Clientes por segmento": trocar a pizza por barras horizontais (rótulo + contagem + barra
  na paleta azul). Mais legível e mais corporativo que a pizza colorida.

### 5.2 Lista de clientes (Contatos)
- Cada item ganha um avatar de iniciais (círculo com as iniciais do nome, fundo `slate-100`).
- Badge de status sutil (ver cores acima), não o laranja sólido atual.
- Filtro de status: trocar o `<select>` nativo feio pelo `Select` do shadcn.
- Adicionar ordenação (por LTV, por última compra) e manter a busca.
- Densidade: linhas um pouco mais baixas, divisores 0.5px em vez de cards separados — fica
  mais "tabela de app" e menos cartões soltos.

### 5.3 Melhores clientes
- Manter tabela, mas: número de ranking (1, 2, 3...) na primeira coluna, LTV com uma mini
  barra proporcional ao lado do valor (destaque visual de quem fatura mais), zebra striping
  sutil, cabeçalho fixo. Avatar de iniciais junto ao nome.

### 5.4 Formulários (Novo cliente / Novo pedido)
- Botão "Salvar" deixa de ser laranja gigante: vira o botão primário âmbar padrão, tamanho
  normal, alinhado à direita, com um "Cancelar" secundário ao lado.
- Campo "Segmento" hoje é texto livre — virar um `Select` do shadcn com as opções fixas do
  doc (papelaria, restaurante, boutique, confeitaria, outro). Dado estruturado desde o dia 1.
- Corrigir os labels sem acento ("negocio" → "negócio", "Observacoes" → "Observações",
  "Endereco" → "Endereço") — é encoding, parece desleixo.
- Agrupar campos relacionados com espaçamento; usar largura de formulário confortável (~480px).

### 5.5 Páginas de view (reativar / em risco / leads sem resposta)
- Mesmo card refinado da lista de clientes, mas adicionar em cada linha um botão rápido de
  ação: "WhatsApp" (abre `https://wa.me/{phone}`). Transforma a lista de "quem está sumindo"
  em ação imediata — o ponto principal dessas telas.
- Cabeçalho com o título + contagem (já existe) + uma frase de contexto ("Sem comprar há
  mais de 60 dias").

---

## 6. Componentes shadcn a usar
- `Select` (filtros e segmento), `Avatar` (iniciais), `Badge` (status refinado),
  `Table` (melhores clientes), `Tabs` ou `ToggleGroup` (seletor de período),
  `Card` (KPIs e painéis), `Button` (variant default âmbar + variant ghost/secondary).
- Gráficos: continuar com recharts, mas com `colors` fixos da paleta azul e
  `ResponsiveContainer`. Carregar via `next/dynamic` (ssr:false) pra não pesar a home.

---

## 7. Responsivo
- KPIs: 4 colunas no desktop → 2 colunas no tablet → 1 coluna no celular.
- Gráficos: lado a lado no desktop → empilhados no celular, sempre `ResponsiveContainer`.
- Sidebar → bottom tab bar no celular (breakpoint `md`).
- Testar em 375px de largura (celular do dono) antes de dar por pronto.

---

## 8. Como entregar isso ao Claude Code

Não cole este documento inteiro de uma vez pedindo "faça tudo" — é grande e ele vai divagar.
Quebre em 3 levas, validando o build entre elas:

Leva 1 (fundação visual): "Implemente o sistema de cores, tipografia e a navegação
(sidebar no desktop, bottom tab bar no mobile) da seção 2, 3 e 4 do REDESIGN_DASHBOARD.md.
Crie os tokens de cor no Tailwind/globals e o componente de nav novo. Não mexa nas telas
ainda. Rode npm run build."

Leva 2 (dashboard): "Repagine o app/page.tsx conforme a seção 5.1: KPIs com delta e médias,
gráfico de receita na paleta azul monocromática, painel 'Precisa de atenção' consolidado, e
segmento em barras horizontais. Crie os endpoints de agregação que faltam (comparativo mês
anterior, ticket médio, LTV médio) de forma aditiva. Gere a migration SQL se precisar de
views novas. Carregue os gráficos via next/dynamic."

Leva 3 (demais telas): "Repagine lista de clientes (5.2), melhores clientes (5.3),
formulários (5.4 — incluindo Select de segmento e correção dos acentos) e páginas de view
(5.5 — com botão WhatsApp por linha), seguindo o REDESIGN_DASHBOARD.md. Mantenha o sistema
visual da Leva 1."

Em cada leva, peça: "mantenha mobile-first, TypeScript estrito, e me mostre um print/descrição
do resultado antes de seguir."
