import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, invalid = false, ...props }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'h-9 w-full min-w-0 font-sans text-base md:text-sm text-[color:var(--text-primary)]',
          'bg-[var(--surface-card)] border border-[color:var(--border-subtle)] rounded-md',
          'px-2.5 outline-none',
          'placeholder:text-[color:var(--text-hint)]',
          'transition-[border-color,box-shadow] duration-fast ease-standard',
          'focus:border-primary focus:shadow-focus',
          'disabled:bg-[var(--surface-muted)] disabled:opacity-60 disabled:cursor-not-allowed',
          'aria-invalid:border-[color:var(--negative)] aria-invalid:shadow-[0_0_0_3px_rgb(220_38_38/.18)]',
          className
        )}
        {...props}
      />
    )
  }
)
