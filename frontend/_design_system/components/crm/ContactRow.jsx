import React from 'react'
import { injectStyles, initials } from '../shared.jsx'
import { StatusBadge } from './StatusBadge.jsx'

/* ContactRow — one line in the contacts list. Avatar of initials + name +
   business/phone, with status badge and LTV on the right. Designed as a
   dense "app table" row separated by 0.5px dividers, not a floating card. */

const CSS = `
.scds-crow{display:flex;align-items:center;gap:12px;padding:12px 14px;
  border-bottom:1px solid var(--border-subtle);cursor:pointer;background:var(--surface-card);
  transition:background var(--duration-fast) var(--ease-standard);}
.scds-crow:last-child{border-bottom:none;}
.scds-crow:hover{background:var(--surface-hover);}
.scds-crow__av{width:36px;height:36px;border-radius:var(--radius-full);flex:none;
  display:inline-flex;align-items:center;justify-content:center;background:var(--slate-100);
  color:var(--slate-600);font-size:13px;font-weight:var(--weight-medium);text-transform:uppercase;}
.scds-crow__main{flex:1;min-width:0;}
.scds-crow__name{font-size:14px;font-weight:var(--weight-medium);color:var(--text-primary);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.scds-crow__sub{font-size:12px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.scds-crow__right{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex:none;}
.scds-crow__ltv{font-family:var(--font-mono);font-size:13px;font-weight:var(--weight-medium);
  color:var(--text-primary);font-variant-numeric:tabular-nums;}
.scds-crow__when{font-size:11px;color:var(--text-hint);}
`

export function ContactRow({ name, business, phone, status = 'lead', ltv = null, lastOrder = null, className = '', ...props }) {
  injectStyles('contactrow', CSS)
  return (
    <div className={`scds-crow ${className}`.trim()} {...props}>
      <span className="scds-crow__av">{initials(name)}</span>
      <div className="scds-crow__main">
        <div className="scds-crow__name">{name}</div>
        <div className="scds-crow__sub">{business || phone}</div>
      </div>
      <div className="scds-crow__right">
        <StatusBadge status={status} />
        {ltv != null && <span className="scds-crow__ltv">{ltv}</span>}
        {lastOrder && <span className="scds-crow__when">{lastOrder}</span>}
      </div>
    </div>
  )
}
