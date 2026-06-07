import * as React from 'react'
import type { ContactStatus } from './StatusBadge'

/**
 * ContactRow — a dense line in the contacts list: initials avatar, name,
 * business/phone, status badge, and LTV. Separated by hairline dividers
 * rather than floating cards ("app table" density).
 */
export interface ContactRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  /** Business name (shown if present, else phone). */
  business?: string
  phone?: string
  status?: ContactStatus | string
  /** Pre-formatted lifetime value, e.g. "R$ 2.480". */
  ltv?: React.ReactNode
  /** Relative last-order text, e.g. "há 12 dias". */
  lastOrder?: React.ReactNode
}

export function ContactRow(props: ContactRowProps): React.JSX.Element
