import * as React from 'react'

/**
 * KpiCard — dashboard metric card: label, big mono value, optional delta vs.
 * previous period, and an optional sub-line (ticket médio, LTV médio).
 *
 * @startingPoint section="CRM" subtitle="Dashboard KPI metric card with delta" viewport="320x140"
 */
export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metric label, e.g. "Receita do mês". */
  label: React.ReactNode
  /** The metric value (pre-formatted), e.g. "R$ 12.480". */
  value: React.ReactNode
  /** Delta text vs. previous period, e.g. "18%". Omit for no delta. */
  delta?: React.ReactNode
  /** Direction of the delta arrow + color. @default 'up' */
  deltaDir?: 'up' | 'down' | 'flat'
  /** Secondary line under the value, e.g. "Ticket médio R$ 312". */
  sub?: React.ReactNode
  /** Render the sub-line in red (e.g. leads without reply). @default false */
  alertSub?: boolean
}

export function KpiCard(props: KpiCardProps): React.JSX.Element
