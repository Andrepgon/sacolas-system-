import React from 'react'
import { injectStyles } from '../shared.jsx'

/* Badge — small status pill. Subtle tints, never loud solids. Maps the
   product's real statuses (customer / lead / inactive) plus generic
   semantic tones. Optional leading dot. */

const CSS = `
.scds-badge{display:inline-flex;align-items:center;gap:6px;height:22px;
  padding:0 10px;border-radius:var(--radius-full);font-family:var(--font-sans);
  font-size:12px;font-weight:var(--weight-medium);line-height:1;white-space:nowrap;}
.scds-badge__dot{width:6px;height:6px;border-radius:var(--radius-full);flex:none;}
.scds-badge--customer{background:var(--positive-tint);color:var(--positive-text);}
.scds-badge--customer .scds-badge__dot{background:var(--positive);}
.scds-badge--lead{background:var(--slate-100);color:var(--slate-600);}
.scds-badge--lead .scds-badge__dot{background:var(--slate-400);}
.scds-badge--inactive{background:var(--slate-100);color:var(--slate-400);}
.scds-badge--inactive .scds-badge__dot{background:var(--slate-300);}
.scds-badge--info{background:var(--info-tint);color:var(--info-color);}
.scds-badge--info .scds-badge__dot{background:var(--info-color);}
.scds-badge--success{background:var(--positive-tint);color:var(--positive-text);}
.scds-badge--success .scds-badge__dot{background:var(--positive);}
.scds-badge--warning{background:var(--accent-tint);color:var(--accent-hover);}
.scds-badge--warning .scds-badge__dot{background:var(--accent);}
.scds-badge--destructive{background:var(--negative-tint);color:var(--negative);}
.scds-badge--destructive .scds-badge__dot{background:var(--negative);}
.scds-badge--outline{background:transparent;color:var(--text-secondary);box-shadow:inset 0 0 0 1px var(--border-subtle);}
.scds-badge--outline .scds-badge__dot{background:var(--slate-400);}
.scds-badge--accent{background:var(--accent);color:var(--text-on-accent);}
`

export function Badge({ variant = 'lead', dot = false, className = '', children, ...props }) {
  injectStyles('badge', CSS)
  return (
    <span className={`scds-badge scds-badge--${variant} ${className}`.trim()} {...props}>
      {dot && <span className="scds-badge__dot" />}
      {children}
    </span>
  )
}
