import * as React from 'react'

/**
 * Button — primary action element. `primary` is the single kraft-amber accent;
 * reserve it for the main action. Neutral variants for everything else.
 *
 * @startingPoint section="Core" subtitle="Action button — amber primary + neutral variants" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Use `primary` (amber) for the one main action only. */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  /** Control height. @default 'default' */
  size?: 'sm' | 'default' | 'lg' | 'icon'
  /** Icon node rendered before the label. */
  iconLeft?: React.ReactNode
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode
}

export function Button(props: ButtonProps): React.JSX.Element
