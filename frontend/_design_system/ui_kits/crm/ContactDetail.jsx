/* Contato (detalhe) — header with status, WhatsApp + Pedido actions, metrics,
   and the order history with pipeline status badges. */

function ContactDetail({ contact, onBack, onNewOrder }) {
  const c = contact
  const orders = (window.KIT_ORDERS && window.KIT_ORDERS[c.id]) || [
    { id: 'o1', model: 'Kraft 28×35 · alça torcida', qty: 500, total: 1480, status: 'paid', date: '12/03/2026' },
    { id: 'o2', model: 'Kraft 18×22 · alça chata', qty: 300, total: 720, status: 'printing', date: '02/04/2026' },
    { id: 'o3', model: 'Kraft 40×45 · reforçada', qty: 200, total: 980, status: 'vector_pending', date: '28/04/2026' },
  ]
  const wa = `https://wa.me/55${(c.phone || '').replace(/\D/g, '')}`
  return (
    <div>
      <button className="backlink" onClick={onBack}><Icon name="arrowLeft" size={16} /> Clientes</button>

      <div className="detail-head">
        <div className="detail-head__id">
          <Avatar name={c.name} />
          <div>
            <h1 className="phead__title">{c.name}</h1>
            <div className="detail-head__meta">
              <StatusBadge status={c.status} />
              <span className="sb sb--neutral" style={{ textTransform: 'capitalize' }}>{c.segment}</span>
              <span className="muted" style={{ fontSize: 13 }}>{c.phone}</span>
            </div>
          </div>
        </div>
        <div className="detail-head__actions">
          <a className="btn btn--wa" href={wa} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={16} /> WhatsApp</a>
          <Button variant="primary" iconLeft={<Icon name="plus" size={16} />} onClick={() => onNewOrder && onNewOrder(c)}>Pedido</Button>
        </div>
      </div>

      <div className="metrics">
        <div className="kpi"><div className="kpi__label">Pedidos</div><div className="kpi__value">{c.orders}</div></div>
        <div className="kpi"><div className="kpi__label">LTV</div><div className="kpi__value">R$ {c.ltv.toLocaleString('pt-BR')}</div></div>
        <div className="kpi"><div className="kpi__label">Última compra</div><div className="kpi__value" style={{ fontSize: 16, fontFamily: 'var(--font-sans)' }}>{c.lastOrder || '—'}</div></div>
        <div className="kpi"><div className="kpi__label">Ticket médio</div><div className="kpi__value">R$ {c.orders ? Math.round(c.ltv / c.orders).toLocaleString('pt-BR') : 0}</div></div>
      </div>

      <div className="card section-gap" style={{ overflow: 'hidden' }}>
        <div className="card--pad" style={{ paddingBottom: 0 }}><div className="card__title" style={{ marginBottom: 0 }}>Pedidos</div></div>
        <div style={{ padding: '8px 0' }}>
          {orders.map((o) => (
            <div className="orow" key={o.id}>
              <div className="orow__main">
                <div className="orow__model">{o.model}</div>
                <div className="orow__meta">Qtd. {o.qty} · {o.date}</div>
              </div>
              <div className="orow__right">
                <StatusBadge status={o.status} />
                <span className="num orow__total">R$ {o.total.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
window.ContactDetail = ContactDetail
