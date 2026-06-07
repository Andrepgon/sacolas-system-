import React from 'react'
import { injectStyles } from '../shared.jsx'

/* Button — the system's action element. Variant `default` is the lone
   kraft-amber accent; use it for THE primary action only (Salvar, + Novo).
   Everything else is neutral (secondary / ghost / outline). */

const CSS = `
.scds-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  font-family:var(--font-sans);font-weight:var(--weight-medium);
  border:1px solid transparent;border-radius:var(--radius-md);cursor:pointer;
  white-space:nowrap;user-select:none;transition:background var(--duration-fast) var(--ease-standard),
  border-color var(--duration-fast) var(--ease-standard),color var(--duration-fast) var(--ease-standard);
  outline:none;}
.scds-btn:focus-visible{box-shadow:var(--shadow-focus);}
.scds-btn:active:not(:disabled){transform:translateY(1px);}
.scds-btn:disabled{opacity:.5;cursor:not-allowed;}
.scds-btn svg{flex:none;}
/* sizes */
.scds-btn--sm{height:28px;padding:0 10px;font-size:13px;}
.scds-btn--default{height:32px;padding:0 12px;font-size:14px;}
.scds-btn--lg{height:38px;padding:0 16px;font-size:14px;}
.scds-btn--icon{height:32px;width:32px;padding:0;}
/* variants */
.scds-btn--primary{background:var(--accent);color:var(--text-on-accent);}
.scds-btn--primary:hover:not(:disabled){background:var(--accent-hover);}
.scds-btn--secondary{background:var(--surface-muted);color:var(--text-primary);}
.scds-btn--secondary:hover:not(:disabled){background:var(--slate-200);}
.scds-btn--outline{background:var(--surface-card);color:var(--text-primary);border-color:var(--border-subtle);}
.scds-btn--outline:hover:not(:disabled){background:var(--surface-muted);}
.scds-btn--ghost{background:transparent;color:var(--text-primary);}
.scds-btn--ghost:hover:not(:disabled){background:var(--surface-muted);}
.scds-btn--destructive{background:var(--negative-tint);color:var(--negative);}
.scds-btn--destructive:hover:not(:disabled){background:#fde0e0;}
.scds-btn--link{background:transparent;color:var(--accent);height:auto;padding:0;}
.scds-btn--link:hover:not(:disabled){text-decoration:underline;}
`

export function Button({
  variant = 'primary',
  size = 'default',
  iconLeft = null,
  iconRight = null,
  className = '',
  children,
  ...props
}) {
  injectStyles('button', CSS)
  const cls = `scds-btn scds-btn--${size} scds-btn--${variant} ${className}`.trim()
  return (
    <button className={cls} {...props}>
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
