/* Dashboard (Visão geral) — KPIs, revenue chart, attention panel, segments. */

function Dashboard({ onNavigate, onOpenView }) {
  const d = window.KIT_DATA
  const [period, setPeriod] = React.useState('month')
  const periods = [
    { key: 'month', label: 'Este mês' },
    { key: '30', label: '30 dias' },
    { key: '90', label: '90 dias' },
  ]
  return (
    <div>
      <div className="phead">
        <div>
          <h1 className="phead__title">Visão geral</h1>
          <div className="phead__sub">Resumo do mês e o que precisa de atenção hoje</div>
        </div>
        <div className="seg">
          {periods.map((p) => (
            <button key={p.key} className={`seg__btn${period === p.key ? ' seg__btn--active' : ''}`} onClick={() => setPeriod(p.key)}>{p.label}</button>
          ))}
        </div>
      </div>

      <div className="kpis">
        <KpiCard label="Receita do mês" value={d.stats.receita} delta={d.stats.receitaDelta} deltaDir={d.stats.receitaDir} sub="vs. mês anterior" />
        <KpiCard label="Pedidos do mês" value={d.stats.pedidos} sub={`Ticket médio ${d.stats.ticket}`} />
        <KpiCard label="Clientes ativos" value={d.stats.clientes} sub={`LTV médio ${d.stats.ltv}`} />
        <KpiCard label="Leads abertos" value={d.stats.leads} sub={`${d.stats.leadsSemResposta} sem resposta`} alertSub />
      </div>

      <div className="grid2">
        <div className="card card--pad">
          <div className="card__title">Receita por mês</div>
          <RevenueBars data={d.receitaMensal} />
        </div>
        <div className="card card--pad">
          <div className="card__title">Precisa de atenção hoje</div>
          <div>
            {d.atencao.map((a, i) => (
              <AttentionItem key={i} tone={a.tone} label={a.label} count={a.count} onClick={() => onOpenView(a.view)} />
            ))}
          </div>
        </div>
      </div>

      <div className="card card--pad section-gap">
        <div className="card__title">Clientes por segmento</div>
        <SegmentBars data={d.segmentos} />
      </div>
    </div>
  )
}
window.Dashboard = Dashboard
