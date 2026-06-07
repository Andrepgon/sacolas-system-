import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AttentionItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'amber' | 'danger' | 'info'
  label: React.ReactNode
  count: React.ReactNode
}

const dotMap = {
  amber: 'bg-primary',
  danger: 'bg-[var(--negative)]',
  info: 'bg-[var(--info-color)]',
} as const

export const AttentionItem = React.forwardRef<HTMLButtonElement, AttentionItemProps>(
  function AttentionItem(
    { tone = 'amber', label, count, className, type, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cn(
          'flex items-center gap-3 w-full px-1 py-3 text-left bg-transparent font-sans',
          'border-b border-[color:var(--border-subtle)] last:border-b-0',
          'cursor-pointer transition-colors duration-fast ease-standard',
          'hover:bg-[var(--surface-hover)]',
          className
        )}
        {...props}
      >
        <span className={cn('h-2 w-2 rounded-full shrink-0', dotMap[tone])} />
        <span className="flex-1 text-sm text-[color:var(--text-primary)]">
          {label}
        </span>
        <span className="font-mono text-sm font-medium text-[color:var(--text-primary)] tabular-nums">
          {count}
        </span>
        <ChevronRight
          size={16}
          className="text-[color:var(--text-hint)] shrink-0"
        />
      </button>
    )
  }
)
