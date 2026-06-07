import React from 'react'
import { injectStyles, Icon } from '../shared.jsx'

/* Select — styled wrapper over a native <select> (works everywhere, no
   portal). Same hairline/focus language as Input, with a chevron. Replaces
   the ugly native dropdowns for filters and the fixed segment list. */

const CSS = `
.scds-select{position:relative;display:inline-flex;align-items:center;width:100%;}
.scds-select select{appearance:none;-webkit-appearance:none;height:36px;width:100%;
  font-family:var(--font-sans);font-size:14px;color:var(--text-primary);
  background:var(--surface-card);border:1px solid var(--border-subtle);
  border-radius:var(--radius-md);padding:0 32px 0 10px;outline:none;cursor:pointer;
  transition:border-color var(--duration-fast) var(--ease-standard),box-shadow var(--duration-fast) var(--ease-standard);}
.scds-select select:focus{border-color:var(--accent);box-shadow:var(--shadow-focus);}
.scds-select select:disabled{background:var(--surface-muted);opacity:.6;cursor:not-allowed;}
.scds-select__chev{position:absolute;right:10px;color:var(--text-secondary);pointer-events:none;}
`

export function Select({ options = [], value, onChange, placeholder, className = '', ...props }) {
  injectStyles('select', CSS)
  return (
    <span className={`scds-select ${className}`.trim()}>
      <select value={value} onChange={onChange} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o
          return <option key={opt.value} value={opt.value}>{opt.label}</option>
        })}
      </select>
      <Icon name="chevronDown" size={16} className="scds-select__chev" />
    </span>
  )
}
