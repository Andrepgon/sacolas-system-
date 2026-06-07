/* Sacolas CRM UI kit — shared primitives. Mirrors the authored design-system
   components; window-assigned so the Babel-loaded screens can share them. */

function Icon({ name, size = 16, sw = 1.75, className, style }) {
  const p = {
    home: <><path d="M3 9.5 12 3l9 6.5" /><path d="M5 9v11h14V9" /></>,
    users: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.2a3.2 3.2 0 0 1 0 6" /><path d="M17.5 20a5.5 5.5 0 0 0-3-4.9" /></>,
    package: <><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" /><path d="M3 7.5 12 12l9-4.5" /><line x1="12" y1="12" x2="12" y2="21" /></>,
    trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0z" /><path d="M7 6H4v1a3 3 0 0 0 3 3" /><path d="M17 6h3v1a3 3 0 0 1-3 3" /><line x1="12" y1="13" x2="12" y2="17" /><path d="M8 20h8" /><path d="M9 17h6v3H9z" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    chevronRight: <polyline points="9 6 15 12 9 18" />,
    chevronLeft: <polyline points="15 6 9 12 15 18" />,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    whatsapp: <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm0 2a7 7 0 0 1 5.9 10.8l-.3.5.6 2.2-2.3-.6-.5.3A7 7 0 1 1 12 5zm-2.6 3.6c-.2 0-.5.1-.7.3-.3.3-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.6 4 3.5 1.9.7 2.3.6 2.7.5.4 0 1.3-.5 1.5-1 .2-.5.2-1 .1-1l-.6-.3-1.5-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.1-.2.1-.4 0-.2-.1-.9-.4-1.7-1.1-.6-.6-1-1.2-1.2-1.4-.1-.2 0-.3.1-.4l.3-.4.3-.4v-.4l-.7-1.6c-.1-.3-.3-.3-.4-.3h-.3z" />,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      {p[name] || null}
    </svg>
  )
}

function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Button({ variant = 'primary', size, iconLeft, children, ...props }) {
  const cls = `btn btn--${variant}${size === 'sm' ? ' btn--sm' : ''}`
  return <button className={cls} {...props}>{iconLeft}{children}</button>
}

function Avatar({ name, size }) {
  return <span className={`av${size === 'sm' ? ' av--sm' : ''}`}>{initials(name)}</span>
}

const STATUS = {
  lead: ['neutral', 'Lead'], customer: ['positive', 'Cliente'], inactive: ['faint', 'Inativo'], churned: ['faint', 'Perdido'],
  quote: ['neutral', 'Orçamento'], confirmed: ['info', 'Confirmado'], vector_pending: ['info', 'Aguardando vetor'],
  factory_pending: ['info', 'Na fábrica'], printing: ['amber', 'Em impressão'], ready_to_deliver: ['amber', 'Pronto p/ entregar'],
  delivered: ['positive', 'Entregue'], paid: ['positive', 'Pago'], cancelled: ['danger', 'Cancelado'],
}
function StatusBadge({ status, dot = true }) {
  const [tone, label] = STATUS[status] || ['neutral', status]
  return <span className={`sb sb--${tone}`}>{dot && <span className="sb__dot" />}{label}</span>
}

function KpiCard({ label, value, delta, deltaDir = 'up', sub, alertSub }) {
  const arrow = deltaDir === 'down' ? '▼' : '▲'
  return (
    <div className="kpi">
      <div className="kpi__label">{label}</div>
      <div className="kpi__row">
        <span className="kpi__value">{value}</span>
        {delta != null && <span className={`kpi__delta kpi__delta--${deltaDir}`}>{arrow} {delta}</span>}
      </div>
      {sub != null && <div className={`kpi__sub${alertSub ? ' kpi__sub--alert' : ''}`}>{sub}</div>}
    </div>
  )
}

function AttentionItem({ tone = 'amber', label, count, onClick }) {
  return (
    <button type="button" className="att" onClick={onClick}>
      <span className={`att__dot att__dot--${tone}`} />
      <span className="att__label">{label}</span>
      <span className="att__count">{count}</span>
      <Icon name="chevronRight" size={16} className="att__chev" />
    </button>
  )
}

