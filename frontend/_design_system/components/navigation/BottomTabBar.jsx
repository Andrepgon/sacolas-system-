import React from 'react'
import { injectStyles, Icon } from '../shared.jsx'

/* BottomTabBar — the mobile counterpart of Sidebar. Fixed bottom, 4–5 icons
   with labels; the active tab tints amber. This is the real mobile-first nav
   (the owner's phone). */

const CSS = `
.scds-tabs{position:relative;height:var(--tabbar-height);width:100%;display:flex;
  background:var(--surface-card);border-top:1px solid var(--border-subtle);
  font-family:var(--font-sans);box-sizing:border-box;}
.scds-tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;background:transparent;border:0;cursor:pointer;color:var(--text-hint);
  font-size:10.5px;font-weight:var(--weight-medium);padding:6px 2px;
  transition:color var(--duration-fast) var(--ease-standard);}
.scds-tab svg{flex:none;}
.scds-tab--active{color:var(--accent);}
.scds-tab--new{color:var(--text-secondary);}
.scds-tab--new .scds-tab__plus{width:30px;height:30px;border-radius:var(--radius-full);
  background:var(--accent);color:var(--text-on-accent);display:flex;align-items:center;justify-content:center;}
`

const DEFAULT_ITEMS = [
  { key: 'overview', label: 'Visão', icon: 'home' },
  { key: 'contacts', label: 'Clientes', icon: 'users' },
  { key: 'new', label: 'Novo', icon: 'plus', isNew: true },
  { key: 'orders', label: 'Pedidos', icon: 'package' },
  { key: 'top', label: 'Top', icon: 'trophy' },
]

export function BottomTabBar({ items = DEFAULT_ITEMS, active = 'overview', onNavigate, className = '', ...props }) {
  injectStyles('tabbar', CSS)
  return (
    <nav className={`scds-tabs ${className}`.trim()} {...props}>
      {items.map((it) => {
        const isActive = it.key === active
        const cls = `scds-tab${isActive ? ' scds-tab--active' : ''}${it.isNew ? ' scds-tab--new' : ''}`
        return (
          <button key={it.key} type="button" className={cls} onClick={() => onNavigate && onNavigate(it.key)}>
            {it.isNew
              ? <span className="scds-tab__plus"><Icon name="plus" size={18} /></span>
              : <Icon name={it.icon} size={20} />}
            {it.label}
          </button>
        )
      })}
    </nav>
  )
}
