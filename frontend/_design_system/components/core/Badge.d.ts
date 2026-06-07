import * as React from 'react'

/**
 * Badge — small status pill. Subtle tints only, never loud solids.
 * Covers the product's contact statuses plus generic semantic tones.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tone. Status tones map the CRM vocabulary; semantic tones are generic. */
  variant?: 'customer' | 'lead' | 'inactive' | 'info' | 'success' | 'warning' | 'destructive' | 'outline' | 'accent'
  /** Show a leading colored dot. @default false */
  dot?: boolean
}

export function Badge(props: BadgeProps): React.JSX.Element
