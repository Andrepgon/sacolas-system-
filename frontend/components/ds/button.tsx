import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-1.5',
    'font-sans font-medium whitespace-nowrap select-none',
    'border border-transparent rounded-md',
    'transition-colors duration-fast ease-standard',
    'outline-none focus-visible:shadow-focus',
    'active:not(:disabled):translate-y-px',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    '[&_svg]:shrink-0 [&_svg]:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-[var(--accent-hover)]',
        secondary:
          'bg-[var(--surface-muted)] text-[color:var(--text-primary)] hover:bg-[var(--slate-200)]',
        outline:
          'bg-[var(--surface-card)] text-[color:var(--text-primary)] border-[color:var(--border-subtle)] hover:bg-[var(--surface-muted)]',
        ghost:
          'bg-transparent text-[color:var(--text-primary)] hover:bg-[var(--surface-muted)]',
        destructive:
          'bg-[var(--negative-tint)] text-[color:var(--negative)] hover:bg-[#fde0e0]',
        link: 'bg-transparent text-primary p-0 h-auto hover:underline',
      },
      size: {
        sm: 'h-7 px-2.5 text-[13px]',
        default: 'h-8 px-3 text-sm',
        lg: 'h-[38px] px-4 text-sm',
        icon: 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant, size, iconLeft, iconRight, children, type, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {iconLeft}
        {children}
        {iconRight}
      </button>
    )
  }
)
