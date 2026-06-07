import * as React from 'react'

/**
 * Avatar — circle of initials (slate-100 / slate-600), or an image if `src`
 * is given. Used in contact lists and the top-clients table.
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full name; initials are derived from it. */
  name?: string
  /** Optional image URL; falls back to initials when absent. */
  src?: string | null
  /** @default 'default' */
  size?: 'sm' | 'default' | 'lg'
}

export function Avatar(props: AvatarProps): React.JSX.Element
