# CRM app — UI kit

A high-fidelity, click-through recreation of the **redesigned** Sacolas CRM
(neutral slate + single kraft-amber accent, Geist, mobile-first). It is the
visual contract for the product's core surfaces.

## Run
Open `index.html`. It loads React + Babel, the project `styles.css` (tokens),
and `kit.css`, then mounts the app. **Self-contained** — it does not depend on
the compiled `_ds_bundle.js`, so it renders anywhere (preview, file, DS tab).

## What's inside
- `App.jsx` — shell: `Sidebar` (desktop) / `BottomTabBar` (mobile, ≤820px) + a
  tiny screen router.
- `Dashboard.jsx` — Visão geral: period toggle, 4 KPI cards with deltas/sublines,
  monochrome-blue revenue bars (peak month highlighted), consolidated "Precisa de
  atenção hoje" panel, and segment horizontal bars.
- `Contacts.jsx` — Clientes: search + status/sort selects, dense app-table rows.
- `TopClients.jsx` — Melhores clientes: ranked table, proportional LTV bars, zebra.
- `NewContact.jsx` — Novo cliente: refined form, segment Select, logo switch,
  right-aligned Salvar/Cancelar.
- `OrderForm.jsx` — Novo pedido: client autocomplete (name or phone, with a
  suggestions dropdown that collapses to a chip), Quantidade+Total and
  Modelo+Tamanho side by side, Status Select (pt-BR pipeline, default Confirmado),
  delivery address, notes, amber "Salvar pedido" + secondary Cancelar. Reachable
  from a contact's "+ Pedido".
- `ViewList.jsx` — filtered action lists ("Clientes pra reativar", "Em risco",
  "Leads sem resposta"): header with count badge + context phrase, variant
  switcher, and rows (avatar, name, negócio · segmento, tempo sem comprar, LTV)
  with a prominent green **WhatsApp** CTA. Reached from the dashboard attention
  panel; the screen's job is to turn a list into action.
- `ContactDetail.jsx` — contact view: status header, WhatsApp + Pedido actions,
  metrics, order history with pipeline status badges.
- `lib.jsx` — kit primitives mirroring the authored design-system components.
- `data.js` — realistic pt-BR mock data.
- `kit.css` — kit styles, all values from `styles.css` tokens.

## Fidelity notes
Recreated from the `frontend/` codebase + the `REDESIGN_DASHBOARD.md` brief. This
kit implements the **target** redesign, not the legacy orange-on-Inter screens.
The kit primitives are simplified, cosmetic mirrors of `/components` — for
production, compose the real bundled components instead.
