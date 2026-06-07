# Setup Checklist — Protótipo CRM Sacolas

Trilha "você mesmo": tudo que é painel web e credencial, antes de escrever código.
Ordem importa — o que vem antes desbloqueia o que vem depois.

---

## 1. GitHub (5 min)

- [ ] Criar repositório **privado** `sacolas-system`
- [ ] Deixar vazio (sem README auto) — o Claude Code vai gerar a estrutura
- [ ] Estrutura monorepo final: `backend/`, `frontend/`, `scripts/`, `README.md`

Por que primeiro: Railway e Vercel se conectam ao GitHub. Sem repo, não há o que conectar.

---

## 2. Supabase (15 min) — o passo que gera mais credenciais

- [ ] Criar conta em supabase.com
- [ ] Criar projeto novo
  - Região: **South America (São Paulo)** se aparecer; senão **US East**
  - Definir e **anotar** a `SUPABASE_DB_PASSWORD` (não dá pra recuperar depois, só resetar)

### Coletar as credenciais

> ATENÇÃO: o Supabase mudou essa tela em 2025. Hoje pode existir uma página
> **"API Keys"** com chaves novas (`publishable` e `secret`) e uma aba de
> chaves **legadas** (`anon` e `service_role`). O documento de execução usa os
> nomes legados. Equivalência:
> - `anon` (legada) ≈ `publishable` (nova) → pública, vai no frontend
> - `service_role` (legada) ≈ `secret` (nova) → admin, SÓ no backend
>
> Para o protótipo, use o que estiver disponível. Se as legadas existirem,
> use-as para bater 1:1 com o `.env.example` do doc. Se só houver as novas,
> me avise que ajusto os nomes das variáveis no código.

- [ ] `SUPABASE_URL` — em Settings → API (algo como `https://xxxxx.supabase.co`)
- [ ] `SUPABASE_ANON_KEY` — chave pública (ou `publishable`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — chave admin (ou `secret`) — **nunca no frontend**
- [ ] `SUPABASE_JWT_SECRET` — em Settings → API → seção JWT (ou Settings → Auth, dependendo da versão da UI)

### Rodar a Migration

- [ ] Abrir **SQL Editor** → New query
- [ ] Colar a Migration 001 (seção 4 do doc) inteira → **Run**
- [ ] Confirmar que rodou sem erro
- [ ] Validar: inserir 2-3 contatos de teste pelo **Table Editor** ou por um INSERT manual

```sql
insert into contacts (phone, name, business_name, segment, source, status)
values
  ('+5521999990001', 'Teste Papelaria', 'Papelaria Central', 'papelaria', 'manual', 'lead'),
  ('+5521999990002', 'Teste Restaurante', 'Cantina do Zé', 'restaurante', 'manual', 'lead');
```

- [ ] Inserir um pedido `delivered` pra esse contato e conferir se o **trigger**
      promoveu o status pra `customer` e atualizou `lifetime_value`. Esse é o
      teste que valida que o schema está vivo, não só criado.

---

## 3. Onde guardar as credenciais (5 min)

Você vai precisar delas em 3 lugares: `.env` do backend, `.env.local` do
frontend, e nos painéis de deploy (Railway/Vercel).

- [ ] Criar um arquivo local seguro (gerenciador de senhas ou `.env` fora do git)
      com tudo:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
SUPABASE_DB_PASSWORD=
```

- [ ] Confirmar que `.env` e `.env.local` estão no `.gitignore` (o Claude Code
      cuida disso, mas confira antes do primeiro push)

---

## 4. Railway (5 min) — só conectar, não criar projeto ainda

- [ ] Criar conta em railway.app
- [ ] Conectar com GitHub (autorizar acesso ao repo `sacolas-system`)
- [ ] **NÃO** criar projeto agora — só no Dia 6, quando `backend/` estiver pronto

---

## 5. Vercel (5 min) — só conectar, não criar projeto ainda

- [ ] Criar conta em vercel.com
- [ ] Conectar com GitHub
- [ ] **NÃO** importar projeto agora — só no Dia 6, com `frontend/` pronto

---

## 6. Exportar a agenda do dono (.vcf) — pode ser em paralelo

- [ ] Pedir pro dono exportar os contatos prefixados "SACOLA"
  - **iPhone**: Contatos → selecionar → Compartilhar → enviar `.vcf`
  - **Android**: Contatos → Configurações → Exportar → arquivo VCF
- [ ] Guardar o `.vcf` — vai ser usado pelo `import_vcard.py` no Dia 5

---

## Pronto quando...

Você terminou a trilha "você mesmo" do Dia 1 quando:

1. O repo existe e está conectado a Railway + Vercel
2. A Migration 001 rodou e o trigger foi validado com um pedido de teste
3. Todas as 5 credenciais do Supabase estão anotadas num lugar seguro

A partir daí o próximo bloco é Claude Code (scaffold do backend). Volte aqui
que eu escrevo os prompts prontos pra ele.
