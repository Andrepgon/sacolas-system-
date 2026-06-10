'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  BottomTabBar,
  Sidebar,
  type BottomTabItem,
  type NavItem,
} from '@/components/ds'

const NAV_ITEMS: NavItem[] = [
  { key: 'overview', label: 'Visão geral', icon: 'home' },
  { key: 'contacts', label: 'Clientes', icon: 'users' },
  { key: 'orders', label: 'Pedidos', icon: 'package' },
  { key: 'campanhas', label: 'Campanhas', icon: 'megaphone' },
  { key: 'top', label: 'Melhores clientes', icon: 'trophy' },
]

const TAB_ITEMS: BottomTabItem[] = [
  { key: 'overview', label: 'Visão', icon: 'home' },
  { key: 'contacts', label: 'Clientes', icon: 'users' },
  { key: 'new', label: 'Novo', icon: 'plus', isNew: true },
  { key: 'campanhas', label: 'Campanhas', icon: 'megaphone' },
  { key: 'orders', label: 'Pedidos', icon: 'package' },
]

const ROUTES: Record<string, string> = {
  overview: '/',
  contacts: '/contacts',
  orders: '/orders',
  top: '/clientes/top',
  campanhas: '/campanhas',
  new: '/contacts/new',
}

function activeKey(pathname: string): string {
  if (pathname === '/') return 'overview'
  if (pathname.startsWith('/contacts')) return 'contacts'
  if (pathname.startsWith('/orders')) return 'orders'
  if (pathname.startsWith('/campanhas')) return 'campanhas'
  if (pathname.startsWith('/clientes/top')) return 'top'
  if (pathname.startsWith('/views')) return 'overview'
  return ''
}

function isChromelessRoute(pathname: string): boolean {
  return pathname === '/login' || pathname.startsWith('/login/') || pathname.startsWith('/styleguide')
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/'
  const router = useRouter()

  if (isChromelessRoute(pathname)) {
    return <>{children}</>
  }

  const active = activeKey(pathname)

  function go(key: string) {
    const href = ROUTES[key]
    if (href) router.push(href)
  }

  return (
    <div className="flex min-h-screen bg-[var(--surface-page)]">
      <aside className="sticky top-0 hidden h-screen shrink-0 md:block">
        <Sidebar
          items={NAV_ITEMS}
          active={active}
          onNavigate={go}
          onNew={() => router.push('/contacts/new')}
        />
      </aside>
      <div className="flex flex-1 min-w-0 flex-col">
        <main className="flex-1 pb-[var(--tabbar-height)] md:pb-0">
          {children}
        </main>
        <nav className="sticky bottom-0 z-20 md:hidden">
          <BottomTabBar items={TAB_ITEMS} active={active} onNavigate={go} />
        </nav>
      </div>
    </div>
  )
}
