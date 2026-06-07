import React from 'react'
import { injectStyles } from '../shared.jsx'

/* Card — the base surface. White, slate-200 hairline, radius-lg. Leans on
   the border, not shadow. `muted` drops the border for a slate-100 fill
   (used by KPI/metric cards). `interactive` adds hover + pointer. */

const CSS = `
.scds-card{background:var(--surface-card);border:1px solid var(--border-subtle);
  border-radius:var(--radius-lg);color:var(--text-primary);}
.scds-card--pad{padding:var(--space-4);}
@media(min-width:768px){.scds-card--pad{padding:var(--space-6);}}
.scds-card--muted{background:var(--surface-muted);border-color:transparent;}
.scds-card--interactive{cursor:pointer;transition:background var(--duration-fast) var(--ease-standard),
  border-color var(--duration-fast) var(--ease-standard);}
.scds-card--interactive:hover{background:var(--surface-hover);}
.scds-card__title{font-size:var(--text-card-size);font-weight:var(--weight-medium);
  color:var(--text-primary);}
`

export function Card({
  muted = false,
  interactive = false,
  padded = true,
  title = null,
  className = '',
  children,
  ...props
}) {
  injectStyles('card', CSS)
  const cls = [
    'scds-card',
    padded && 'scds-card--pad',
    muted && 'scds-card--muted',
    interactive && 'scds-card--interactive',
    className,
  ].filter(Boolean).join(' ')
  return (
    <div className={cls} {...props}>
      {title && <div className="scds-card__title" style={{ marginBottom: 'var(--space-3)' }}>{title}</div>}
      {children}
    </div>
  )
}
