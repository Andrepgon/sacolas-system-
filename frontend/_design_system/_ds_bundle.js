/* @ds-bundle: {"format":3,"namespace":"SacolasCRMDesignSystem_553a9b","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"AttentionItem","sourcePath":"components/crm/AttentionItem.jsx"},{"name":"ContactRow","sourcePath":"components/crm/ContactRow.jsx"},{"name":"KpiCard","sourcePath":"components/crm/KpiCard.jsx"},{"name":"StatusBadge","sourcePath":"components/crm/StatusBadge.jsx"},{"name":"BottomTabBar","sourcePath":"components/navigation/BottomTabBar.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"Icon","sourcePath":"components/shared.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"b665777472fe","components/core/Badge.jsx":"4f0f7ef2de77","components/core/Button.jsx":"23cb2bc1dd09","components/core/Card.jsx":"63daeec01a55","components/core/Input.jsx":"aa25e0b8d3bb","components/core/Select.jsx":"d4646b01bee5","components/crm/AttentionItem.jsx":"8f182b0265f7","components/crm/ContactRow.jsx":"17c4b23344be","components/crm/KpiCard.jsx":"d7a3a2c3bdac","components/crm/StatusBadge.jsx":"856d3e6c4b1b","components/navigation/BottomTabBar.jsx":"a2a1ab5b7a4e","components/navigation/Sidebar.jsx":"3efb49096ba8","components/shared.jsx":"c46e2323048c","ui_kits/crm/App.jsx":"00fee5f4dc81","ui_kits/crm/ContactDetail.jsx":"1165eb47f673","ui_kits/crm/Contacts.jsx":"7a4d23d24fd7","ui_kits/crm/Dashboard.jsx":"362e471b762d","ui_kits/crm/NewContact.jsx":"172cf199b117","ui_kits/crm/OrderForm.jsx":"ed60fb0a4700","ui_kits/crm/TopClients.jsx":"d2c0c63bad28","ui_kits/crm/ViewList.jsx":"b15abb8de368","ui_kits/crm/data.js":"6fb7282836a9","ui_kits/crm/lib.jsx":"807845d731b1"},"inlinedExternals":[],"unexposedExports":[{"name":"initials","sourcePath":"components/shared.jsx"},{"name":"injectStyles","sourcePath":"components/shared.jsx"}]} */

(() => {

const __ds_ns = (window.SacolasCRMDesignSystem_553a9b = window.SacolasCRMDesignSystem_553a9b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/shared.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Internal helpers — lowercase exports stay OFF the public namespace.
   Components are self-contained: React only + CSS custom properties from
   styles.css. Hover/focus/active states need real CSS, so each component
   injects a tiny scoped stylesheet once via injectStyles(). */

const _injected = new Set();
function injectStyles(id, css) {
  if (typeof document === 'undefined') return;
  if (_injected.has(id)) return;
  _injected.add(id);
  const el = document.createElement('style');
  el.setAttribute('data-scds', id);
  el.textContent = css;
  document.head.appendChild(el);
}

/* Minimal inline icons matching Lucide (outline, 1.75 stroke). Functional
   affordances only — chevrons, arrows, search, check, x, whatsapp. For
   anything richer, kits load real Lucide from CDN. */
function Icon({
  name,
  size = 16,
  strokeWidth = 1.75,
  style,
  ...rest
}) {
  const paths = {
    chevronDown: /*#__PURE__*/React.createElement("polyline", {
      points: "6 9 12 15 18 9"
    }),
    chevronRight: /*#__PURE__*/React.createElement("polyline", {
      points: "9 6 15 12 9 18"
    }),
    arrowRight: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 5 19 12 12 19"
    })),
    arrowUp: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "19",
      x2: "12",
      y2: "5"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "5 12 12 5 19 12"
    })),
    arrowDown: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "19 12 12 19 5 12"
    })),
    search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "21",
      x2: "16.65",
      y2: "16.65"
    })),
    check: /*#__PURE__*/React.createElement("polyline", {
      points: "20 6 9 17 4 12"
    }),
    x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "18",
      y1: "6",
      x2: "6",
      y2: "18"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "6",
      y1: "6",
      x2: "18",
      y2: "18"
    })),
    plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    })),
    home: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 9.5 12 3l9 6.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 9v11h14V9"
    })),
    users: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "8",
      r: "3.2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3.5 20a5.5 5.5 0 0 1 11 0"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 5.2a3.2 3.2 0 0 1 0 6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M17.5 20a5.5 5.5 0 0 0-3-4.9"
    })),
    package: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 7.5 12 12l9-4.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "12",
      x2: "12",
      y2: "21"
    })),
    trophy: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M7 4h10v4a5 5 0 0 1-10 0z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 6H4v1a3 3 0 0 0 3 3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M17 6h3v1a3 3 0 0 1-3 3"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "13",
      x2: "12",
      y2: "17"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 20h8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 17h6v3H9z"
    })),
    phone: /*#__PURE__*/React.createElement("path", {
      d: "M5 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"
    })
  };
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: style,
    "aria-hidden": "true"
  }, rest), paths[name] || null);
}

/* Derive 1–2 letter initials from a name, like the avatar in lists/tables. */
function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
Object.assign(__ds_scope, { injectStyles, Icon, initials });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shared.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
`;
function Avatar({
  name = '',
  src = null,
  size = 'default',
  className = '',
  ...props
}) {
  __ds_scope.injectStyles('avatar', CSS);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `scds-avatar scds-avatar--${size} ${className}`.trim()
  }, props), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : __ds_scope.initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Badge — small status pill. Subtle tints, never loud solids. Maps the
   product's real statuses (customer / lead / inactive) plus generic
   semantic tones. Optional leading dot. */

const CSS = `
.scds-badge{display:inline-flex;align-items:center;gap:6px;height:22px;
  padding:0 10px;border-radius:var(--radius-full);font-family:var(--font-sans);
  font-size:12px;font-weight:var(--weight-medium);line-height:1;white-space:nowrap;}
.scds-badge__dot{width:6px;height:6px;border-radius:var(--radius-full);flex:none;}
.scds-badge--customer{background:var(--positive-tint);color:var(--positive-text);}
.scds-badge--customer .scds-badge__dot{background:var(--positive);}
.scds-badge--lead{background:var(--slate-100);color:var(--slate-600);}
.scds-badge--lead .scds-badge__dot{background:var(--slate-400);}
.scds-badge--inactive{background:var(--slate-100);color:var(--slate-400);}
.scds-badge--inactive .scds-badge__dot{background:var(--slate-300);}
.scds-badge--info{background:var(--info-tint);color:var(--info-color);}
.scds-badge--info .scds-badge__dot{background:var(--info-color);}
.scds-badge--success{background:var(--positive-tint);color:var(--positive-text);}
.scds-badge--success .scds-badge__dot{background:var(--positive);}
.scds-badge--warning{background:var(--accent-tint);color:var(--accent-hover);}
.scds-badge--warning .scds-badge__dot{background:var(--accent);}
.scds-badge--destructive{background:var(--negative-tint);color:var(--negative);}
.scds-badge--destructive .scds-badge__dot{background:var(--negative);}
.scds-badge--outline{background:transparent;color:var(--text-secondary);box-shadow:inset 0 0 0 1px var(--border-subtle);}
.scds-badge--outline .scds-badge__dot{background:var(--slate-400);}
.scds-badge--accent{background:var(--accent);color:var(--text-on-accent);}
`;
function Badge({
  variant = 'lead',
  dot = false,
  className = '',
  children,
  ...props
}) {
  __ds_scope.injectStyles('badge', CSS);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `scds-badge scds-badge--${variant} ${className}`.trim()
  }, props), dot && /*#__PURE__*/React.createElement("span", {
    className: "scds-badge__dot"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Button — the system's action element. Variant `default` is the lone
   kraft-amber accent; use it for THE primary action only (Salvar, + Novo).
   Everything else is neutral (secondary / ghost / outline). */

const CSS = `
.scds-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  font-family:var(--font-sans);font-weight:var(--weight-medium);
  border:1px solid transparent;border-radius:var(--radius-md);cursor:pointer;
  white-space:nowrap;user-select:none;transition:background var(--duration-fast) var(--ease-standard),
  border-color var(--duration-fast) var(--ease-standard),color var(--duration-fast) var(--ease-standard);
  outline:none;}
