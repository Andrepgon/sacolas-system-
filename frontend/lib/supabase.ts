import { createBrowserClient } from '@supabase/ssr'

// Cliente Supabase no browser — usado pra auth (login + sessão).
// Reusa a mesma criação que aparece inline no lib/api.ts (seção 6.4 do EXECUCAO.md).
export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
