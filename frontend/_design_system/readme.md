# Sacolas CRM — Design System

A clean, corporate, SaaS-modern design system (in the spirit of Linear / Stripe /
Notion) for **Sacolas CRM** — a customer & order management app for a small business
that sells **custom printed kraft paper bags** to other shops (stationers,
restaurants, boutiques, confectioneries / *papelarias, restaurantes, boutiques,
confeitarias*).

The product is run by **one person**, used **mostly on the phone** (installed as a
PWA) and sometimes on desktop. It is a single web app with three jobs:

1. **Dashboard** — KPIs, a revenue/orders chart, and a consolidated "needs attention
   today" panel.
2. **CRM** — a contact list (leads & customers) with segments, LTV, and quick
   WhatsApp actions.
3. **Order pipeline** — orders moving through production stages (quote → confirmed →
   waiting vector → at factory → printing → ready → delivered → paid).

The UI language is **Portuguese (pt-BR)**.

---

## Sources

This system was built by reading the product's real source. None of the links below
are assumed accessible to the reader — they're recorded for provenance.

- **Codebase:** `frontend/` — a Next.js (App Router) + TypeScript app using
  **shadcn/ui + Base UI primitives + Tailwind**, Supabase, recharts, react-hook-form.
  Key files read: `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx`,
  `app/page.tsx` (dashboard), `app/contacts/*`, `app/clientes/top`, `app/orders/new`,
  `components/ui/*`, `components/nav.tsx`, `components/contact-card.tsx`,
  `lib/types.ts`.
- **Specs (uploaded):**
  - `uploads/DESIGN_SYSTEM.md` — token decisions (the source of truth for colors,
    type, component variants, chart palette).
  - `uploads/REDESIGN_DASHBOARD.md` — the visual redesign brief (principles, layout,
    screen-by-screen direction).
- **Brand assets:** `frontend/public/icon-192.png`, `icon-512.png` (PWA mark),
  `manifest.json`.

> **Important — this system encodes the TARGET design, not the legacy app.** The
> shipping code today uses a bright orange (`#ea580c`-ish) on Inter and is described
> in the brief as "looking like a prototype." This design system implements the agreed
> redesign: a **neutral slate base with a single restrained kraft-amber accent**, on
> **Geist**, with **400/500 weights only**. When a kit or component here diverges from
> the current production screenshots, the redesign is correct.

---

## Content fundamentals — how Sacolas CRM writes

The app talks to **one user: the owner**. Copy is operational, calm, and in
**Portuguese (pt-BR)**. The voice is a quiet assistant surfacing what to do next, not
a marketing site.

- **Language & accents.** Portuguese, and accents are **non-negotiable**: `negócio`,
  `Observações`, `Endereço`, `Última compra`, `Orçamento`. (Dropping them — as the
  legacy app does — "looks like sloppiness / *parece desleixo*". Always write them.)
- **Casing.** **Sentence case, always.** Page titles, card titles, buttons, labels —
  all sentence case. **No ALL-CAPS titles.** Only acronyms (LTV, KPI, PWA, WhatsApp)
  and proper nouns are capitalized.
- **Person.** Impersonal/imperative, addressing the task not the user. Buttons are
  verbs: `Salvar`, `Cancelar`, `+ Novo`, `+ Pedido`. Section labels are nouns:
  `Visão geral`, `Clientes`, `Melhores clientes`, `Precisa de atenção hoje`.
- **Tone — every number answers a business question.** Labels are short and
  decision-oriented. A KPI isn't "Receita" alone; it's `Receita do mês` with a delta
  (`▲ +18%`). A view isn't "Em risco"; it's `Clientes em risco` with context
  underneath: *"Sem comprar há mais de 60 dias."* If a number doesn't help decide,
  it's cut.
- **Numbers & currency.** Brazilian real, `R$ 1.240` (no decimals in summaries; cents
  only where it matters, e.g. order total entry). Dates in `dd/MM/yyyy` or relative
  (*"há 12 dias"*) via `date-fns` + `ptBR` locale.
- **Status vocabulary.** Contacts: `lead`, `cliente` (customer), `inativo`,
  `churned`. Orders move through a fixed pipeline with PT labels: `Orçamento`,
  `Confirmado`, `Aguardando vetor`, `Na fábrica`, `Em impressão`,
  `Pronto p/ entregar`, `Entregue`, `Pago`, `Cancelado`.
