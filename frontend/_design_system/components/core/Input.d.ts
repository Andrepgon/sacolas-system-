import * as React from 'react'

/**
 * Input — single-line text field with hairline border and amber focus ring.
 * 16px text on mobile to avoid iOS zoom; 14px from md up.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Render the error state (red border + ring). @default false */
  invalid?: boolean
}

export function Input(props: InputProps): React.JSX.Element
