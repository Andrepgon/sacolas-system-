import React from 'react'
import { injectStyles } from '../shared.jsx'

/* Input — single-line text field. Hairline border, 6px radius, amber focus
   ring. 16px text on mobile (prevents iOS zoom), 14px from md up. */

const CSS = `
.scds-input{height:36px;width:100%;min-width:0;font-family:var(--font-sans);
  font-size:16px;color:var(--text-primary);background:var(--surface-card);
  border:1px solid var(--border-subtle);border-radius:var(--radius-md);
  padding:0 10px;outline:none;transition:border-color var(--duration-fast) var(--ease-standard),
  box-shadow var(--duration-fast) var(--ease-standard);}
.scds-input::placeholder{color:var(--text-hint);}
.scds-input:focus{border-color:var(--accent);box-shadow:var(--shadow-focus);}
.scds-input:disabled{background:var(--surface-muted);opacity:.6;cursor:not-allowed;}
.scds-input[aria-invalid="true"]{border-color:var(--negative);
  box-shadow:0 0 0 3px rgb(220 38 38 / .18);}
@media(min-width:768px){.scds-input{font-size:14px;}}
`

export function Input({ className = '', invalid = false, ...props }) {
  injectStyles('input', CSS)
  return (
    <input
      className={`scds-input ${className}`.trim()}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}
