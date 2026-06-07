import * as React from 'react'
import { Home, Users, Package, Trophy, Plus, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IconName, NavItem } from './sidebar'

const iconMap: Record<IconName, LucideIcon> = {
  home: Home,
  users: Users,
  package: Package,
  trophy: Trophy,
  plus: Plus,
}

export interface BottomTabItem extends NavItem {
  isNew?: boolean
}

export interface BottomTabBarProps extends React.HTMLAttributes<HTMLElement> {
  items?: BottomTabItem[]
  active?: string
  onNavigate?: (key: string) => void
}

const DEFAULT_ITEMS: BottomTabItem[] = [
  { key: 'overview', label: 'Visão', icon: 'home' },
  { key: 'contacts', label: 'Clientes', icon: 'users' },
  { key: 'new', label: 'Novo', icon: 'plus', isNew: true },
  { key: 'orders', label: 'Pedidos', icon: 'package' },
  { key: 'top', label: 'Top', icon: 'trophy' },
]

export function BottomTabBar({
  items = DEFAULT_ITEMS,
  active = 'overview',
  onNavigate,
  className,
  ...props
}: BottomTabBarProps) {
  return (
    <nav
      className={cn(
        'relative w-full h-[var(--tabbar-height)] box-border flex font-sans',
        'bg-[var(--surface-card)] border-t border-[color:var(--border-subtle)]',
        className
      )}
      {...props}
    >
      {items.map((it) => {
        const Icon = iconMap[it.icon] ?? Home
        const isActive = it.key === active
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onNavigate?.(it.key)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-[3px]',
              'bg-transparent border-0 cursor-pointer px-0.5 py-1.5',
              'text-[10.5px] font-medium',
              'transition-colors duration-fast ease-standard',
              it.isNew
                ? 'text-[color:var(--text-secondary)]'
                : isActive
                  ? 'text-primary'
                  : 'text-[color:var(--text-hint)]'
            )}
          >
            {it.isNew ? (
              <span className="w-[30px] h-[30px] rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Plus size={18} strokeWidth={1.75} />
              </span>
            ) : (
              <Icon size={20} strokeWidth={1.75} />
            )}
            {it.label}
          </button>
        )
      })}
    </nav>
  )
}
