import * as React from 'react'

export type ContactStatus = 'lead' | 'customer' | 'inactive' | 'churned'
export type OrderStatus =
  | 'quote' | 'confirmed' | 'vector_pending' | 'factory_pending' | 'printing'
  | 'ready_to_deliver' | 'delivered' | 'paid' | 'cancelled'

/**
 * StatusBadge — maps a contact or order status key to the right tone, pt-BR
 * label, and dot. Single source of truth for status color in the product.
 */
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** A known contact or order status key. */
  status: ContactStatus | OrderStatus | string
  /** Override the auto label. */
  label?: React.ReactNode
  /** Show the leading dot. @default true */
  dot?: boolean
}

export function StatusBadge(props: StatusBadgeProps): React.JSX.Element
