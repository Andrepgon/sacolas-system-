# Prompts para Claude Code — Protótipo CRM Sacolas

Ordem de execução. Rode um prompt, valide o resultado, só então passe ao próximo.
Não cole todos de uma vez.

Pré-requisito: clone o repo `sacolas-system` e abra o Claude Code na raiz dele.

---

## Prompt 0 — Ancorar a especificação no repo

> Vou colar abaixo o documento de execução completo do protótipo. Salve-o como
> `docs/EXECUCAO.md` no repositório, sem alterar nada. Ele é a especificação
> de referência: sempre que eu pedir pra implementar algo, siga o código e as
> decisões desse documento. Schema do banco e contratos dos endpoints já são
> finais — não improvise nem "melhore" sem eu pedir.
>
> [COLE AQUI O DOCUMENTO DE EXECUÇÃO INTEIRO]

Depois de salvar, confirme criando também um `.gitignore` na raiz cobrindo
Python (`.venv`, `__pycache__`, `.env`) e Node (`node_modules`, `.next`,
`.env.local`). Não commite ainda.

---

## Prompt 1 — Scaffold do backend

> Crie a estrutura do backend FastAPI exatamente como a seção 5 do
> `docs/EXECUCAO.md` descreve. Gere todos os arquivos:
>
> - `backend/pyproject.toml` (com as deps e o grupo `dev`)
> - `backend/Dockerfile`
> - `backend/.env.example`
> - `backend/app/__init__.py`, `config.py`, `db.py`, `main.py`
> - `backend/app/models/` → `contact.py`, `order.py`, `interaction.py`
> - `backend/app/routers/` → `contacts.py`, `orders.py`, `views.py`
> - pastas `app/services/` e `tests/` com `__init__.py`
>
> Use o código que já está no documento, sem reescrever a lógica. Mantенha o
> typing estrito (Python 3.11+). Não adicione bibliotecas que não estão no
> `pyproject.toml`. Ao terminar, liste os arquivos criados em árvore.

---

## Prompt 2 — Validar o backend localmente

> Configure e suba o backend localmente:
>
> 1. Crie o venv, instale `pip install -e ".[dev]"`
> 2. Copie `.env.example` para `.env` (eu preencho as credenciais — me avise
>    quais variáveis preciso colar)
> 3. Rode `ruff check` e corrija o que aparecer
> 4. Suba com `uvicorn app.main:app --reload` e confirme que `/health`
>    responde e `/docs` carrega
>
> Não invente valores de credencial. Pare e me peça as chaves do Supabase
> antes de tentar qualquer chamada que toque o banco.

> Depois que eu colar o `.env`: teste o fluxo completo via `/docs` —
> criar um contato, criar um pedido `delivered` pra ele, e confirmar que o
> GET do contato volta com `status: customer` e `lifetime_value` atualizado
> (valida o trigger pela API). Reporte o resultado.

---

## Prompt 3 — Smoke tests do backend

> Escreva testes pytest mínimos em `backend/tests/` cobrindo: validação de
> telefone no `ContactCreate` (BR sem código vira +55, inválido levanta erro),
> e o 409 de telefone duplicado no POST `/contacts`. Use mocks/stubs para o
> cliente Supabase — não dependa de banco real nos testes. Rode `pytest` e
> mostre a saída verde.

---

## Prompt 4 — Scaffold do frontend

> Na pasta `frontend/`, crie o Next.js seguindo a seção 6 do `docs/EXECUCAO.md`:
>
> 1. `npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"`
> 2. Inicialize shadcn e adicione: button input label card table dialog form
>    select badge sonner
> 3. Instale: `@supabase/supabase-js @supabase/ssr date-fns react-hook-form
>    zod @hookform/resolvers axios`
> 4. Crie `lib/api.ts`, `lib/types.ts`, `lib/supabase.ts` com o código do
>    documento
> 5. Crie `.env.local.example`
>
> Use o gerenciador de pacotes que o create-next-app configurar (pnpm de
> preferência). Ao terminar, rode `pnpm dev` e confirme que sobe sem erro.

---

## Prompt 5 — Telas principais

> Implemente as telas da seção 6.6 do `docs/EXECUCAO.md`, mobile-first, nesta
> ordem (uma de cada vez, me mostrando o componente antes de seguir):
>
> 1. `app/contacts/page.tsx` — lista com filtros e busca (use o código pronto
>    da seção 6.7 como base)
> 2. `app/contacts/[id]/page.tsx` — detalhe: header com botão WhatsApp
>    (`https://wa.me/{phone}`), métricas, histórico de pedidos, notas
> 3. `app/contacts/new/page.tsx` — form com react-hook-form + zod, máscara e
>    validação de telefone batendo com a regra do backend
> 4. `app/orders/new/page.tsx` — form de pedido com autocomplete de contato
> 5. `app/page.tsx` — dashboard com os KPIs de `/views/stats` e listas
>    clicáveis (reativar / em risco / leads sem resposta)
>
> Crie também `components/nav.tsx` (Contatos, Pedidos, Dashboard) e plugue no
> `app/layout.tsx`. Toda chamada de dados passa pelo `lib/api.ts`. Não use
> localStorage. Mantenha o TypeScript estrito (sem `any` solto — tipe os
> params da API).

---

## Prompt 6 — Login (Supabase Auth)

> Implemente `app/(auth)/login/page.tsx` com email/senha via Supabase Auth
> (cliente browser de `lib/supabase.ts`). Adicione um guard que redireciona
> rotas autenticadas pro login quando não há sessão. Mantenha simples — é
> usuário único no protótipo, sem signup público. Crie um usuário de teste e
> confirme o fluxo login → dashboard.

---

## Prompt 7 — PWA

> Configure o PWA conforme seção 6.8: `next.config.mjs` com next-pwa,
> `public/manifest.json`, e ícones 192x192 e 512x512 (gere placeholders se eu
> não fornecer os definitivos). Confirme que o build de produção
> (`pnpm build && pnpm start`) expõe o manifest e o service worker, e que
> aparece "Adicionar à tela inicial" no mobile.

---

## Prompt 8 — Script de importação vCard

> Crie `scripts/import_vcard.py` exatamente como a seção 7.2 do
> `docs/EXECUCAO.md`. Adicione um `scripts/requirements.txt` com
> `supabase` e `python-dotenv`. Não rode contra o banco ainda — só confirme
> que o parser funciona com um `.vcf` de exemplo (crie 2-3 cards fixos num
> teste e mostre o output normalizado: nome sem prefixo SACOLA, telefone E.164).

---

## Ordem de deploy (Dia 6 — depois que tudo roda local)

Esses não são prompts de código, mas o Claude Code pode te guiar:

> Me dê o passo a passo pra deployar `backend/` no Railway (incluindo o que
> colar no `railway.toml` e quais env vars setar no painel) e `frontend/` na
> Vercel (env vars `NEXT_PUBLIC_*` e a `NEXT_PUBLIC_API_URL` apontando pro
> domínio do Railway). Liste só o que eu clico, sem reescrever código.

---

## Regras gerais pra colar junto se ele começar a divagar

- "Siga o `docs/EXECUCAO.md`. Não reescreva lógica que já está especificada."
- "Schema e contratos de endpoint são finais. Se algo parece faltar, me
  pergunte antes de inventar."
- "Sem libs novas fora das já listadas. Sem emoji em código."
- "Implemente uma coisa, me mostre, espere meu OK."