.scds-btn:focus-visible{box-shadow:var(--shadow-focus);}
.scds-btn:active:not(:disabled){transform:translateY(1px);}
.scds-btn:disabled{opacity:.5;cursor:not-allowed;}
.scds-btn svg{flex:none;}
/* sizes */
.scds-btn--sm{height:28px;padding:0 10px;font-size:13px;}
.scds-btn--default{height:32px;padding:0 12px;font-size:14px;}
.scds-btn--lg{height:38px;padding:0 16px;font-size:14px;}
.scds-btn--icon{height:32px;width:32px;padding:0;}
/* variants */
.scds-btn--primary{background:var(--accent);color:var(--text-on-accent);}
.scds-btn--primary:hover:not(:disabled){background:var(--accent-hover);}
.scds-btn--secondary{background:var(--surface-muted);color:var(--text-primary);}
.scds-btn--secondary:hover:not(:disabled){background:var(--slate-200);}
.scds-btn--outline{background:var(--surface-card);color:var(--text-primary);border-color:var(--border-subtle);}
.scds-btn--outline:hover:not(:disabled){background:var(--surface-muted);}
.scds-btn--ghost{background:transparent;color:var(--text-primary);}
.scds-btn--ghost:hover:not(:disabled){background:var(--surface-muted);}
.scds-btn--destructive{background:var(--negative-tint);color:var(--negative);}
.scds-btn--destructive:hover:not(:disabled){background:#fde0e0;}
.scds-btn--link{background:transparent;color:var(--accent);height:auto;padding:0;}
.scds-btn--link:hover:not(:disabled){text-decoration:underline;}
`;
function Button({
  variant = 'primary',
  size = 'default',
  iconLeft = null,
  iconRight = null,
  className = '',
  children,
  ...props
}) {
  __ds_scope.injectStyles('button', CSS);
  const cls = `scds-btn scds-btn--${size} scds-btn--${variant} ${className}`.trim();
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, props), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Card — the base surface. White, slate-200 hairline, radius-lg. Leans on
   the border, not shadow. `muted` drops the border for a slate-100 fill
   (used by KPI/metric cards). `interactive` adds hover + pointer. */

const CSS = `
.scds-card{background:var(--surface-card);border:1px solid var(--border-subtle);
  border-radius:var(--radius-lg);color:var(--text-primary);}
.scds-card--pad{padding:var(--space-4);}
@media(min-width:768px){.scds-card--pad{padding:var(--space-6);}}
.scds-card--muted{background:var(--surface-muted);border-color:transparent;}
.scds-card--interactive{cursor:pointer;transition:background var(--duration-fast) var(--ease-standard),
  border-color var(--duration-fast) var(--ease-standard);}
.scds-card--interactive:hover{background:var(--surface-hover);}
.scds-card__title{font-size:var(--text-card-size);font-weight:var(--weight-medium);
  color:var(--text-primary);}
`;
function Card({
  muted = false,
  interactive = false,
  padded = true,
  title = null,
  className = '',
  children,
  ...props
}) {
  __ds_scope.injectStyles('card', CSS);
  const cls = ['scds-card', padded && 'scds-card--pad', muted && 'scds-card--muted', interactive && 'scds-card--interactive', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, props), title && /*#__PURE__*/React.createElement("div", {
    className: "scds-card__title",
    style: {
      marginBottom: 'var(--space-3)'
    }
  }, title), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Input — single-line text field. Hairline border, 6px radius, amber focus
   ring. 16px text on mobile (prevents iOS zoom), 14px from md up. */

const CSS = `
.scds-input{height:36px;width:100%;min-width:0;font-family:var(--font-sans);
  font-size:16px;color:var(--text-primary);background:var(--surface-card);
  border:1px solid var(--border-subtle);border-radius:var(--radius-md);
  padding:0 10px;outline:none;transition:border-color var(--duration-fast) var(--ease-standard),
  box-shadow var(--duration-fast) var(--ease-standard);}
.scds-input::placeholder{color:var(--text-hint);}
.scds-input:focus{border-color:var(--accent);box-shadow:var(--shadow-focus);}
.scds-input:disabled{background:var(--surface-muted);opacity:.6;cursor:not-allowed;}
.scds-input[aria-invalid="true"]{border-color:var(--negative);
  box-shadow:0 0 0 3px rgb(220 38 38 / .18);}
@media(min-width:768px){.scds-input{font-size:14px;}}
`;
function Input({
  className = '',
  invalid = false,
  ...props
}) {
  __ds_scope.injectStyles('input', CSS);
  return /*#__PURE__*/React.createElement("input", _extends({
    className: `scds-input ${className}`.trim(),
    "aria-invalid": invalid || undefined
  }, props));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
`;
function Select({
  options = [],
  value,
  onChange,
  placeholder,
  className = '',
  ...props
}) {
  __ds_scope.injectStyles('select', CSS);
  return /*#__PURE__*/React.createElement("span", {
    className: `scds-select ${className}`.trim()
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange
  }, props), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevronDown",
    size: 16,
    className: "scds-select__chev"
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/crm/AttentionItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* AttentionItem — one line in the consolidated "Precisa de atenção hoje"
   panel. A colored dot (tone), a label, a count, and a chevron leading to the
   filtered list. Replaces the three stacked blocks of the old dashboard. */

const CSS = `
.scds-att{display:flex;align-items:center;gap:12px;width:100%;padding:12px 4px;
  border-bottom:1px solid var(--border-subtle);background:transparent;border-left:0;
  border-right:0;border-top:0;cursor:pointer;text-align:left;font-family:var(--font-sans);
  transition:background var(--duration-fast) var(--ease-standard);}
.scds-att:last-child{border-bottom:none;}
.scds-att:hover{background:var(--surface-hover);}
.scds-att__dot{width:8px;height:8px;border-radius:var(--radius-full);flex:none;}
.scds-att__dot--amber{background:var(--accent);}
.scds-att__dot--danger{background:var(--negative);}
.scds-att__dot--info{background:var(--info-color);}
.scds-att__label{flex:1;font-size:14px;color:var(--text-primary);}
.scds-att__count{font-family:var(--font-mono);font-size:14px;font-weight:var(--weight-medium);
  color:var(--text-primary);font-variant-numeric:tabular-nums;}
.scds-att__chev{color:var(--text-hint);flex:none;}
`;
function AttentionItem({
  tone = 'amber',
  label,
  count,
  className = '',
  ...props
}) {
  __ds_scope.injectStyles('attention', CSS);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: `scds-att ${className}`.trim()
  }, props), /*#__PURE__*/React.createElement("span", {
    className: `scds-att__dot scds-att__dot--${tone}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "scds-att__label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "scds-att__count"
  }, count), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevronRight",
    size: 16,
    className: "scds-att__chev"
  }));
}
Object.assign(__ds_scope, { AttentionItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/crm/AttentionItem.jsx", error: String((e && e.message) || e) }); }

// components/crm/KpiCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
`;
function KpiCard({
  label,
  value,
  delta = null,
  deltaDir = 'up',
  sub = null,
  alertSub = false,
  className = '',
  ...props
}) {
  __ds_scope.injectStyles('kpi', CSS);
  const arrow = deltaDir === 'down' ? '▼' : deltaDir === 'flat' ? '–' : '▲';
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `scds-kpi ${className}`.trim()
  }, props), /*#__PURE__*/React.createElement("div", {
    className: "scds-kpi__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "scds-kpi__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "scds-kpi__value"
  }, value), delta != null && /*#__PURE__*/React.createElement("span", {
    className: `scds-kpi__delta scds-kpi__delta--${deltaDir}`
  }, arrow, " ", delta)), sub != null && /*#__PURE__*/React.createElement("div", {
    className: `scds-kpi__sub${alertSub ? ' scds-kpi__sub--alert' : ''}`
  }, sub));
}
Object.assign(__ds_scope, { KpiCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/crm/KpiCard.jsx", error: String((e && e.message) || e) }); }

// components/crm/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
`;
const MAP = {
  // contacts
  lead: {
    tone: 'neutral',
    label: 'Lead'
  },
  customer: {
    tone: 'positive',
    label: 'Cliente'
  },
  inactive: {
    tone: 'faint',
    label: 'Inativo'
  },
  churned: {
    tone: 'faint',
    label: 'Perdido'
  },
  // orders
  quote: {
    tone: 'neutral',
    label: 'Orçamento'
  },
  confirmed: {
    tone: 'info',
    label: 'Confirmado'
  },
  vector_pending: {
    tone: 'info',
    label: 'Aguardando vetor'
  },
  factory_pending: {
    tone: 'info',
    label: 'Na fábrica'
  },
  printing: {
    tone: 'amber',
    label: 'Em impressão'
  },
  ready_to_deliver: {
    tone: 'amber',
    label: 'Pronto p/ entregar'
  },
  delivered: {
    tone: 'positive',
    label: 'Entregue'
  },
  paid: {
    tone: 'positive',
    label: 'Pago'
  },
  cancelled: {
    tone: 'danger',
    label: 'Cancelado'
  }
};
function StatusBadge({
  status,
  label,
  dot = true,
  className = '',
  ...props
}) {
  __ds_scope.injectStyles('statusbadge', CSS);
  const cfg = MAP[status] || {
    tone: 'neutral',
    label: label || status
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `scds-sb scds-sb--${cfg.tone} ${className}`.trim()
  }, props), dot && /*#__PURE__*/React.createElement("span", {
    className: "scds-sb__dot"
  }), label || cfg.label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/crm/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/crm/ContactRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
`;
function ContactRow({
  name,
  business,
  phone,
  status = 'lead',
  ltv = null,
  lastOrder = null,
  className = '',
  ...props
}) {
  __ds_scope.injectStyles('contactrow', CSS);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `scds-crow ${className}`.trim()
  }, props), /*#__PURE__*/React.createElement("span", {
    className: "scds-crow__av"
  }, __ds_scope.initials(name)), /*#__PURE__*/React.createElement("div", {
    className: "scds-crow__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "scds-crow__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "scds-crow__sub"
  }, business || phone)), /*#__PURE__*/React.createElement("div", {
    className: "scds-crow__right"
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    status: status
  }), ltv != null && /*#__PURE__*/React.createElement("span", {
    className: "scds-crow__ltv"
  }, ltv), lastOrder && /*#__PURE__*/React.createElement("span", {
    className: "scds-crow__when"
  }, lastOrder)));
}
Object.assign(__ds_scope, { ContactRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/crm/ContactRow.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomTabBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
`;
const DEFAULT_ITEMS = [{
  key: 'overview',
  label: 'Visão',
  icon: 'home'
}, {
  key: 'contacts',
  label: 'Clientes',
  icon: 'users'
}, {
  key: 'new',
  label: 'Novo',
  icon: 'plus',
  isNew: true
}, {
  key: 'orders',
  label: 'Pedidos',
  icon: 'package'
}, {
  key: 'top',
  label: 'Top',
  icon: 'trophy'
}];
function BottomTabBar({
  items = DEFAULT_ITEMS,
  active = 'overview',
  onNavigate,
  className = '',
  ...props
}) {
  __ds_scope.injectStyles('tabbar', CSS);
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: `scds-tabs ${className}`.trim()
  }, props), items.map(it => {
    const isActive = it.key === active;
    const cls = `scds-tab${isActive ? ' scds-tab--active' : ''}${it.isNew ? ' scds-tab--new' : ''}`;
    return /*#__PURE__*/React.createElement("button", {
      key: it.key,
      type: "button",
      className: cls,
      onClick: () => onNavigate && onNavigate(it.key)
    }, it.isNew ? /*#__PURE__*/React.createElement("span", {
      className: "scds-tab__plus"
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "plus",
      size: 18
    })) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 20
    }), it.label);
  }));
}
Object.assign(__ds_scope, { BottomTabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomTabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
`;
const DEFAULT_ITEMS = [{
  key: 'overview',
  label: 'Visão geral',
  icon: 'home'
}, {
  key: 'contacts',
  label: 'Clientes',
  icon: 'users'
}, {
  key: 'orders',
  label: 'Pedidos',
  icon: 'package'
}, {
  key: 'top',
  label: 'Melhores clientes',
  icon: 'trophy'
}];
function Sidebar({
  items = DEFAULT_ITEMS,
  active = 'overview',
  onNavigate,
  onNew,
  logoSrc = null,
  brand = 'Sacolas',
  className = '',
  ...props
}) {
  __ds_scope.injectStyles('sidebar', CSS);
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: `scds-side ${className}`.trim()
  }, props), /*#__PURE__*/React.createElement("div", {
    className: "scds-side__brand"
  }, logoSrc && /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "scds-side__name"
  }, brand)), /*#__PURE__*/React.createElement("div", {
    className: "scds-side__items"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.key,
    type: "button",
    className: `scds-side__item${it.key === active ? ' scds-side__item--active' : ''}`,
    onClick: () => onNavigate && onNavigate(it.key)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: 17
  }), it.label))), /*#__PURE__*/React.createElement("div", {
    className: "scds-side__sep"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "scds-side__new",
    onClick: onNew
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 16
  }), " Novo"));
}
Object.assign(__ds_scope, { Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/App.jsx
try { (() => {
/* App shell — sidebar/tabbar + screen router. Click-through interactive. */

function App() {
  const [screen, setScreen] = React.useState('overview');
  const [selected, setSelected] = React.useState(null);
  const [viewVariant, setViewVariant] = React.useState('reativar');
  function navigate(key) {
    setSelected(null);
    setScreen(key);
  }
  function openContact(c) {
    setSelected(c);
    setScreen('detail');
  }
  function newContact() {
    setScreen('new');
  }
  function newOrder(c) {
    setSelected(c || null);
    setScreen('newOrder');
  }
  function openView(v) {
    setViewVariant(v);
    setScreen('view');
  }
  const activeNav = screen === 'detail' || screen === 'new' || screen === 'newOrder' || screen === 'view' ? screen === 'view' ? 'overview' : 'contacts' : screen;
  let view;
  if (screen === 'overview') view = /*#__PURE__*/React.createElement(Dashboard, {
    onNavigate: navigate,
    onOpenView: openView
  });else if (screen === 'contacts') view = /*#__PURE__*/React.createElement(Contacts, {
    onOpen: openContact,
    onNew: newContact
  });else if (screen === 'orders' || screen === 'top') view = /*#__PURE__*/React.createElement(TopClients, {
    onOpen: openContact
  });else if (screen === 'new') view = /*#__PURE__*/React.createElement(NewContact, {
    onCancel: () => navigate('contacts'),
    onSave: () => navigate('contacts')
  });else if (screen === 'newOrder') view = /*#__PURE__*/React.createElement(OrderForm, {
    prefillContact: selected,
    onCancel: () => selected ? openContact(selected) : navigate('contacts'),
    onSave: () => selected ? openContact(selected) : navigate('contacts')
  });else if (screen === 'view') view = /*#__PURE__*/React.createElement(ViewList, {
    variant: viewVariant,
    onOpen: openContact,
    onChangeVariant: setViewVariant
  });else if (screen === 'detail' && selected) view = /*#__PURE__*/React.createElement(ContactDetail, {
    contact: selected,
    onBack: () => navigate('contacts'),
    onNewOrder: newOrder
  });else view = /*#__PURE__*/React.createElement(Dashboard, {
    onNavigate: navigate,
    onOpenView: openView
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("div", {
    className: "app__rail"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    active: activeNav,
    onNavigate: navigate,
    onNew: newContact
  })), /*#__PURE__*/React.createElement("div", {
    className: "app__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "app__scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, view)), /*#__PURE__*/React.createElement("div", {
    className: "app__tabbar"
  }, /*#__PURE__*/React.createElement(BottomTabBar, {
    active: activeNav,
    onNavigate: navigate,
    onNew: newContact
  }))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/ContactDetail.jsx
try { (() => {
/* Contato (detalhe) — header with status, WhatsApp + Pedido actions, metrics,
   and the order history with pipeline status badges. */

function ContactDetail({
  contact,
  onBack,
  onNewOrder
}) {
  const c = contact;
  const orders = window.KIT_ORDERS && window.KIT_ORDERS[c.id] || [{
    id: 'o1',
    model: 'Kraft 28×35 · alça torcida',
    qty: 500,
    total: 1480,
    status: 'paid',
    date: '12/03/2026'
  }, {
    id: 'o2',
    model: 'Kraft 18×22 · alça chata',
    qty: 300,
    total: 720,
    status: 'printing',
    date: '02/04/2026'
  }, {
    id: 'o3',
    model: 'Kraft 40×45 · reforçada',
    qty: 200,
    total: 980,
    status: 'vector_pending',
    date: '28/04/2026'
  }];
  const wa = `https://wa.me/55${(c.phone || '').replace(/\D/g, '')}`;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "backlink",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowLeft",
    size: 16
  }), " Clientes"), /*#__PURE__*/React.createElement("div", {
    className: "detail-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-head__id"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: c.name
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "phead__title"
  }, c.name), /*#__PURE__*/React.createElement("div", {
    className: "detail-head__meta"
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: c.status
  }), /*#__PURE__*/React.createElement("span", {
    className: "sb sb--neutral",
    style: {
      textTransform: 'capitalize'
    }
  }, c.segment), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 13
    }
  }, c.phone)))), /*#__PURE__*/React.createElement("div", {
    className: "detail-head__actions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--wa",
    href: wa,
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "whatsapp",
    size: 16
  }), " WhatsApp"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }),
    onClick: () => onNewOrder && onNewOrder(c)
  }, "Pedido"))), /*#__PURE__*/React.createElement("div", {
    className: "metrics"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi__label"
  }, "Pedidos"), /*#__PURE__*/React.createElement("div", {
    className: "kpi__value"
  }, c.orders)), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi__label"
  }, "LTV"), /*#__PURE__*/React.createElement("div", {
    className: "kpi__value"
  }, "R$ ", c.ltv.toLocaleString('pt-BR'))), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi__label"
  }, "\xDAltima compra"), /*#__PURE__*/React.createElement("div", {
    className: "kpi__value",
    style: {
      fontSize: 16,
      fontFamily: 'var(--font-sans)'
    }
  }, c.lastOrder || '—')), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi__label"
  }, "Ticket m\xE9dio"), /*#__PURE__*/React.createElement("div", {
    className: "kpi__value"
  }, "R$ ", c.orders ? Math.round(c.ltv / c.orders).toLocaleString('pt-BR') : 0))), /*#__PURE__*/React.createElement("div", {
    className: "card section-gap",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card--pad",
    style: {
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title",
    style: {
      marginBottom: 0
    }
  }, "Pedidos")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 0'
    }
  }, orders.map(o => /*#__PURE__*/React.createElement("div", {
    className: "orow",
    key: o.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "orow__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "orow__model"
  }, o.model), /*#__PURE__*/React.createElement("div", {
    className: "orow__meta"
  }, "Qtd. ", o.qty, " \xB7 ", o.date)), /*#__PURE__*/React.createElement("div", {
    className: "orow__right"
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: o.status
  }), /*#__PURE__*/React.createElement("span", {
    className: "num orow__total"
  }, "R$ ", o.total.toLocaleString('pt-BR'))))))));
}
window.ContactDetail = ContactDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/ContactDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/Contacts.jsx
try { (() => {
/* Clientes — searchable, filterable contact list (app-table density). */

function Contacts({
  onOpen,
  onNew
}) {
  const all = window.KIT_DATA.contacts;
  const [q, setQ] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [sort, setSort] = React.useState('ltv');
  let rows = all.filter(c => {
    const matchQ = !q || c.name.toLowerCase().includes(q.toLowerCase()) || (c.phone || '').includes(q);
    const matchS = status === 'all' || c.status === status;
    return matchQ && matchS;
  });
  rows = [...rows].sort((a, b) => sort === 'ltv' ? b.ltv - a.ltv : a.name.localeCompare(b.name));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "phead"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "phead__title"
  }, "Clientes")), /*#__PURE__*/React.createElement(Button, {
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }),
    onClick: onNew
  }, "Novo")), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    className: "search__icon"
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Buscar por nome ou telefone\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 160
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: status,
    onChange: e => setStatus(e.target.value),
    options: window.KIT_DATA.statusOptions
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 150
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: sort,
    onChange: e => setSort(e.target.value),
    options: [{
      value: 'ltv',
      label: 'Maior LTV'
    }, {
      value: 'name',
      label: 'Nome (A–Z)'
    }]
  }))), rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "card card--pad muted"
  }, "Nenhum cliente encontrado.") : /*#__PURE__*/React.createElement("div", {
    className: "rows"
  }, rows.map(c => /*#__PURE__*/React.createElement(ContactRow, {
    key: c.id,
    c: c,
    onClick: () => onOpen(c)
  }))));
}
window.Contacts = Contacts;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/Contacts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/Dashboard.jsx
try { (() => {
/* Dashboard (Visão geral) — KPIs, revenue chart, attention panel, segments. */

function Dashboard({
  onNavigate,
  onOpenView
}) {
  const d = window.KIT_DATA;
  const [period, setPeriod] = React.useState('month');
  const periods = [{
    key: 'month',
    label: 'Este mês'
  }, {
    key: '30',
    label: '30 dias'
  }, {
    key: '90',
    label: '90 dias'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "phead"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "phead__title"
  }, "Vis\xE3o geral"), /*#__PURE__*/React.createElement("div", {
    className: "phead__sub"
  }, "Resumo do m\xEAs e o que precisa de aten\xE7\xE3o hoje")), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, periods.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.key,
    className: `seg__btn${period === p.key ? ' seg__btn--active' : ''}`,
    onClick: () => setPeriod(p.key)
  }, p.label)))), /*#__PURE__*/React.createElement("div", {
    className: "kpis"
  }, /*#__PURE__*/React.createElement(KpiCard, {
    label: "Receita do m\xEAs",
    value: d.stats.receita,
    delta: d.stats.receitaDelta,
    deltaDir: d.stats.receitaDir,
    sub: "vs. m\xEAs anterior"
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "Pedidos do m\xEAs",
    value: d.stats.pedidos,
    sub: `Ticket médio ${d.stats.ticket}`
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "Clientes ativos",
    value: d.stats.clientes,
    sub: `LTV médio ${d.stats.ltv}`
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "Leads abertos",
    value: d.stats.leads,
    sub: `${d.stats.leadsSemResposta} sem resposta`,
    alertSub: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card--pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Receita por m\xEAs"), /*#__PURE__*/React.createElement(RevenueBars, {
    data: d.receitaMensal
  })), /*#__PURE__*/React.createElement("div", {
    className: "card card--pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Precisa de aten\xE7\xE3o hoje"), /*#__PURE__*/React.createElement("div", null, d.atencao.map((a, i) => /*#__PURE__*/React.createElement(AttentionItem, {
    key: i,
    tone: a.tone,
    label: a.label,
    count: a.count,
    onClick: () => onOpenView(a.view)
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card card--pad section-gap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Clientes por segmento"), /*#__PURE__*/React.createElement(SegmentBars, {
    data: d.segmentos
  })));
}
window.Dashboard = Dashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/NewContact.jsx
try { (() => {
/* Novo cliente — the refined form: normal-size amber Salvar aligned right with
   a secondary Cancelar, segment as a Select (structured), proper pt-BR accents. */

function NewContact({
  onCancel,
  onSave
}) {
  const [logo, setLogo] = React.useState(false);
  const [seg, setSeg] = React.useState('papelaria');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "phead"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "phead__title"
  }, "Novo cliente"))), /*#__PURE__*/React.createElement("div", {
    className: "card card--pad",
    style: {
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Nome"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Nome do contato",
    defaultValue: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Telefone"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    inputMode: "tel",
    placeholder: "(11) 98765-4321"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Nome do neg\xF3cio"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Ex.: Papelaria Aurora"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form__row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Segmento"), /*#__PURE__*/React.createElement(Select, {
    value: seg,
    onChange: e => setSeg(e.target.value),
    options: window.KIT_DATA.segOptions.slice(1)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Logo vetorizada"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setLogo(!logo),
    className: `switch${logo ? ' switch--on' : ''}`,
    "aria-pressed": logo
  }, /*#__PURE__*/React.createElement("span", {
    className: "switch__knob"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Observa\xE7\xF5es"), /*#__PURE__*/React.createElement("textarea", {
    className: "textarea",
    placeholder: "Prefer\xEAncias de modelo, prazos, endere\xE7o de entrega\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form__actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onCancel
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onSave
  }, "Salvar")))));
}
window.NewContact = NewContact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/NewContact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/OrderForm.jsx
try { (() => {
/* Novo pedido — order form. Reuses the design-system field/Select/Button tokens
   and the NewContact layout language. Client picker is an autocomplete by name
   or phone with a suggestions dropdown; once chosen it collapses to a chip.
   Status defaults to "Confirmado". Quantidade+Total and Modelo+Tamanho pair
   side by side; comfortable form width (~520px). */

function OrderForm({
  prefillContact,
  onCancel,
  onSave
}) {
  const [selected, setSelected] = React.useState(prefillContact || null);
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState('confirmed');
  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const digits = q.replace(/\D/g, '');
    return window.KIT_DATA.contacts.filter(c => c.name.toLowerCase().includes(q) || digits && (c.phone || '').replace(/\D/g, '').includes(digits)).slice(0, 5);
  }, [query]);
  function pick(c) {
    setSelected(c);
    setQuery('');
    setOpen(false);
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "phead"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "phead__title"
  }, "Novo pedido"))), /*#__PURE__*/React.createElement("div", {
    className: "card card--pad",
    style: {
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Cliente"), selected ? /*#__PURE__*/React.createElement("div", {
    className: "picked"
  }, /*#__PURE__*/React.createElement("span", {
    className: "picked__id"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: selected.name,
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "picked__name"
  }, selected.name), /*#__PURE__*/React.createElement("span", {
    className: "picked__phone"
  }, selected.phone))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => {
      setSelected(null);
      setQuery('');
    }
  }, "Trocar")) : /*#__PURE__*/React.createElement("div", {
    className: "autocomplete"
  }, /*#__PURE__*/React.createElement("span", {
    className: "search",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    className: "search__icon"
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Buscar cliente por nome ou telefone\u2026",
    value: query,
    onChange: e => {
      setQuery(e.target.value);
      setOpen(true);
    },
    onFocus: () => setOpen(true)
  })), open && suggestions.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ac-list"
  }, suggestions.map(c => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: c.id,
    className: "ac-item",
    onClick: () => pick(c)
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: c.name,
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ac-item__main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ac-item__name"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "ac-item__phone"
  }, c.phone)), /*#__PURE__*/React.createElement(StatusBadge, {
    status: c.status,
    dot: false
  })))), open && query.trim() && suggestions.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "ac-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ac-empty"
  }, "Nenhum cliente. ", /*#__PURE__*/React.createElement("a", {
    className: "ac-link"
  }, "+ Novo cliente"))))), /*#__PURE__*/React.createElement("div", {
    className: "form__row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Quantidade"), /*#__PURE__*/React.createElement("input", {
    className: "input num",
    type: "number",
    inputMode: "numeric",
    placeholder: "500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Total (R$)"), /*#__PURE__*/React.createElement("input", {
    className: "input num",
    type: "number",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "1.480,00"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form__row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Modelo"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Kraft al\xE7a torcida"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Tamanho"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "28\xD735 cm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Status"), /*#__PURE__*/React.createElement(Select, {
    value: status,
    onChange: e => setStatus(e.target.value),
    options: window.KIT_DATA.orderStatusOptions
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Endere\xE7o de entrega"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Rua, n\xFAmero, bairro \u2014 cidade/UF"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Observa\xE7\xF5es"), /*#__PURE__*/React.createElement("textarea", {
    className: "textarea",
    placeholder: "Cor da impress\xE3o, prazo combinado, contato na entrega\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form__actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onCancel
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onSave
  }, "Salvar pedido")))));
}
window.OrderForm = OrderForm;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/OrderForm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/TopClients.jsx
try { (() => {
/* Melhores clientes — ranked table with proportional LTV bars + zebra. */

function TopClients({
  onOpen
}) {
  const rows = [...window.KIT_DATA.contacts].filter(c => c.ltv > 0).sort((a, b) => b.ltv - a.ltv);
  const max = Math.max(...rows.map(r => r.ltv));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "phead"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "phead__title"
  }, "Melhores clientes"), /*#__PURE__*/React.createElement("div", {
    className: "phead__sub"
  }, "Ranking por valor gerado (LTV)"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 40
    }
  }, "#"), /*#__PURE__*/React.createElement("th", null, "Cliente"), /*#__PURE__*/React.createElement("th", null, "Segmento"), /*#__PURE__*/React.createElement("th", {
    className: "right"
  }, "Pedidos"), /*#__PURE__*/React.createElement("th", {
    className: "right"
  }, "LTV"), /*#__PURE__*/React.createElement("th", null, "\xDAltima compra"))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    onClick: () => onOpen(r),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `rank${i === 0 ? ' rank--1' : ''}`
  }, i + 1)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "tbl__name"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.name,
    size: "sm"
  }), r.name)), /*#__PURE__*/React.createElement("td", {
    className: "muted",
    style: {
      textTransform: 'capitalize'
    }
  }, r.segment), /*#__PURE__*/React.createElement("td", {
    className: "right num"
  }, r.orders), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "ltvcell"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "R$ ", r.ltv.toLocaleString('pt-BR')), /*#__PURE__*/React.createElement("span", {
    className: "ltvbar",
    style: {
      width: `${Math.max(12, r.ltv / max * 120)}px`
    }
  }))), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, r.lastOrder || '—')))))));
}
window.TopClients = TopClients;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/TopClients.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/ViewList.jsx
try { (() => {
/* Listas filtradas acionáveis — "Clientes pra reativar", "Em risco", "Leads sem
   resposta". Reúsa a linguagem do ContactRow (avatar + nome + negócio) e os
   tokens; a diferença é o objetivo: virar ação. Cada linha tem um botão
   WhatsApp proeminente (glifo verde) que abre a conversa. */

function ViewList({
  variant = 'reativar',
  onOpen,
  onChangeVariant
}) {
  const cfg = window.KIT_DATA.views[variant];
  const byId = Object.fromEntries(window.KIT_DATA.contacts.map(c => [c.id, c]));
  const rows = cfg.rows.map(r => ({
    ...byId[r.id],
    since: r.since
  }));
  const tabs = [{
    key: 'reativar',
    label: 'Pra reativar'
  }, {
    key: 'risco',
    label: 'Em risco'
  }, {
    key: 'leads',
    label: 'Leads sem resposta'
  }];
  function wa(c, e) {
    e.stopPropagation();
    window.open(`https://wa.me/55${(c.phone || '').replace(/\D/g, '')}`, '_blank', 'noopener');
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "phead"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "phead__title"
  }, cfg.title, /*#__PURE__*/React.createElement("span", {
    className: `count count--${cfg.tone}`
  }, rows.length)), /*#__PURE__*/React.createElement("div", {
    className: "phead__sub"
  }, cfg.context))), /*#__PURE__*/React.createElement("div", {
    className: "seg seg--wrap",
    style: {
      marginBottom: 16
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: `seg__btn${variant === t.key ? ' seg__btn--active' : ''}`,
    onClick: () => onChangeVariant && onChangeVariant(t.key)
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    className: "rows"
  }, rows.map(c => /*#__PURE__*/React.createElement("div", {
    className: "crow vrow",
    key: c.id,
    onClick: () => onOpen(c)
  }, /*#__PURE__*/React.createElement("span", {
    className: "av"
  }, initials(c.name)), /*#__PURE__*/React.createElement("div", {
    className: "crow__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crow__name"
  }, c.name), /*#__PURE__*/React.createElement("div", {
    className: "crow__sub"
  }, c.business || c.phone, " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      textTransform: 'capitalize'
    }
  }, c.segment))), /*#__PURE__*/React.createElement("div", {
    className: "vrow__stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vrow__since"
  }, c.since), c.ltv > 0 && /*#__PURE__*/React.createElement("div", {
    className: "crow__ltv"
  }, "R$ ", c.ltv.toLocaleString('pt-BR'))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--wa vrow__wa",
    onClick: e => wa(c, e)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "whatsapp",
    size: 16
  }), " WhatsApp")))));
}
window.ViewList = ViewList;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/ViewList.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/data.js
try { (() => {
/* Sacolas CRM UI kit — mock data (realistic pt-BR). Window-assigned. */

window.KIT_DATA = {
  stats: {
    receita: 'R$ 12.480',
    receitaDelta: '18%',
    receitaDir: 'up',
    pedidos: '38',
    ticket: 'R$ 328',
    clientes: '64',
    ltv: 'R$ 1.940',
    leads: '7',
    leadsSemResposta: 2
  },
  receitaMensal: [{
    mes: 'set',
    receita: 6200
  }, {
    mes: 'out',
    receita: 7400
  }, {
    mes: 'nov',
    receita: 9100
  }, {
    mes: 'dez',
    receita: 13800
  }, {
    mes: 'jan',
    receita: 8600
  }, {
    mes: 'fev',
    receita: 10200
  }, {
    mes: 'mar',
    receita: 12480
  }],
  segmentos: [{
    segment: 'papelaria',
    total: 21
  }, {
    segment: 'restaurante',
    total: 16
  }, {
    segment: 'confeitaria',
    total: 13
  }, {
    segment: 'boutique',
    total: 9
  }, {
    segment: 'outro',
    total: 5
  }],
  atencao: [{
    tone: 'amber',
    label: 'Clientes pra reativar',
    count: 5,
    view: 'reativar'
  }, {
    tone: 'danger',
    label: 'Em risco — sem comprar há +60 dias',
    count: 3,
    view: 'risco'
  }, {
    tone: 'info',
    label: 'Leads sem resposta há +3 dias',
    count: 2,
    view: 'leads'
  }],
  contacts: [{
    id: '1',
    name: 'Papelaria Aurora',
    business: 'Papelaria Aurora',
    phone: '(11) 98812-4410',
    segment: 'papelaria',
    status: 'customer',
    ltv: 4820,
    orders: 11,
    lastOrder: 'há 6 dias'
  }, {
    id: '2',
    name: 'Bistrô do Tó',
    business: 'Restaurante',
    phone: '(11) 99654-2201',
    segment: 'restaurante',
    status: 'customer',
    ltv: 3960,
    orders: 8,
    lastOrder: 'há 12 dias'
  }, {
    id: '3',
    name: 'Confeitaria Bem-Doce',
    business: 'Confeitaria',
    phone: '(11) 99123-7788',
    segment: 'confeitaria',
    status: 'customer',
    ltv: 3210,
    orders: 7,
    lastOrder: 'há 21 dias'
  }, {
    id: '4',
    name: 'Boutique Lis',
    business: 'Boutique',
    phone: '(11) 98800-1122',
    segment: 'boutique',
    status: 'customer',
    ltv: 2780,
    orders: 6,
    lastOrder: 'há 34 dias'
  }, {
    id: '5',
    name: 'Maria Souza',
    business: 'Ateliê Maria',
    phone: '(11) 99777-0099',
    segment: 'outro',
    status: 'lead',
    ltv: 0,
    orders: 0,
    lastOrder: null
  }, {
    id: '6',
    name: 'Padaria Pão Quente',
    business: 'Padaria',
    phone: '(11) 98345-6611',
    segment: 'restaurante',
    status: 'customer',
    ltv: 2140,
    orders: 5,
    lastOrder: 'há 41 dias'
  }, {
    id: '7',
    name: 'Livraria Sebo Velho',
    business: 'Papelaria',
    phone: '(11) 99001-2233',
    segment: 'papelaria',
    status: 'inactive',
    ltv: 980,
    orders: 3,
    lastOrder: 'há 4 meses'
  }, {
    id: '8',
    name: 'João Mendes',
    business: null,
    phone: '(11) 99555-8080',
    segment: 'outro',
    status: 'lead',
    ltv: 0,
    orders: 0,
    lastOrder: null
  }, {
    id: '9',
    name: 'Doceria Açúcar & Sal',
    business: 'Confeitaria',
    phone: '(11) 98122-3434',
    segment: 'confeitaria',
    status: 'customer',
    ltv: 1760,
    orders: 4,
    lastOrder: 'há 18 dias'
  }, {
    id: '10',
    name: 'Floricultura Bela Flor',
    business: 'Boutique',
    phone: '(11) 99876-5544',
    segment: 'boutique',
    status: 'inactive',
    ltv: 620,
    orders: 2,
    lastOrder: 'há 5 meses'
  }],
  segOptions: [{
    value: 'all',
    label: 'Todos os segmentos'
  }, {
    value: 'papelaria',
    label: 'Papelaria'
  }, {
    value: 'restaurante',
    label: 'Restaurante'
  }, {
    value: 'boutique',
    label: 'Boutique'
  }, {
    value: 'confeitaria',
    label: 'Confeitaria'
  }, {
    value: 'outro',
    label: 'Outro'
  }],
  statusOptions: [{
    value: 'all',
    label: 'Todos os status'
  }, {
    value: 'lead',
    label: 'Leads'
  }, {
    value: 'customer',
    label: 'Clientes'
  }, {
    value: 'inactive',
    label: 'Inativos'
  }],
  orderStatusOptions: [{
    value: 'quote',
    label: 'Orçamento'
  }, {
    value: 'confirmed',
    label: 'Confirmado'
  }, {
    value: 'vector_pending',
    label: 'Aguardando vetor'
  }, {
    value: 'factory_pending',
    label: 'Na fábrica'
  }, {
    value: 'printing',
    label: 'Em impressão'
  }, {
    value: 'ready_to_deliver',
    label: 'Pronto p/ entregar'
  }, {
    value: 'delivered',
    label: 'Entregue'
  }, {
    value: 'paid',
    label: 'Pago'
  }, {
    value: 'cancelled',
    label: 'Cancelado'
  }],
  views: {
    reativar: {
      title: 'Clientes pra reativar',
      context: 'Sem comprar há mais de 30 dias — vale um alô antes de esfriar.',
      tone: 'amber',
      rows: [{
        id: '4',
        since: 'há 34 dias'
      }, {
        id: '6',
        since: 'há 41 dias'
      }, {
        id: '3',
        since: 'há 38 dias'
      }, {
        id: '9',
        since: 'há 45 dias'
      }, {
        id: '2',
        since: 'há 32 dias'
      }]
    },
    risco: {
      title: 'Clientes em risco',
      context: 'Sem comprar há mais de 60 dias. Eram recorrentes — reconquiste agora.',
      tone: 'danger',
      rows: [{
        id: '7',
        since: 'há 4 meses'
      }, {
        id: '10',
        since: 'há 5 meses'
      }, {
        id: '1',
        since: 'há 78 dias'
      }]
    },
    leads: {
      title: 'Leads sem resposta há +3 dias',
      context: 'Pediram orçamento e ficaram no vácuo. Um lembrete costuma destravar.',
      tone: 'info',
      rows: [{
        id: '5',
        since: 'sem resposta há 6 dias'
      }, {
        id: '8',
        since: 'sem resposta há 4 dias'
      }]
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/data.js", error: String((e && e.message) || e) }); }

// ui_kits/crm/lib.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Sacolas CRM UI kit — shared primitives. Mirrors the authored design-system
   components; window-assigned so the Babel-loaded screens can share them. */

function Icon({
  name,
  size = 16,
  sw = 1.75,
  className,
  style
}) {
  const p = {
    home: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 9.5 12 3l9 6.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 9v11h14V9"
    })),
    users: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "8",
      r: "3.2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3.5 20a5.5 5.5 0 0 1 11 0"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 5.2a3.2 3.2 0 0 1 0 6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M17.5 20a5.5 5.5 0 0 0-3-4.9"
    })),
    package: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 7.5 12 12l9-4.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "12",
      x2: "12",
      y2: "21"
    })),
    trophy: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M7 4h10v4a5 5 0 0 1-10 0z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 6H4v1a3 3 0 0 0 3 3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M17 6h3v1a3 3 0 0 1-3 3"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "13",
      x2: "12",
      y2: "17"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 20h8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 17h6v3H9z"
    })),
    plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    })),
    search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "21",
      x2: "16.65",
      y2: "16.65"
    })),
    chevronDown: /*#__PURE__*/React.createElement("polyline", {
      points: "6 9 12 15 18 9"
    }),
    chevronRight: /*#__PURE__*/React.createElement("polyline", {
      points: "9 6 15 12 9 18"
    }),
    chevronLeft: /*#__PURE__*/React.createElement("polyline", {
      points: "15 6 9 12 15 18"
    }),
    arrowLeft: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "19",
      y1: "12",
      x2: "5",
      y2: "12"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 19 5 12 12 5"
    })),
    whatsapp: /*#__PURE__*/React.createElement("path", {
      d: "M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm0 2a7 7 0 0 1 5.9 10.8l-.3.5.6 2.2-2.3-.6-.5.3A7 7 0 1 1 12 5zm-2.6 3.6c-.2 0-.5.1-.7.3-.3.3-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.6 4 3.5 1.9.7 2.3.6 2.7.5.4 0 1.3-.5 1.5-1 .2-.5.2-1 .1-1l-.6-.3-1.5-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.1-.2.1-.4 0-.2-.1-.9-.4-1.7-1.1-.6-.6-1-1.2-1.2-1.4-.1-.2 0-.3.1-.4l.3-.4.3-.4v-.4l-.7-1.6c-.1-.3-.3-.3-.4-.3h-.3z"
    })
  };
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: style,
    "aria-hidden": "true"
  }, p[name] || null);
}
function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function Button({
  variant = 'primary',
  size,
  iconLeft,
  children,
  ...props
}) {
  const cls = `btn btn--${variant}${size === 'sm' ? ' btn--sm' : ''}`;
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, props), iconLeft, children);
}
function Avatar({
  name,
  size
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `av${size === 'sm' ? ' av--sm' : ''}`
  }, initials(name));
}
const STATUS = {
  lead: ['neutral', 'Lead'],
  customer: ['positive', 'Cliente'],
  inactive: ['faint', 'Inativo'],
  churned: ['faint', 'Perdido'],
  quote: ['neutral', 'Orçamento'],
  confirmed: ['info', 'Confirmado'],
  vector_pending: ['info', 'Aguardando vetor'],
  factory_pending: ['info', 'Na fábrica'],
  printing: ['amber', 'Em impressão'],
  ready_to_deliver: ['amber', 'Pronto p/ entregar'],
  delivered: ['positive', 'Entregue'],
  paid: ['positive', 'Pago'],
  cancelled: ['danger', 'Cancelado']
};
function StatusBadge({
  status,
  dot = true
}) {
  const [tone, label] = STATUS[status] || ['neutral', status];
  return /*#__PURE__*/React.createElement("span", {
    className: `sb sb--${tone}`
  }, dot && /*#__PURE__*/React.createElement("span", {
    className: "sb__dot"
  }), label);
}
function KpiCard({
  label,
  value,
  delta,
  deltaDir = 'up',
  sub,
  alertSub
}) {
  const arrow = deltaDir === 'down' ? '▼' : '▲';
  return /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "kpi__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kpi__value"
  }, value), delta != null && /*#__PURE__*/React.createElement("span", {
    className: `kpi__delta kpi__delta--${deltaDir}`
  }, arrow, " ", delta)), sub != null && /*#__PURE__*/React.createElement("div", {
    className: `kpi__sub${alertSub ? ' kpi__sub--alert' : ''}`
  }, sub));
}
function AttentionItem({
  tone = 'amber',
  label,
  count,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "att",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("span", {
    className: `att__dot att__dot--${tone}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "att__label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "att__count"
  }, count), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 16,
    className: "att__chev"
  }));
}
function ContactRow({
  c,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "crow",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("span", {
    className: "av"
  }, initials(c.name)), /*#__PURE__*/React.createElement("div", {
    className: "crow__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crow__name"
  }, c.name), /*#__PURE__*/React.createElement("div", {
    className: "crow__sub"
  }, c.business || c.phone)), /*#__PURE__*/React.createElement("div", {
    className: "crow__right"
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: c.status
  }), /*#__PURE__*/React.createElement("div", null, c.ltv > 0 && /*#__PURE__*/React.createElement("div", {
    className: "crow__ltv"
  }, "R$ ", c.ltv.toLocaleString('pt-BR')), c.lastOrder && /*#__PURE__*/React.createElement("div", {
    className: "crow__when"
  }, c.lastOrder))));
}
const NAV = [{
  key: 'overview',
  label: 'Visão geral',
  short: 'Visão',
  icon: 'home'
}, {
  key: 'contacts',
  label: 'Clientes',
  short: 'Clientes',
  icon: 'users'
}, {
  key: 'orders',
  label: 'Pedidos',
  short: 'Pedidos',
  icon: 'package'
}, {
  key: 'top',
  label: 'Melhores clientes',
  short: 'Top',
  icon: 'trophy'
}];
function Sidebar({
  active,
  onNavigate,
  onNew
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "side__name"
  }, "Sacolas")), /*#__PURE__*/React.createElement("div", {
    className: "side__items"
  }, NAV.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.key,
    type: "button",
    className: `side__item${it.key === active ? ' side__item--active' : ''}`,
    onClick: () => onNavigate(it.key)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 17
  }), it.label))), /*#__PURE__*/React.createElement("div", {
    className: "side__sep"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "side__new",
    onClick: onNew
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Novo"));
}
function BottomTabBar({
  active,
  onNavigate,
  onNew
}) {
  const tabs = [NAV[0], NAV[1], {
    key: 'new',
    short: 'Novo',
    icon: 'plus',
    isNew: true
  }, NAV[2], NAV[3]];
  return /*#__PURE__*/React.createElement("nav", {
    className: "tabs"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    type: "button",
    className: `tab${t.key === active ? ' tab--active' : ''}${t.isNew ? ' tab--new' : ''}`,
    onClick: () => t.isNew ? onNew() : onNavigate(t.key)
  }, t.isNew ? /*#__PURE__*/React.createElement("span", {
    className: "tab__plus"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 18
  })) : /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 20
  }), t.short)));
}
function RevenueBars({
  data
}) {
  const max = Math.max(...data.map(d => d.receita));
  const peak = data.reduce((a, b) => b.receita > a.receita ? b : a, data[0]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "bars"
  }, data.map(d => /*#__PURE__*/React.createElement("div", {
    className: "bars__col",
    key: d.mes
  }, /*#__PURE__*/React.createElement("div", {
    className: "bars__bar",
    title: `R$ ${d.receita.toLocaleString('pt-BR')}`,
    style: {
      height: `${Math.max(4, d.receita / max * 100)}%`,
      background: d.mes === peak.mes ? 'var(--chart-bar-peak)' : 'var(--chart-bar)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "bars__x"
  }, d.mes)))), /*#__PURE__*/React.createElement("div", {
    className: "legend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "legend__item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "legend__key",
    style: {
      background: 'var(--chart-bar-peak)'
    }
  }), "M\xEAs de pico"), /*#__PURE__*/React.createElement("span", {
    className: "legend__item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "legend__key",
    style: {
      background: 'var(--chart-bar)'
    }
  }), "Receita mensal")));
}
const SEG_COLORS = ['var(--chart-seg-1)', 'var(--chart-seg-2)', 'var(--chart-seg-3)', 'var(--chart-seg-4)', 'var(--chart-seg-other)'];
function SegmentBars({
  data
}) {
  const max = Math.max(...data.map(d => d.total));
  return /*#__PURE__*/React.createElement("div", {
    className: "segbars"
  }, data.map((d, i) => /*#__PURE__*/React.createElement("div", {
    className: "segrow",
    key: d.segment
  }, /*#__PURE__*/React.createElement("span", {
    className: "segrow__label"
  }, d.segment), /*#__PURE__*/React.createElement("span", {
    className: "segrow__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "segrow__fill",
    style: {
      width: `${d.total / max * 100}%`,
      background: SEG_COLORS[i % SEG_COLORS.length]
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "segrow__val"
  }, d.total))));
}
function Select({
  value,
  onChange,
  options
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "select"
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 16,
    className: "select__chev"
  }));
}
Object.assign(window, {
  Icon,
  initials,
  Button,
  Avatar,
  StatusBadge,
  KpiCard,
  AttentionItem,
  ContactRow,
  Sidebar,
  BottomTabBar,
  RevenueBars,
  SegmentBars,
  Select,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/lib.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.AttentionItem = __ds_scope.AttentionItem;

__ds_ns.ContactRow = __ds_scope.ContactRow;

__ds_ns.KpiCard = __ds_scope.KpiCard;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.BottomTabBar = __ds_scope.BottomTabBar;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.Icon = __ds_scope.Icon;

})();