- **Segments (fixed list).** `papelaria`, `restaurante`, `boutique`, `confeitaria`,
  `outro` — structured from day one, never free text.
- **Emoji.** None. Status is carried by a colored dot, a subtle badge, or an icon —
  never an emoji. The only "glyphs" are delta arrows (▲ ▼) and the WhatsApp wordmark
  on action buttons.
- **Empty / loading states.** Plain and honest: *"Sem dados ainda."*,
  *"Sem clientes ainda."*, *"Carregando…"* (note the ellipsis character, not three
  dots).

**Examples (verbatim register):**
> `Visão geral` · `Receita do mês` · `Ticket médio` · `Leads sem resposta há +3 dias` ·
> `Precisa de atenção hoje` · `Sem comprar há mais de 60 dias` · `+ Novo` · `Salvar` ·
> `Tem logo vetorizada`

---

## Visual foundations

The aesthetic target is **quiet, corporate SaaS**: neutral, spacious, hairline-ruled,
with color used only to mean something.

### Color & vibe
- **Neutral base, ONE accent.** Everything is slate/grey; the only branded color is a
  **burnt kraft amber `#BA7517` (amber-600)** — a nod to the kraft-paper product —
  used *sparingly*: the primary button and the active nav item. Hover deepens to
  `#9A6010` (amber-700). The legacy "orange everywhere" is explicitly retired.
- **Color encodes meaning, not decoration.** Positive = emerald-600, attention/at-risk
  = amber-600, high-risk/negative = red-600, info/leads = blue-600. Status badges are
  *subtle tints*, never loud solids: customer = emerald-50 bg / emerald-700 text, lead
  = slate-100 / slate-600, inactive = slate-100 / slate-400.
- **Charts are monochrome blue.** A single cohesive blue ramp
  (`#185FA5 → #378ADD → #85B7EB → #B5D4F4`) plus a warm grey `#D3D1C7` for "other".
  Revenue bars are `#378ADD` with the peak month in strong `#185FA5`. **Never** the
  rainbow palette the legacy app used; never red/green/purple together in a chart.
- **Imagery.** There is essentially no decorative imagery — this is a data tool. The
  only brand image is the square amber app mark (initial "S"). No photography, no
  gradients-as-background, no illustration.

### Type
- **Geist** for everything; **Geist Mono** for tabular numerals (LTV, totals, IDs) so
  columns align. **Weights 400 and 500 only — never 700.** Scale: page title 20/500,
  KPI value 24/500, section 16/500, card title 14/500, body 14/400, label 13/500,
  hint 12/400. Slight negative tracking on titles and big numbers.

### Space, borders, radius
- **Respiro.** Generous whitespace, fewer/thinner borders. The default rule is a
  **hairline in slate-200**; cards lean on the border, not on shadow.
- **Radius:** `0.5rem` (8px) is the workhorse for cards and panels; 6px for
  buttons/inputs; full-round for avatars, status dots, and pills.
- **Cards:** white surface, slate-200 hairline border, radius-lg, very soft (often
  *no*) shadow. Metric/KPI cards drop the border and sit on a slate-100 fill instead.

### Elevation, hover, press
- **Shadows are restrained** — `--shadow-sm` for resting cards if any, `--shadow-md`
  for popovers, `--shadow-lg` only for dialogs/menus. No glow.
- **Hover:** surfaces lighten to slate-50/100 (`--surface-hover`); the primary button
  deepens to amber-700; ghost/secondary buttons fill with a faint muted wash.
- **Press:** a 1px downward nudge (`translate-y-px`) — no scale bounce.
- **Focus:** a 3px accent ring (`--shadow-focus`, amber at 30%).

### Motion
- Quick and unshowy. `120–180ms`, `cubic-bezier(0.2,0,0,1)`. Fades and small slides
  for popovers/dialogs. **No bounces, no infinite loops, no decorative motion.**

### Layout
- **Desktop:** fixed 220px left sidebar (Visão geral, Clientes, Pedidos, Melhores
  clientes, + Novo); active item = slate-100 fill + a 2px amber accent bar. Content
  centered, max ~1100px, generous padding.
