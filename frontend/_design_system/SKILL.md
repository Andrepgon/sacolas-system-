---
name: sacolas-crm-design
description: Use this skill to generate well-branded interfaces and assets for Sacolas CRM, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

Sacolas CRM is a mobile-first customer & order manager (pt-BR) for a one-person
business selling custom kraft paper bags. The look is clean, corporate, SaaS-modern:
**neutral slate base + a single kraft-amber accent (#BA7517), Geist (400/500 only),
hairline borders, soft corners, restrained shadow.** Color encodes meaning, never
decoration. No emoji. Sentence case, always; keep pt-BR accents.

Key files:
- `styles.css` — link this; it `@import`s all tokens + fonts.
- `tokens/` — colors, typography, spacing, fonts.
- `components/` — React primitives (core, crm, navigation) + `.d.ts`/`.prompt.md`.
- `ui_kits/crm/` — full interactive product recreation (self-contained).
- `guidelines/` — foundation specimen cards.
- `assets/` — logo mark + Geist webfonts.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets
out and create static HTML files for the user to view. If working on production code,
copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to
build or design, ask some questions, and act as an expert designer who outputs HTML
artifacts _or_ production code, depending on the need.
