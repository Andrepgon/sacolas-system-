import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 h-[22px] px-2.5 rounded-full font-sans text-xs font-medium leading-none whitespace-nowrap',
  {
    variants: {
      variant: {
        customer: 'bg-[var(--positive-tint)] text-[color:var(--positive-text)]',
        lead: 'bg-[var(--slate-100)] text-[color:var(--slate-600)]',
        inactive: 'bg-[var(--slate-100)] text-[color:var(--slate-400)]',
        info: 'bg-[var(--info-tint)] text-[color:var(--info-color)]',
        success: 'bg-[var(--positive-tint)] text-[color:var(--positive-text)]',
        warning: 'bg-[var(--accent-tint)] text-[color:var(--accent-hover)]',
        destructive: 'bg-[var(--negative-tint)] text-[color:var(--negative)]',
        outline:
          'bg-transparent text-[color:var(--text-secondary)] shadow-[inset_0_0_0_1px_var(--border-subtle)]',
        accent: 'bg-primary text-primary-foreground',
      },
    },
    defaultVariants: { variant: 'lead' },
  }
)

const dotColor: Record<NonNullable<VariantProps<typeof badgeVariants>['variant']>, string> = {
  customer: 'bg-[var(--positive)]',
  lead: 'bg-[var(--slate-400)]',
  inactive: 'bg-[var(--slate-300)]',
  info: 'bg-[var(--info-color)]',
  success: 'bg-[var(--positive)]',
  warning: 'bg-primary',
  destructive: 'bg-[var(--negative)]',
  outline: 'bg-[var(--slate-400)]',
  accent: 'bg-primary-foreground',
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export function Badge({
  className,
  variant = 'lead',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const v = variant ?? 'lead'
  return (
    <span className={cn(badgeVariants({ variant: v }), className)} {...props}>
      {dot ? (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColor[v])}
        />
      ) : null}
      {children}
    </span>
  )
}
