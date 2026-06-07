import * as React from 'react'

/**
 * Card — base surface. White with a slate-200 hairline and radius-lg, leaning
 * on the border rather than shadow. `muted` switches to a borderless slate-100
 * fill (KPI/metric cards).
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Borderless slate-100 fill instead of white + border. @default false */
  muted?: boolean
  /** Add hover state + pointer cursor (clickable cards). @default false */
  interactive?: boolean
  /** Apply standard padding (16 mobile / 24 desktop). @default true */
  padded?: boolean
  /** Optional 14/500 card title rendered at the top. */
  title?: React.ReactNode
}

export function Card(props: CardProps): React.JSX.Element
