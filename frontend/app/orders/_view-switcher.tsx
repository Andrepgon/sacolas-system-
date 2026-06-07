'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function OrdersViewSwitcher({ mode }: { mode: 'list' | 'board' }) {
  return (
    <div
      role="tablist"
      aria-label="Visão de pedidos"
      className="inline-flex rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-0.5"
    >
      <Link
        href="/orders"
        role="tab"
        aria-selected={mode === 'list'}
        className={cn(
          'rounded px-3 py-1.5 text-sm transition-colors',
          mode === 'list'
            ? 'bg-[var(--surface-hover)] font-medium text-[color:var(--text-primary)]'
            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
        )}
      >
        Lista
      </Link>
      <Link
        href="/orders/board"
        role="tab"
        aria-selected={mode === 'board'}
        className={cn(
          'rounded px-3 py-1.5 text-sm transition-colors',
          mode === 'board'
            ? 'bg-[var(--surface-hover)] font-medium text-[color:var(--text-primary)]'
            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
        )}
      >
        Quadro
      </Link>
    </div>
  )
}
