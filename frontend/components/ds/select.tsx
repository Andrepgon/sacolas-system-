import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SelectOption = string | { value: string; label: string }

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[]
  value?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { options, value, onChange, placeholder, className, ...props },
    ref
  ) {
    return (
      <span className={cn('relative inline-flex items-center w-full', className)}>
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            'appearance-none h-9 w-full font-sans text-sm text-[color:var(--text-primary)]',
            'bg-[var(--surface-card)] border border-[color:var(--border-subtle)] rounded-md',
            'pl-2.5 pr-8 outline-none cursor-pointer',
            'transition-[border-color,box-shadow] duration-fast ease-standard',
            'focus:border-primary focus:shadow-focus',
            'disabled:bg-[var(--surface-muted)] disabled:opacity-60 disabled:cursor-not-allowed'
          )}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            )
          })}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-2.5 text-[color:var(--text-secondary)] pointer-events-none"
        />
      </span>
    )
  }
)
