import React from 'react'

/* Internal helpers — lowercase exports stay OFF the public namespace.
   Components are self-contained: React only + CSS custom properties from
   styles.css. Hover/focus/active states need real CSS, so each component
   injects a tiny scoped stylesheet once via injectStyles(). */

const _injected = new Set()

export function injectStyles(id, css) {
  if (typeof document === 'undefined') return
  if (_injected.has(id)) return
  _injected.add(id)
  const el = document.createElement('style')
  el.setAttribute('data-scds', id)
  el.textContent = css
  document.head.appendChild(el)
}

/* Minimal inline icons matching Lucide (outline, 1.75 stroke). Functional
   affordances only — chevrons, arrows, search, check, x, whatsapp. For
   anything richer, kits load real Lucide from CDN. */
export function Icon({ name, size = 16, strokeWidth = 1.75, style, ...rest }) {
  const paths = {
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    chevronRight: <polyline points="9 6 15 12 9 18" />,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    arrowUp: <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
    arrowDown: <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
    search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    home: <><path d="M3 9.5 12 3l9 6.5" /><path d="M5 9v11h14V9" /></>,
    users: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.2a3.2 3.2 0 0 1 0 6" /><path d="M17.5 20a5.5 5.5 0 0 0-3-4.9" /></>,
    package: <><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" /><path d="M3 7.5 12 12l9-4.5" /><line x1="12" y1="12" x2="12" y2="21" /></>,
    trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0z" /><path d="M7 6H4v1a3 3 0 0 0 3 3" /><path d="M17 6h3v1a3 3 0 0 1-3 3" /><line x1="12" y1="13" x2="12" y2="17" /><path d="M8 20h8" /><path d="M9 17h6v3H9z" /></>,
    phone: <path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" style={style} aria-hidden="true" {...rest}>
      {paths[name] || null}
    </svg>
  )
}

/* Derive 1–2 letter initials from a name, like the avatar in lists/tables. */
export function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
