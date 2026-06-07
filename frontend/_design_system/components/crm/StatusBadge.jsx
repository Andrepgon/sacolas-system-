import React from 'react'
import { injectStyles } from '../shared.jsx'

/* StatusBadge — maps the product's real statuses to a tone, a pt-BR label,
   and a dot. Handles BOTH contact statuses (lead/customer/inactive/churned)
   and the order pipeline (quote → … → paid/cancelled). Pass a known status
   key; unknown keys fall back to a neutral pill. */

const CSS = `
.scds-sb{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 10px;
  border-radius:var(--radius-full);font-family:var(--font-sans);font-size:12px;
  font-weight:var(--weight-medium);line-height:1;white-space:nowrap;}
.scds-sb__dot{width:6px;height:6px;border-radius:var(--radius-full);flex:none;}
.scds-sb--positive{background:var(--positive-tint);color:var(--positive-text);}
.scds-sb--positive .scds-sb__dot{background:var(--positive);}
.scds-sb--info{background:var(--info-tint);color:var(--info-color);}
.scds-sb--info .scds-sb__dot{background:var(--info-color);}
.scds-sb--amber{background:var(--accent-tint);color:var(--accent-hover);}
.scds-sb--amber .scds-sb__dot{background:var(--accent);}
.scds-sb--neutral{background:var(--slate-100);color:var(--slate-600);}
.scds-sb--neutral .scds-sb__dot{background:var(--slate-400);}
.scds-sb--faint{background:var(--slate-100);color:var(--slate-400);}
.scds-sb--faint .scds-sb__dot{background:var(--slate-300);}
.scds-sb--danger{background:var(--negative-tint);color:var(--negative);}
.scds-sb--danger .scds-sb__dot{background:var(--negative);}
`

const MAP = {
  // contacts
  lead:             { tone: 'neutral',  label: 'Lead' },
  customer:         { tone: 'positive', label: 'Cliente' },
  inactive:         { tone: 'faint',    label: 'Inativo' },
  churned:          { tone: 'faint',    label: 'Perdido' },
  // orders
  quote:            { tone: 'neutral',  label: 'Orçamento' },
  confirmed:        { tone: 'info',     label: 'Confirmado' },
  vector_pending:   { tone: 'info',     label: 'Aguardando vetor' },
  factory_pending:  { tone: 'info',     label: 'Na fábrica' },
  printing:         { tone: 'amber',    label: 'Em impressão' },
  ready_to_deliver: { tone: 'amber',    label: 'Pronto p/ entregar' },
  delivered:        { tone: 'positive', label: 'Entregue' },
  paid:             { tone: 'positive', label: 'Pago' },
  cancelled:        { tone: 'danger',   label: 'Cancelado' },
}

export function StatusBadge({ status, label, dot = true, className = '', ...props }) {
  injectStyles('statusbadge', CSS)
  const cfg = MAP[status] || { tone: 'neutral', label: label || status }
  return (
    <span className={`scds-sb scds-sb--${cfg.tone} ${className}`.trim()} {...props}>
      {dot && <span className="scds-sb__dot" />}
      {label || cfg.label}
    </span>
  )
}
