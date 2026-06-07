import React from 'react'
import { injectStyles, initials } from '../shared.jsx'

/* Avatar — circle of initials, slate-100 fill / slate-600 text. Used in
   contact lists and the top-clients table. Neutral by design; never amber. */

const CSS = `
.scds-avatar{display:inline-flex;align-items:center;justify-content:center;
  border-radius:var(--radius-full);background:var(--slate-100);color:var(--slate-600);
  font-family:var(--font-sans);font-weight:var(--weight-medium);flex:none;
  text-transform:uppercase;letter-spacing:.01em;overflow:hidden;}
.scds-avatar img{width:100%;height:100%;object-fit:cover;}
.scds-avatar--sm{width:28px;height:28px;font-size:11px;}
.scds-avatar--default{width:36px;height:36px;font-size:13px;}
.scds-avatar--lg{width:44px;height:44px;font-size:15px;}
`

export function Avatar({ name = '', src = null, size = 'default', className = '', ...props }) {
  injectStyles('avatar', CSS)
  return (
    <span className={`scds-avatar scds-avatar--${size} ${className}`.trim()} {...props}>
      {src ? <img src={src} alt={name} /> : initials(name)}
    </span>
  )
}
