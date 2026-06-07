# Design System — CRM Sacolas

Como criar e onde mora cada coisa. Direção: limpo/corporativo, acento âmbar único.

---

## Como se cria um design system (a ordem)

1. Travar os TOKENS (este documento). Decisão sua, feita uma vez.
2. Configurar os COMPONENTES shadcn pra consumir os tokens (variantes de Button, Badge...).
3. Construir os PADRÕES (KPI card, linha de cliente, painel de atenção, wrapper de gráfico).
4. Documentar numa página viva `/styleguide` dentro do próprio app.

A regra de ouro: nenhum componente usa cor "na mão" (ex: `bg-orange-500`). Tudo aponta pros
tokens (`bg-primary`, `text-muted-foreground`). Assim o app inteiro muda num lugar só.

---

## 1. Tokens — `app/globals.css`

Substituir o bloco `:root` pelos valores abaixo. Formato HSL sem vírgula é o que o shadcn usa.

```css
:root {
  /* superfícies */
  --background: 210 20% 98%;        /* slate-50  — fundo da página */
  --foreground: 222 47% 11%;        /* slate-900 — texto primário */
  --card: 0 0% 100%;                /* branco    — cards */
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;

  /* acento único (âmbar/kraft) — só botão primário e estado ativo */
  --primary: 35 78% 41%;            /* amber-600 #BA7517 */
  --primary-foreground: 0 0% 100%;

  /* neutros de apoio */
  --secondary: 210 40% 96%;         /* slate-100 */
  --secondary-foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;  /* slate-500 — texto secundário */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;

  /* bordas e foco */
  --border: 214 32% 91%;            /* slate-200 */
  --input: 214 32% 91%;
  --ring: 35 78% 41%;               /* foco usa o acento */

  /* semânticas (status, deltas) — adicionais ao shadcn padrão */
  --success: 160 84% 39%;           /* emerald-600 — positivo, customer */
  --success-foreground: 0 0% 100%;
  --warning: 35 78% 41%;            /* amber-600   — atenção / em risco baixo */
  --warning-foreground: 0 0% 100%;
  --destructive: 0 72% 51%;         /* red-600     — risco alto / negativo */
  --destructive-foreground: 0 0% 100%;
  --info: 211 80% 43%;              /* blue-600    — leads / informação */

  --radius: 0.5rem;
}
```

Dark mode fica pra depois (o dono usa claro). Quando quiser, cria o `.dark { ... }` com os
mesmos nomes invertidos.

---

## 2. Mapear no Tailwind — `tailwind.config.ts`

No `theme.extend.colors`, garantir que as semânticas novas existam (as do shadcn já vêm):

```ts
colors: {
  // ...as do shadcn (background, foreground, primary, etc.)
  success:     { DEFAULT: "hsl(var(--success))",     foreground: "hsl(var(--success-foreground))" },
  warning:     { DEFAULT: "hsl(var(--warning))",     foreground: "hsl(var(--warning-foreground))" },
  info:        { DEFAULT: "hsl(var(--info))" },
}
```

---

## 3. Tipografia (decisão de token)

- Fonte: Geist (já no projeto). Manter.
- Só dois pesos: 400 e 500. Proibido 700.
- Escala: página 20px/500 · card 14px/500 · KPI 24px/500 · corpo 14px/400 · dica 12px/400.
- Sentence case sempre.

---

## 4. Variantes de componente (a configurar no shadcn)

Badge (status do cliente) — criar variantes:
- `customer`: `bg-success/10 text-success` (verde sutil, não laranja sólido)
- `lead`: `bg-secondary text-muted-foreground`
- `inactive`: `bg-secondary text-muted-foreground/60`

Button:
- `default`: usa `bg-primary` (âmbar) — só pra ação principal (Salvar, + Novo)
- `secondary`/`ghost`: pra ações de apoio (Cancelar, voltar)
- Tamanho normal. Acabar com botão laranja gigante de largura total.

Avatar: círculo de iniciais, `bg-secondary text-muted-foreground`, usado em listas e tabela.

---

## 5. Paleta de gráficos (token separado)

Não usar cor semântica em gráfico. Definir um array fixo, família azul monocromática:

```ts
export const chartColors = {
  bar:      "#378ADD",   // barra padrão
  barPeak:  "#185FA5",   // mês de pico em destaque
  segments: ["#185FA5", "#378ADD", "#85B7EB", "#B5D4F4", "#D3D1C7"], // 5º = cinza p/ "outro"
}
```

Passar isso pro recharts via prop `fill`/`Cell`. Nunca deixar o recharts escolher cores sozinho.

---

## 6. Página viva `/styleguide`

Criar uma rota `app/styleguide/page.tsx` que renderiza: a paleta (swatches dos tokens), os
pesos de tipografia, e um de cada componente em todas as variantes (botões, badges de status,
inputs, card, avatar, exemplo de gráfico). Serve de referência e pega regressão visual —
quando algo "quebra" o sistema, aparece aqui primeiro. É o seu contrato visual.

---

## Como mandar pro Claude Code

Prompt da fundação (faça antes de qualquer redesign de tela):

> Implemente o design system do DESIGN_SYSTEM.md: substitua os tokens em app/globals.css
> (seção 1), mapeie as cores semânticas novas no tailwind.config.ts (seção 2), configure as
> variantes de Badge e Button (seção 4), exporte o chartColors (seção 5) em lib/chart-colors.ts,
> e crie a página /styleguide (seção 6) mostrando todos os tokens e variantes. Não altere
> nenhuma tela de negócio ainda — só a fundação visual. Rode npm run build e me mostre a
> /styleguide pra eu aprovar antes de repaginarmos as telas.

Só depois que a /styleguide estiver aprovada é que você parte pras Levas 2 e 3 do
REDESIGN_DASHBOARD.md — e elas vão referenciar estes tokens, não cores soltas.
