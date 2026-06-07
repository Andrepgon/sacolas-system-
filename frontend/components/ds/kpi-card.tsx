import * as React from 'react'
import { cn } from '@/lib/utils'

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  value: React.ReactNode
  delta?: React.ReactNode
  deltaDir?: 'up' | 'down' | 'flat'
  sub?: React.ReactNode
  alertSub?: boolean
}

const arrowMap = { up: '▲', down: '▼', flat: '–' } as const

const deltaToneMap = {
  up: 'text-[color:var(--positive)]',
  down: 'text-[color:var(--negative)]',
  flat: 'text-[color:var(--text-hint)]',
} as const

export function KpiCard({
  label,
  value,
  delta,
  deltaDir = 'up',
  sub,
  alertSub = false,
  className,
  ...props
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 bg-[var(--surface-muted)] rounded-lg p-4',
        className
      )}
      {...props}
    >
      <div className="text-[13px] text-[color:var(--text-secondary)]">{label}</div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-mono text-2xl leading-[1.1] font-medium tracking-[var(--tracking-tight)] text-[color:var(--text-primary)] tabular-nums">
          {value}
        </span>
        {delta != null ? (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-[13px] font-medium',
              deltaToneMap[deltaDir]
            )}
          >
            {arrowMap[deltaDir]} {delta}
          </span>
        ) : null}
      </div>
      {sub != null ? (
        <div
          className={cn(
            'text-xs',
            alertSub
              ? 'text-[color:var(--negative)]'
              : 'text-[color:var(--text-hint)]'
          )}
        >
          {sub}
        </div>
      ) : null}
    </div>
  )
}
