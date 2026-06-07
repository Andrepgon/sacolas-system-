/* Listas filtradas acionáveis — "Clientes pra reativar", "Em risco", "Leads sem
   resposta". Reúsa a linguagem do ContactRow (avatar + nome + negócio) e os
   tokens; a diferença é o objetivo: virar ação. Cada linha tem um botão
   WhatsApp proeminente (glifo verde) que abre a conversa. */

function ViewList({ variant = 'reativar', onOpen, onChangeVariant }) {
  const cfg = window.KIT_DATA.views[variant]
  const byId = Object.fromEntries(window.KIT_DATA.contacts.map((c) => [c.id, c]))
  const rows = cfg.rows.map((r) => ({ ...byId[r.id], since: r.since }))

  const tabs = [
    { key: 'reativar', label: 'Pra reativar' },
    { key: 'risco', label: 'Em risco' },
    { key: 'leads', label: 'Leads sem resposta' },
  ]

  function wa(c, e) {
    e.stopPropagation()
    window.open(`https://wa.me/55${(c.phone || '').replace(/\D/g, '')}`, '_blank', 'noopener')
  }

  return (
    <div>
      <div className="phead">
        <div>
          <h1 className="phead__title">
            {cfg.title}
            <span className={`count count--${cfg.tone}`}>{rows.length}</span>
          </h1>
          <div className="phead__sub">{cfg.context}</div>
        </div>
      </div>

      <div className="seg seg--wrap" style={{ marginBottom: 16 }}>
        {tabs.map((t) => (
          <button key={t.key} className={`seg__btn${variant === t.key ? ' seg__btn--active' : ''}`}
            onClick={() => onChangeVariant && onChangeVariant(t.key)}>{t.label}</button>
        ))}
      </div>

      <div className="rows">
        {rows.map((c) => (
          <div className="crow vrow" key={c.id} onClick={() => onOpen(c)}>
            <span className="av">{initials(c.name)}</span>
            <div className="crow__main">
              <div className="crow__name">{c.name}</div>
              <div className="crow__sub">{(c.business || c.phone)} · <span style={{ textTransform: 'capitalize' }}>{c.segment}</span></div>
            </div>
            <div className="vrow__stats">
              <div className="vrow__since">{c.since}</div>
              {c.ltv > 0 && <div className="crow__ltv">R$ {c.ltv.toLocaleString('pt-BR')}</div>}
            </div>
            <button className="btn btn--wa vrow__wa" onClick={(e) => wa(c, e)}>
              <Icon name="whatsapp" size={16} /> WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
window.ViewList = ViewList
