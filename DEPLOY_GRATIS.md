# Deploy gratuito + importação dos contatos

Stack grátis: Vercel (frontend) + Render (backend) + Supabase (banco/auth, já em uso).
Pré-requisito: o repositório `sacolas-system` precisa estar no GitHub (Vercel e Render
fazem deploy a partir dele).

---

## Passo 0 — Ajuste no Dockerfile (Render usa a porta dele)

O Render injeta a porta via variável `$PORT`; o Dockerfile atual fixa 8000. Prompt p/ Claude Code:

> No backend/Dockerfile, troque o CMD pra usar a porta do ambiente:
> `CMD ["sh","-c","uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]`
> Commite e dê push. (Não muda nada local; só deixa o Render servir na porta certa.)

---

## Passo 1 — Backend no Render

1. render.com → criar conta (pode logar com GitHub) → New + → Web Service.
2. Conectar o repo `sacolas-system`.
3. Configurar:
   - Root Directory: `backend`
   - Runtime: detecta o Dockerfile sozinho (ou Python). Pode deixar no automático.
   - Instance Type: Free.
4. Environment → adicionar as variáveis (mesmas do backend/.env, com FRONTEND_URL ainda vazio):
   - APP_ENV=production
   - SUPABASE_URL=https://fznkhumbpknxjubijdzp.supabase.co
   - SUPABASE_SERVICE_ROLE_KEY=<sua service_role legada>
   - SUPABASE_ANON_KEY=<sua anon legada>
   - SUPABASE_JWT_SECRET=<Legacy JWT Secret>
   - FRONTEND_URL=https://temporario.vercel.app  (volta aqui no passo 3)
5. Create Web Service → aguardar o build → anotar a URL gerada (algo como
   `https://sacolas-backend.onrender.com`).
6. Testar: abrir `https://<url>/health` → deve responder {"status":"ok"} (a primeira vez
   demora ~1 min porque está acordando). `/docs` também deve abrir.

---

## Passo 2 — Frontend na Vercel

1. vercel.com → criar conta (login GitHub) → Add New → Project → importar `sacolas-system`.
2. Configurar:
   - Root Directory: `frontend`
   - Framework: Next.js (detecta sozinho)
3. Environment Variables:
   - NEXT_PUBLIC_SUPABASE_URL=https://fznkhumbpknxjubijdzp.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua anon legada>
   - NEXT_PUBLIC_API_URL=https://<url-do-render>.onrender.com/api/v1
4. Deploy → anotar a URL da Vercel (ex: `https://sacolas.vercel.app`).

---

## Passo 3 — Ligar os dois (CORS + Auth)

1. Render → seu serviço → Environment → editar FRONTEND_URL para a URL real da Vercel →
   salvar (o serviço reinicia e o CORS passa a aceitar a Vercel).
2. Supabase → Authentication → URL Configuration → adicionar a URL da Vercel em "Site URL"
   e em "Redirect URLs".
3. Supabase → Authentication → Users → Add user → criar o login do seu pai (email + senha,
   Auto Confirm ligado).

---

## Passo 4 — Instalar como app no celular do pai (PWA)

1. No celular dele, abrir a URL da Vercel no Chrome (Android) ou Safari (iPhone).
2. Fazer login.
3. Menu do navegador → "Adicionar à tela inicial". Vira um ícone de app, abre em tela cheia.
4. No computador é só abrir a mesma URL e logar — mesma conta, mesmos dados.

---

## (Opcional) Evitar o cold start do Render

O backend grátis hiberna após ~15 min parado. Pra mantê-lo acordado:
- cron-job.org (grátis) → criar um job que chama `https://<url-do-render>/health` a cada
  10 minutos. Mantém o serviço de pé dentro das ~750h/mês grátis do Render.
Sem isso, funciona igual — só a primeira abertura do dia que demora ~1 min.

---

## Importar os contatos do celular do pai

O script `scripts/import_vcard.py` já existe e escreve direto no Supabase (na nuvem), então
roda da sua máquina, uma vez, independente do deploy.

1. O pai exporta os contatos prefixados "SACOLA":
   - iPhone: app Contatos → selecionar os contatos → Compartilhar → enviar o arquivo .vcf.
   - Android: Contatos → Configurações → Exportar → arquivo VCF → enviar.
2. Você recebe o `.vcf` e roda:
   ```
   cd scripts
   pip install -r requirements.txt
   python import_vcard.py caminho/para/contatos.vcf
   ```
   (o script lê SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY do .env — use os mesmos do backend.)
3. O script: remove o prefixo "SACOLA", normaliza os telefones pra E.164, pula duplicados
   (por telefone), e importa todos como `lead` / source `imported`. Mostra um resumo antes
   de confirmar.

Observação: ~1.000 contatos entram como lead. Eles viram "cliente" automaticamente quando
você registrar o primeiro pedido confirmado de cada um (pela regra do trigger).
