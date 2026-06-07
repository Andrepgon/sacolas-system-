import * as React from 'react'

/**
 * AttentionItem — one actionable line in the "Precisa de atenção hoje" panel:
 * a tone dot, a label, a count, and a chevron to the filtered list.
 */
export interface AttentionItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Dot color. amber=at-risk, danger=high-risk, info=leads. @default 'amber' */
  tone?: 'amber' | 'danger' | 'info'
  label: React.ReactNode
  /** The count on the right. */
  count: React.ReactNode
}

export function AttentionItem(props: AttentionItemProps): React.JSX.Element
