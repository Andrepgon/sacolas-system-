import * as React from 'react'
import { cn } from '@/lib/utils'
import { initials } from './_utils'
import { StatusBadge, type ContactStatus } from './status-badge'

export interface ContactRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  business?: string
  phone?: string
  status?: ContactStatus | string
  ltv?: React.ReactNode
  lastOrder?: React.ReactNode
}

export function ContactRow({
  name,
  business,
  phone,
  status = 'lead',
  ltv,
  lastOrder,
  className,
  ...props
}: ContactRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3.5 py-3 bg-[var(--surface-card)] cursor-pointer',
        'border-b border-[color:var(--border-subtle)] last:border-b-0',
        'transition-colors duration-fast ease-standard',
        'hover:bg-[var(--surface-hover)]',
        className
      )}
      {...props}
    >
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--slate-100)] text-[color:var(--slate-600)] text-[13px] font-medium uppercase shrink-0">
        {initials(name)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[color:var(--text-primary)] truncate">
          {name}
        </div>
        <div className="text-xs text-[color:var(--text-secondary)] truncate">
          {business || phone}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <StatusBadge status={status} />
        {ltv != null ? (
          <span className="font-mono text-[13px] font-medium text-[color:var(--text-primary)] tabular-nums">
            {ltv}
          </span>
        ) : null}
        {lastOrder ? (
          <span className="text-[11px] text-[color:var(--text-hint)]">
            {lastOrder}
          </span>
        ) : null}
      </div>
    </div>
  )
}
