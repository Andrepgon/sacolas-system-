import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Guard de rota: protege tudo exceto /login e assets PWA.
// Sem sessao Supabase -> redireciona pra /login.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas e assets que sempre passam livres
  const isLogin = pathname === '/login' || pathname.startsWith('/login/')
  const isStyleguide = pathname === '/styleguide' || pathname.startsWith('/styleguide/')
  if (isLogin || isStyleguide) return NextResponse.next()

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    // Aplica em tudo exceto assets do Next, manifest, ícones PWA, sw, workbox.
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|sw\\.js|workbox-.*).*)',
  ],
}
