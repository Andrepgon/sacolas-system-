/* Melhores clientes — ranked table with proportional LTV bars + zebra. */

function TopClients({ onOpen }) {
  const rows = [...window.KIT_DATA.contacts]
    .filter((c) => c.ltv > 0)
    .sort((a, b) => b.ltv - a.ltv)
  const max = Math.max(...rows.map((r) => r.ltv))

  return (
    <div>
      <div className="phead">
        <div>
          <h1 className="phead__title">Melhores clientes</h1>
          <div className="phead__sub">Ranking por valor gerado (LTV)</div>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Cliente</th>
              <th>Segmento</th>
              <th className="right">Pedidos</th>
              <th className="right">LTV</th>
              <th>Última compra</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} onClick={() => onOpen(r)} style={{ cursor: 'pointer' }}>
                <td><span className={`rank${i === 0 ? ' rank--1' : ''}`}>{i + 1}</span></td>
                <td>
                  <span className="tbl__name"><Avatar name={r.name} size="sm" />{r.name}</span>
                </td>
                <td className="muted" style={{ textTransform: 'capitalize' }}>{r.segment}</td>
                <td className="right num">{r.orders}</td>
                <td>
                  <div className="ltvcell">
                    <span className="num">R$ {r.ltv.toLocaleString('pt-BR')}</span>
                    <span className="ltvbar" style={{ width: `${Math.max(12, (r.ltv / max) * 120)}px` }} />
                  </div>
                </td>
                <td className="muted">{r.lastOrder || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
window.TopClients = TopClients
