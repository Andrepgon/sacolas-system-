import React from 'react'
import { injectStyles } from '../shared.jsx'

/* KpiCard — the dashboard metric card. Borderless slate-100 fill, a label,
   a big 24/500 mono value, an optional delta vs. previous period (▲ green /
   ▼ red), and an optional sub-line (ticket médio, LTV médio…). Every number
   answers a business question — that's why deltas and sublines exist. */

const CSS = `
.scds-kpi{background:var(--surface-muted);border-radius:var(--radius-lg);
  padding:var(--space-4);display:flex;flex-direction:column;gap:6px;}
.scds-kpi__label{font-size:13px;color:var(--text-secondary);}
.scds-kpi__row{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;}
.scds-kpi__value{font-family:var(--font-mono);font-size:var(--text-kpi-size);
  line-height:1.1;font-weight:var(--weight-medium);letter-spacing:var(--tracking-tight);
  color:var(--text-primary);font-variant-numeric:tabular-nums;}
.scds-kpi__delta{font-size:13px;font-weight:var(--weight-medium);display:inline-flex;align-items:center;gap:2px;}
.scds-kpi__delta--up{color:var(--positive);}
.scds-kpi__delta--down{color:var(--negative);}
.scds-kpi__delta--flat{color:var(--text-hint);}
.scds-kpi__sub{font-size:12px;color:var(--text-hint);}
.scds-kpi__sub--alert{color:var(--negative);}
`

export function KpiCard({ label, value, delta = null, deltaDir = 'up', sub = null, alertSub = false, className = '', ...props }) {
  injectStyles('kpi', CSS)
  const arrow = deltaDir === 'down' ? '▼' : deltaDir === 'flat' ? '–' : '▲'
  return (
    <div className={`scds-kpi ${className}`.trim()} {...props}>
      <div className="scds-kpi__label">{label}</div>
      <div className="scds-kpi__row">
        <span className="scds-kpi__value">{value}</span>
        {delta != null && (
          <span className={`scds-kpi__delta scds-kpi__delta--${deltaDir}`}>{arrow} {delta}</span>
        )}
      </div>
      {sub != null && <div className={`scds-kpi__sub${alertSub ? ' scds-kpi__sub--alert' : ''}`}>{sub}</div>}
    </div>
  )
}
