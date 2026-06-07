import React from 'react'
import { injectStyles, Icon } from '../shared.jsx'

/* AttentionItem — one line in the consolidated "Precisa de atenção hoje"
   panel. A colored dot (tone), a label, a count, and a chevron leading to the
   filtered list. Replaces the three stacked blocks of the old dashboard. */

const CSS = `
.scds-att{display:flex;align-items:center;gap:12px;width:100%;padding:12px 4px;
  border-bottom:1px solid var(--border-subtle);background:transparent;border-left:0;
  border-right:0;border-top:0;cursor:pointer;text-align:left;font-family:var(--font-sans);
  transition:background var(--duration-fast) var(--ease-standard);}
.scds-att:last-child{border-bottom:none;}
.scds-att:hover{background:var(--surface-hover);}
.scds-att__dot{width:8px;height:8px;border-radius:var(--radius-full);flex:none;}
.scds-att__dot--amber{background:var(--accent);}
.scds-att__dot--danger{background:var(--negative);}
.scds-att__dot--info{background:var(--info-color);}
.scds-att__label{flex:1;font-size:14px;color:var(--text-primary);}
.scds-att__count{font-family:var(--font-mono);font-size:14px;font-weight:var(--weight-medium);
  color:var(--text-primary);font-variant-numeric:tabular-nums;}
.scds-att__chev{color:var(--text-hint);flex:none;}
`

export function AttentionItem({ tone = 'amber', label, count, className = '', ...props }) {
  injectStyles('attention', CSS)
  return (
    <button type="button" className={`scds-att ${className}`.trim()} {...props}>
      <span className={`scds-att__dot scds-att__dot--${tone}`} />
      <span className="scds-att__label">{label}</span>
      <span className="scds-att__count">{count}</span>
      <Icon name="chevronRight" size={16} className="scds-att__chev" />
    </button>
  )
}
