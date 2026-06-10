import * as React from 'react'
import {
  Home,
  Users,
  Package,
  Trophy,
  Plus,
  Megaphone,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NavItem {
  key: string
  label: string
  icon: IconName
}

export type IconName =
  | 'home'
  | 'users'
  | 'package'
  | 'trophy'
  | 'plus'
  | 'megaphone'

const iconMap: Record<IconName, LucideIcon> = {
  home: Home,
  users: Users,
  package: Package,
  trophy: Trophy,
  plus: Plus,
  megaphone: Megaphone,
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavItem[]
  active?: string
  onNavigate?: (key: string) => void
  onNew?: () => void
  logoSrc?: string | null
  brand?: string
}

const DEFAULT_ITEMS: NavItem[] = [
  { key: 'overview', label: 'Visão geral', icon: 'home' },
  { key: 'contacts', label: 'Clientes', icon: 'users' },
  { key: 'orders', label: 'Pedidos', icon: 'package' },
  { key: 'top', label: 'Melhores clientes', icon: 'trophy' },
]

export function Sidebar({
  items = DEFAULT_ITEMS,
  active = 'overview',
  onNavigate,
  onNew,
  logoSrc = null,
  brand = 'Sacolas',
  className,
  ...props
}: SidebarProps) {
  return (
    <nav
      className={cn(
        'h-full flex flex-col font-sans box-border bg-[var(--surface-card)]',
        'w-[var(--sidebar-width)] border-r border-[color:var(--border-subtle)]',
        'p-3 pt-3.5',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 px-2 pb-4 pt-1.5">
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoSrc} alt="" className="w-[26px] h-[26px] rounded-[7px]" />
        ) : null}
        <span className="text-[15px] font-medium text-[color:var(--text-primary)] tracking-[var(--tracking-tight)]">
          {brand}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((it) => {
          const Icon = iconMap[it.icon] ?? Home
          const isActive = it.key === active
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onNavigate?.(it.key)}
              className={cn(
                'relative flex items-center gap-2.5 w-full text-left',
                'px-2.5 py-2 rounded-md text-sm bg-transparent border-0 cursor-pointer',
                'transition-colors duration-fast ease-standard',
                isActive
                  ? 'bg-[var(--surface-muted)] text-[color:var(--text-primary)] font-medium'
                  : 'text-[color:var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[color:var(--text-primary)]'
              )}
            >
              {isActive ? (
                <span className="absolute left-0 top-[7px] bottom-[7px] w-[2px] rounded-sm bg-primary" />
              ) : null}
              <Icon size={17} strokeWidth={1.75} className="shrink-0" />
              {it.label}
            </button>
          )
        })}
      </div>
      <div className="h-px bg-[color:var(--border-subtle)] mx-1 my-2.5" />
      <button
        type="button"
        onClick={onNew}
        className={cn(
          'flex items-center justify-center gap-2 w-full px-2.5 py-2 rounded-md',
          'text-sm font-medium bg-primary text-primary-foreground border-0 cursor-pointer',
          'transition-colors duration-fast ease-standard',
          'hover:bg-[var(--accent-hover)]'
        )}
      >
        <Plus size={16} strokeWidth={1.75} /> Novo
      </button>
    </nav>
  )
}
