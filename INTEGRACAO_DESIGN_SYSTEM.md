# Integração do Design System no app — guia para o Claude Code

Regra de ouro: o design system (kit em JSX+CSS) é REFERÊNCIA VISUAL, não código pra copiar.
O Claude Code porta tudo pro stack real: Next 14 + TypeScript + Tailwind + shadcn/ui.
A camada de DADOS não muda (lib/api.ts, lib/types.ts, endpoints) — só a camada visual.

---

## Passo 0 — Dar acesso ao Claude Code

A pasta "Sacolas CRM Design System ATUALIZADO" está em Downloads, fora do repo. Copie-a
para dentro do repositório como referência (não vai pro build, só pro Claude Code ler):

- Copie a pasta para `frontend/_design-system/` (ou `design-system/` na raiz do repo).
- Adicione `_design-system/` ao `.gitignore` se não quiser versioná-la (opcional; é leve).

Assim o Claude Code lê `_design-system/tokens`, `_design-system/components` e
`_design-system/ui_kits/crm` diretamente.

---

## Leva 1 — Tokens (fundação)

> Integre os tokens do design system em `_design-system/tokens/` no app. Porte
> `tokens/colors.css`, `typography.css`, `spacing.css` e `fonts.css` para o
> `app/globals.css` (as variáveis HSL do shadcn) e mapeie as cores semânticas novas
> (success, warning, info, e a paleta de gráfico) no `tailwind.config.ts`. Carregue as fontes
> Geist e Geist Mono de `_design-system/assets/fonts/`. Não altere nenhuma tela ainda. Rode
> `npm run build`. Crie a página `/styleguide` mostrando paleta, tipografia e os tokens, pra
> eu aprovar a fundação.

---

## Leva 2 — Componentes (portar para shadcn + TS + Tailwind)

> Reconstrua os componentes do design system no stack do app (TypeScript + Tailwind, em cima
> dos componentes shadcn existentes em `components/ui`). Use como fonte os arquivos em
> `_design-system/components/`: cada componente tem um `.prompt.md` (descrição/comportamento) e
> um `.d.ts` (API de props) — siga-os. Reimplemente, NÃO copie os `.jsx`:
>
> - core: Button (variante primary = âmbar), Badge, Avatar (iniciais), Card, Input, Select
> - crm: KpiCard, StatusBadge, ContactRow, AttentionItem
> - navigation: Sidebar (desktop) e BottomTabBar (mobile)
>
> Cada um deve usar os tokens da Leva 1 (nada de cor na mão). Adicione todos à página
> `/styleguide` em todas as variantes. Rode `npm run build` e me mostre a styleguide.

---

## Leva 3 — Telas (reusar componentes + ligar na API real)

Cada tela do kit (`_design-system/ui_kits/crm/*.jsx`) é a referência visual. Mas o kit usa
`data.js` (mock) e um router próprio — no app, cada tela vira uma rota do Next App Router e
consome a API real via `lib/api.ts`. Mapa de telas → rotas:

| Tela do kit         | Rota no app                  |
|---------------------|------------------------------|
| Dashboard.jsx       | app/page.tsx                 |
| Contacts.jsx        | app/contacts/page.tsx        |
| ContactDetail.jsx   | app/contacts/[id]/page.tsx   |
| TopClients.jsx      | app/clientes/top/page.tsx    |
| NewContact.jsx      | app/contacts/new/page.tsx    |
| OrderForm.jsx       | app/orders/new/page.tsx      |
| ViewList.jsx        | app/views/[slug]/page.tsx    |

Prompt:

> Repagine as telas do app usando as telas em `_design-system/ui_kits/crm/` como referência
> visual e os componentes da Leva 2. Siga o mapa de telas→rotas do INTEGRACAO_DESIGN_SYSTEM.md.
> Regras: (a) cada tela consome dados reais via `lib/api.ts`, NUNCA o `data.js` do kit; (b)
> mantenha os tipos de `lib/types.ts`; (c) trate estados de carregando (skeleton) e vazio; (d)
> mobile-first, testar a 375px; (e) TypeScript estrito. Faça uma tela por vez, começando por
> Dashboard, e me mostre antes de seguir.

---

## Atenção — endpoints que o Dashboard novo precisa

A tela Dashboard do kit mostra deltas e médias que o backend atual NÃO calcula:
delta de receita vs mês anterior, ticket médio, LTV médio. São agregações ADITIVAS
(novas views/endpoints), sem mexer no schema. Inclua no prompt do Dashboard:

> O Dashboard precisa de métricas que o backend ainda não tem (delta de receita vs mês
> anterior, ticket médio, LTV médio). Crie os endpoints/agregações de forma aditiva (novas
> views SQL se necessário) e me dê o SQL pra rodar no Supabase. Não altere as tabelas.

---

## Ordem e validação

Leva 1 → aprovar /styleguide → Leva 2 → aprovar /styleguide → Leva 3 (uma tela por vez).
Rode `npm run build` ao fim de cada leva. Não pule a aprovação da styleguide: ela é o
contrato visual e pega regressão antes de espalhar pelas telas.