function ContactRow({ c, onClick }) {
  return (
    <div className="crow" onClick={onClick}>
      <span className="av">{initials(c.name)}</span>
      <div className="crow__main">
        <div className="crow__name">{c.name}</div>
        <div className="crow__sub">{c.business || c.phone}</div>
      </div>
      <div className="crow__right">
        <StatusBadge status={c.status} />
        <div>
          {c.ltv > 0 && <div className="crow__ltv">R$ {c.ltv.toLocaleString('pt-BR')}</div>}
          {c.lastOrder && <div className="crow__when">{c.lastOrder}</div>}
        </div>
      </div>
    </div>
  )
}

const NAV = [
  { key: 'overview', label: 'Visão geral', short: 'Visão', icon: 'home' },
  { key: 'contacts', label: 'Clientes', short: 'Clientes', icon: 'users' },
  { key: 'orders', label: 'Pedidos', short: 'Pedidos', icon: 'package' },
  { key: 'top', label: 'Melhores clientes', short: 'Top', icon: 'trophy' },
]

function Sidebar({ active, onNavigate, onNew }) {
  return (
    <nav className="side">
      <div className="side__brand">
        <img src="../../assets/logo-mark.png" alt="" />
        <span className="side__name">Sacolas</span>
      </div>
      <div className="side__items">
        {NAV.map((it) => (
          <button key={it.key} type="button"
            className={`side__item${it.key === active ? ' side__item--active' : ''}`}
            onClick={() => onNavigate(it.key)}>
            <Icon name={it.icon} size={17} />{it.label}
          </button>
        ))}
      </div>
      <div className="side__sep" />
      <button type="button" className="side__new" onClick={onNew}><Icon name="plus" size={16} /> Novo</button>
    </nav>
  )
}

function BottomTabBar({ active, onNavigate, onNew }) {
  const tabs = [NAV[0], NAV[1], { key: 'new', short: 'Novo', icon: 'plus', isNew: true }, NAV[2], NAV[3]]
  return (
    <nav className="tabs">
      {tabs.map((t) => (
        <button key={t.key} type="button"
          className={`tab${t.key === active ? ' tab--active' : ''}${t.isNew ? ' tab--new' : ''}`}
          onClick={() => (t.isNew ? onNew() : onNavigate(t.key))}>
          {t.isNew ? <span className="tab__plus"><Icon name="plus" size={18} /></span> : <Icon name={t.icon} size={20} />}
          {t.short}
        </button>
      ))}
    </nav>
  )
}

function RevenueBars({ data }) {
  const max = Math.max(...data.map((d) => d.receita))
  const peak = data.reduce((a, b) => (b.receita > a.receita ? b : a), data[0])
  return (
    <div>
      <div className="bars">
        {data.map((d) => (
          <div className="bars__col" key={d.mes}>
            <div className="bars__bar" title={`R$ ${d.receita.toLocaleString('pt-BR')}`}
              style={{ height: `${Math.max(4, (d.receita / max) * 100)}%`,
                background: d.mes === peak.mes ? 'var(--chart-bar-peak)' : 'var(--chart-bar)' }} />
            <span className="bars__x">{d.mes}</span>
          </div>
        ))}
      </div>
      <div className="legend">
        <span className="legend__item"><span className="legend__key" style={{ background: 'var(--chart-bar-peak)' }} />Mês de pico</span>
        <span className="legend__item"><span className="legend__key" style={{ background: 'var(--chart-bar)' }} />Receita mensal</span>
      </div>
    </div>
  )
}

const SEG_COLORS = ['var(--chart-seg-1)', 'var(--chart-seg-2)', 'var(--chart-seg-3)', 'var(--chart-seg-4)', 'var(--chart-seg-other)']
function SegmentBars({ data }) {
  const max = Math.max(...data.map((d) => d.total))
  return (
    <div className="segbars">
      {data.map((d, i) => (
        <div className="segrow" key={d.segment}>
          <span className="segrow__label">{d.segment}</span>
          <span className="segrow__track"><span className="segrow__fill" style={{ width: `${(d.total / max) * 100}%`, background: SEG_COLORS[i % SEG_COLORS.length] }} /></span>
          <span className="segrow__val">{d.total}</span>
        </div>
      ))}
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <span className="select">
      <select value={value} onChange={onChange}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icon name="chevronDown" size={16} className="select__chev" />
    </span>
  )
}

Object.assign(window, {
  Icon, initials, Button, Avatar, StatusBadge, KpiCard, AttentionItem, ContactRow,
  Sidebar, BottomTabBar, RevenueBars, SegmentBars, Select, NAV,
})
