import * as React from 'react'

/**
 * Sidebar — fixed 220px desktop left rail. Active item gets a slate-100 fill
 * + 2px amber accent bar. Includes the lone amber "+ Novo" action.
 *
 * @startingPoint section="Navigation" subtitle="Desktop left sidebar nav" viewport="220x420"
 */
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Nav items; defaults to the CRM set (Visão geral, Clientes, Pedidos, Melhores clientes). */
  items?: NavItem[]
  /** Active item key. */
  active?: string
  onNavigate?: (key: string) => void
  onNew?: () => void
  /** Optional brand logo URL. */
  logoSrc?: string | null
  /** Brand wordmark. @default 'Sacolas' */
  brand?: string
}

export function Sidebar(props: SidebarProps): React.JSX.Element

export interface NavItem {
  key: string
  label: string
  /** Icon name from the system Icon set (home, users, package, trophy…). */
  icon: string
}
