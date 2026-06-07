import * as React from 'react'

export type SelectOption = string | { value: string; label: string }

/**
 * Select — styled native dropdown for filters and fixed lists (e.g. the
 * segment list: papelaria, restaurante, boutique, confeitaria, outro).
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  /** Options as strings or {value,label} pairs. */
  options: SelectOption[]
  value?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  /** Optional empty/placeholder first option. */
  placeholder?: string
}

export function Select(props: SelectProps): React.JSX.Element
