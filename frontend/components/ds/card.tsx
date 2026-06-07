import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  muted?: boolean
  interactive?: boolean
  padded?: boolean
  title?: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    muted = false,
    interactive = false,
    padded = true,
    title = null,
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg text-[color:var(--text-primary)]',
        muted
          ? 'bg-[var(--surface-muted)] border border-transparent'
          : 'bg-[var(--surface-card)] border border-[color:var(--border-subtle)]',
        padded && 'p-4 md:p-6',
        interactive &&
          'cursor-pointer transition-colors duration-fast ease-standard hover:bg-[var(--surface-hover)]',
        className
      )}
      {...props}
    >
      {title ? (
        <div className="text-sm font-medium text-[color:var(--text-primary)] mb-3">
          {title}
        </div>
      ) : null}
      {children}
    </div>
  )
})