- **Mobile (the primary case):** the sidebar becomes a **fixed bottom tab bar** (4–5
  icons + labels). KPIs reflow 4→2→1 columns; charts stack. Designed and tested at
  **375px** first.
- **Transparency / blur:** used only for the dialog scrim (a slate wash) and the
  sticky top bar on mobile. No frosted-glass everywhere.

---

## Iconography

The codebase uses **`lucide-react`** — outline icons, ~1.75px stroke, rounded
joins/caps — and this system stays faithful to it.

- **Style.** Outline only (no filled/duotone), stroke ~1.5–1.75, sized **16–20px**
  inline with text. Icons inherit `currentColor`, so they pick up the text/secondary
  token of their context; the only icons that carry color are the amber `+` action and
  the green WhatsApp glyph.
- **In the design system.** The bundled `Icon` component (and the kit's mirror) ship a
  small, **Lucide-equivalent** subset drawn to match: `home, users, package, trophy,
  search, plus, chevronDown/Right/Left, arrowLeft/Right/Up/Down, check, x, phone,
  whatsapp`. These cover the CRM's nav and affordances. **Substitution flag:** these
  are hand-traced to match Lucide's geometry rather than the real font, so for
  production prefer importing `lucide-react` directly (same names) — the look is
  identical. Richer icons not in the subset should come from Lucide.
- **Where icons appear.** Sidebar/tab-bar nav items, the `+ Novo` action, search field,
  list chevrons/arrows, the WhatsApp quick-action, and order/segment affordances. Keep
  them sparse — this is a text-and-numbers tool.
- **No emoji, no unicode-as-icon.** The only glyphs used as "icons" are the KPI delta
  arrows **▲ / ▼** (which carry semantic color) and the WhatsApp mark.
- **Assets on disk.** `assets/logo-mark.png` (+`-192`) is the kraft-amber app mark
  (recolored from the legacy PWA icon `assets/icon-512.png` / `icon-192.png`, kept for
  reference). `assets/manifest.json` is the original PWA manifest.

---

## Index / manifest

Root files:
- **`styles.css`** — the single entry point consumers link. `@import`s only.
- **`readme.md`** — this guide.
- **`SKILL.md`** — Agent-Skills-compatible wrapper for downloading/using as a skill.

Folders:
- **`tokens/`** — `fonts.css` (@font-face: Geist, Geist Mono), `colors.css`,
  `typography.css`, `spacing.css`, `base.css`. All reached from `styles.css`.
- **`assets/`** — `logo-mark.png`/`-192` (brand mark), `icon-512.png`/`icon-192.png`
  (legacy reference), `manifest.json`, `fonts/GeistVF.woff`, `fonts/GeistMonoVF.woff`.
- **`guidelines/`** — foundation specimen cards for the Design System tab
  (colors, type, spacing, brand, iconography).
- **`components/`** — reusable primitives, bundled into the runtime library:
  - `core/` — **Button, Badge, Avatar, Input, Select, Card**
  - `crm/` — **KpiCard, StatusBadge, ContactRow, AttentionItem**
  - `navigation/` — **Sidebar, BottomTabBar**
  - `shared.jsx` — internal helpers (`Icon`, `initials`, `injectStyles`); imported by
    components, not a public primitive.
  - Each component dir has `<Name>.jsx` + `<Name>.d.ts` + `<Name>.prompt.md` and one
    `*.card.html` (`@dsCard group="Components"`).
- **`ui_kits/crm/`** — the full interactive product recreation (self-contained, no
  bundle dependency): `index.html` (shell + router), `lib.jsx` (primitives),
  `data.js` (mock pt-BR data), `Dashboard.jsx`, `Contacts.jsx`, `TopClients.jsx`,
  `NewContact.jsx`, `ContactDetail.jsx`, `App.jsx`, `kit.css`, `README.md`.

Starting points: **Button**, **KpiCard**, **Sidebar** (components) and the **CRM app**
screen (`ui_kits/crm/index.html`).

**Consuming the bundle in a card/screen:** link `styles.css`, load
`…/_ds_bundle.js` (relative to project root), then
`const { Button, KpiCard, … } = window.SacolasCRMDesignSystem_553a9b`. The bundle is
served inside the Design System tab.
