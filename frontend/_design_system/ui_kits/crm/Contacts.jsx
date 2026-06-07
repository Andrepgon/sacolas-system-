/* Clientes — searchable, filterable contact list (app-table density). */

function Contacts({ onOpen, onNew }) {
  const all = window.KIT_DATA.contacts
  const [q, setQ] = React.useState('')
  const [status, setStatus] = React.useState('all')
  const [sort, setSort] = React.useState('ltv')

  let rows = all.filter((c) => {
    const matchQ = !q || c.name.toLowerCase().includes(q.toLowerCase()) || (c.phone || '').includes(q)
    const matchS = status === 'all' || c.status === status
    return matchQ && matchS
  })
  rows = [...rows].sort((a, b) => (sort === 'ltv' ? b.ltv - a.ltv : a.name.localeCompare(b.name)))

  return (
    <div>
      <div className="phead">
        <div><h1 className="phead__title">Clientes</h1></div>
        <Button iconLeft={<Icon name="plus" size={16} />} onClick={onNew}>Novo</Button>
      </div>

      <div className="toolbar">
        <span className="search">
          <Icon name="search" size={16} className="search__icon" />
          <input className="input" placeholder="Buscar por nome ou telefone…" value={q} onChange={(e) => setQ(e.target.value)} />
        </span>
        <div style={{ width: 160 }}>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} options={window.KIT_DATA.statusOptions} />
        </div>
        <div style={{ width: 150 }}>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} options={[
            { value: 'ltv', label: 'Maior LTV' },
            { value: 'name', label: 'Nome (A–Z)' },
          ]} />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card card--pad muted">Nenhum cliente encontrado.</div>
      ) : (
        <div className="rows">
          {rows.map((c) => <ContactRow key={c.id} c={c} onClick={() => onOpen(c)} />)}
        </div>
      )}
    </div>
  )
}
window.Contacts = Contacts
