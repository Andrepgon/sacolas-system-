# Checklist Meta — WhatsApp Coexistence (Fase 2)

Passos MANUAIS que voce (Andre) faz nos paineis da Meta. Nada disso e codigo. O Coexistence
mantem o numero atual do seu pai no app do WhatsApp Business E na Cloud API ao mesmo tempo, e
importa ate ~6 meses de conversas 1:1 no onboarding.

## 0. Pre-requisito que TRAVA tudo (confirmar antes de comecar)
- [ ] O numero do seu pai esta no app **WhatsApp Business** (nao no WhatsApp comum/pessoal).
      Coexistence so funciona com o app Business (os campos de webhook tem prefixo "smb" =
      small/medium business). Se ele usa o WhatsApp comum, primeiro migrar pro app WhatsApp
      Business (o app preserva as conversas) — isso e gratis e nao perde historico.
- [ ] App WhatsApp Business atualizado (versao recente, requisito do Coexistence).

## 1. Meta Business + verificacao
- [ ] Criar/confirmar a conta no **Meta Business Manager**.
- [ ] Iniciar a **verificacao de negocio** (pede CNPJ e documentos). E o passo MAIS LENTO —
      comece por ele, roda em paralelo com o resto.

## 2. App no Meta for Developers
- [ ] Criar um App (tipo Business) no developers.facebook.com.
- [ ] Adicionar o produto **WhatsApp**.
- [ ] Anotar o **App Secret** (vira WHATSAPP_APP_SECRET no Render) e o ID do app.

## 3. Onboarding do numero em Coexistence (Embedded Signup)
- [ ] Rodar o fluxo de **Embedded Signup** com Coexistence habilitado.
- [ ] No app do WhatsApp Business do seu pai: Configuracoes -> escanear o QR do Embedded Signup
      pra vincular o numero a Cloud API (sem migrar/sem perder o app).
- [ ] **Aprovar o compartilhamento do historico** quando perguntado (e isso que dispara o
      webhook `history` com ate ~6 meses). Se recusar, nao vem historico.
- [ ] Aprovar o **nome de exibicao**.
- [ ] Anotar o **Phone Number ID** (vira WHATSAPP_PHONE_NUMBER_ID).

## 4. Token permanente
- [ ] Criar um **System User** no Business Manager.
- [ ] Gerar um **token permanente** com as permissoes `whatsapp_business_messaging` e
      `whatsapp_business_management` (vira WHATSAPP_ACCESS_TOKEN).

## 5. Configurar o webhook (apontar pra Fase 2)
- [ ] No painel do app (WhatsApp -> Configuration), Callback URL =
      `https://sacolas-system.onrender.com/webhooks/whatsapp`.
- [ ] Verify Token = um valor secreto que voce inventa (o MESMO que vai em WHATSAPP_VERIFY_TOKEN
      no Render). A Meta faz um GET de verificacao; o endpoint F2-A responde o challenge.
- [ ] Assinar (Subscribe) os campos: **messages**, **smb_message_echoes**, **history**,
      **smb_app_state_sync**. (statuses de entrega vem dentro de `messages`.)

## 6. Variaveis de ambiente no Render (nunca commitar)
- [ ] WHATSAPP_VERIFY_TOKEN  = o verify token do passo 5
- [ ] WHATSAPP_APP_SECRET    = App Secret do passo 2
- [ ] WHATSAPP_ACCESS_TOKEN  = token permanente do passo 4
- [ ] WHATSAPP_PHONE_NUMBER_ID = Phone Number ID do passo 3

## 7. Keep-alive (Render free hiberna)
- [ ] Criar um job gratis no cron-job.org pingando
      `https://sacolas-system.onrender.com/health` a cada ~10 min, pra o webhook nao dormir.

## Custo (confirmar no momento da ativacao)
- Coexistence em si: gratis.
- Receber e responder DENTRO da janela de 24h (conversa iniciada pelo cliente): service, ~zero
  (ha 1.000 service gratis/mes). O fluxo da Fase 2 (ler + responder quem chamou) cai aqui.
- O que e PAGO e a Fase 5 (mensagens iniciadas por voce fora da janela = templates de
  marketing/utility). Nao e desta fase.

## Ordem recomendada
Passo 0 e 1 (verificacao) primeiro, em paralelo. Enquanto a Meta verifica, o Claude Code ja pode
construir o webhook (prompts F2-A..F) contra a migration 008. Quando a verificacao sair, faz o
onboarding Coexistence (passo 3) e o `history` popula a base.
