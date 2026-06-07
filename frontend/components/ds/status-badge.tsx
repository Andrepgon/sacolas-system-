import * as React from 'react'
import { cn } from '@/lib/utils'

export type ContactStatus = 'lead' | 'customer' | 'inactive' | 'churned'
export type OrderStatus =
  | 'quote'
  | 'confirmed'
  | 'vector_pending'
  | 'factory_pending'
  | 'printing'
  | 'ready_to_deliver'
  | 'delivered'
  | 'paid'
  | 'cancelled'

type Tone = 'positive' | 'info' | 'amber' | 'neutral' | 'faint' | 'danger'

const tone = {
  positive: {
    pill: 'bg-[var(--positive-tint)] text-[color:var(--positive-text)]',
    dot: 'bg-[var(--positive)]',
  },
  info: {
    pill: 'bg-[var(--info-tint)] text-[color:var(--info-color)]',
    dot: 'bg-[var(--info-color)]',
  },
  amber: {
    pill: 'bg-[var(--accent-tint)] text-[color:var(--accent-hover)]',
    dot: 'bg-primary',
  },
  neutral: {
    pill: 'bg-[var(--slate-100)] text-[color:var(--slate-600)]',
    dot: 'bg-[var(--slate-400)]',
  },
  faint: {
    pill: 'bg-[var(--slate-100)] text-[color:var(--slate-400)]',
    dot: 'bg-[var(--slate-300)]',
  },
  danger: {
    pill: 'bg-[var(--negative-tint)] text-[color:var(--negative)]',
    dot: 'bg-[var(--negative)]',
  },
} satisfies Record<Tone, { pill: string; dot: string }>

type Entry = { tone: Tone; label: string }

const MAP: Record<string, Entry> = {
  lead: { tone: 'neutral', label: 'Lead' },
  customer: { tone: 'positive', label: 'Cliente' },
  inactive: { tone: 'faint', label: 'Inativo' },
  churned: { tone: 'faint', label: 'Perdido' },
  quote: { tone: 'neutral', label: 'Orçamento' },
  confirmed: { tone: 'info', label: 'Confirmado' },
  vector_pending: { tone: 'info', label: 'Aguardando vetor' },
  factory_pending: { tone: 'info', label: 'Na fábrica' },
  printing: { tone: 'amber', label: 'Em impressão' },
  ready_to_deliver: { tone: 'amber', label: 'Pronto p/ entregar' },
  delivered: { tone: 'positive', label: 'Entregue' },
  paid: { tone: 'positive', label: 'Pago' },
  cancelled: { tone: 'danger', label: 'Cancelado' },
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: ContactStatus | OrderStatus | string
  label?: React.ReactNode
  dot?: boolean
}

export function StatusBadge({
  status,
  label,
  dot = true,
  className,
  ...props
}: StatusBadgeProps) {
  const cfg: Entry = MAP[status] ?? { tone: 'neutral', label: status }
  const t = tone[cfg.tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-[22px] px-2.5 rounded-full font-sans text-xs font-medium leading-none whitespace-nowrap',
        t.pill,
        className
      )}
      {...props}
    >
      {dot ? <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', t.dot)} /> : null}
      {label ?? cfg.label}
    </span>
  )
}
