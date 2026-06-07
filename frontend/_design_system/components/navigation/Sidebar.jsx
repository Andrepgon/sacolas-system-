import React from 'react'
import { injectStyles, Icon } from '../shared.jsx'

/* Sidebar — fixed 220px left rail (desktop). Items show an icon + label;
   the active item gets a slate-100 fill and a 2px amber accent bar. The lone
   amber "+ Novo" action sits with the items. Replaces the old site-style
   horizontal nav. */

const CSS = `
.scds-side{width:var(--sidebar-width);height:100%;background:var(--surface-card);
  border-right:1px solid var(--border-subtle);display:flex;flex-direction:column;
  padding:14px 12px;box-sizing:border-box;font-family:var(--font-sans);}
.scds-side__brand{display:flex;align-items:center;gap:9px;padding:6px 8px 16px;}
.scds-side__brand img{width:26px;height:26px;border-radius:7px;}
.scds-side__name{font-size:15px;font-weight:var(--weight-medium);color:var(--text-primary);letter-spacing:var(--tracking-tight);}
.scds-side__items{display:flex;flex-direction:column;gap:2px;}
.scds-side__item{position:relative;display:flex;align-items:center;gap:10px;
  padding:8px 10px;border-radius:var(--radius-md);font-size:14px;color:var(--text-secondary);
  cursor:pointer;background:transparent;border:0;width:100%;text-align:left;
  transition:background var(--duration-fast) var(--ease-standard),color var(--duration-fast) var(--ease-standard);}
.scds-side__item:hover{background:var(--surface-muted);color:var(--text-primary);}
.scds-side__item--active{background:var(--surface-muted);color:var(--text-primary);font-weight:var(--weight-medium);}
.scds-side__item--active::before{content:"";position:absolute;left:0;top:7px;bottom:7px;
  width:2px;border-radius:2px;background:var(--accent);}
.scds-side__item svg{flex:none;color:inherit;}
.scds-side__sep{height:1px;background:var(--border-subtle);margin:10px 4px;}
.scds-side__new{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--radius-md);
  font-size:14px;font-weight:var(--weight-medium);background:var(--accent);color:var(--text-on-accent);
  cursor:pointer;border:0;width:100%;justify-content:center;}
.scds-side__new:hover{background:var(--accent-hover);}
`

const DEFAULT_ITEMS = [
  { key: 'overview', label: 'Visão geral', icon: 'home' },
  { key: 'contacts', label: 'Clientes', icon: 'users' },
  { key: 'orders', label: 'Pedidos', icon: 'package' },
  { key: 'top', label: 'Melhores clientes', icon: 'trophy' },
]

export function Sidebar({ items = DEFAULT_ITEMS, active = 'overview', onNavigate, onNew, logoSrc = null, brand = 'Sacolas', className = '', ...props }) {
  injectStyles('sidebar', CSS)
  return (
    <nav className={`scds-side ${className}`.trim()} {...props}>
      <div className="scds-side__brand">
        {logoSrc && <img src={logoSrc} alt="" />}
        <span className="scds-side__name">{brand}</span>
      </div>
      <div className="scds-side__items">
        {items.map((it) => (
          <button key={it.key} type="button"
            className={`scds-side__item${it.key === active ? ' scds-side__item--active' : ''}`}
            onClick={() => onNavigate && onNavigate(it.key)}>
            <Icon name={it.icon} size={17} />
            {it.label}
          </button>
        ))}
      </div>
      <div className="scds-side__sep" />
      <button type="button" className="scds-side__new" onClick={onNew}>
        <Icon name="plus" size={16} /> Novo
      </button>
    </nav>
  )
}
