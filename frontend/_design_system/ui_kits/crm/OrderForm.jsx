/* Novo pedido — order form. Reuses the design-system field/Select/Button tokens
   and the NewContact layout language. Client picker is an autocomplete by name
   or phone with a suggestions dropdown; once chosen it collapses to a chip.
   Status defaults to "Confirmado". Quantidade+Total and Modelo+Tamanho pair
   side by side; comfortable form width (~520px). */

function OrderForm({ prefillContact, onCancel, onSave }) {
  const [selected, setSelected] = React.useState(prefillContact || null)
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [status, setStatus] = React.useState('confirmed')

  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const digits = q.replace(/\D/g, '')
    return window.KIT_DATA.contacts
      .filter((c) => c.name.toLowerCase().includes(q) || (digits && (c.phone || '').replace(/\D/g, '').includes(digits)))
      .slice(0, 5)
  }, [query])

  function pick(c) { setSelected(c); setQuery(''); setOpen(false) }

  return (
    <div>
      <div className="phead"><div><h1 className="phead__title">Novo pedido</h1></div></div>

      <div className="card card--pad" style={{ maxWidth: 520 }}>
        <div className="form">
          {/* Cliente — autocomplete */}
          <div className="field">
            <label className="label">Cliente</label>
            {selected ? (
              <div className="picked">
                <span className="picked__id">
                  <Avatar name={selected.name} size="sm" />
                  <span>
                    <span className="picked__name">{selected.name}</span>
                    <span className="picked__phone">{selected.phone}</span>
                  </span>
                </span>
                <Button variant="ghost" size="sm" onClick={() => { setSelected(null); setQuery('') }}>Trocar</Button>
              </div>
            ) : (
              <div className="autocomplete">
                <span className="search" style={{ display: 'block' }}>
                  <Icon name="search" size={16} className="search__icon" />
                  <input
                    className="input"
                    placeholder="Buscar cliente por nome ou telefone…"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
                    onFocus={() => setOpen(true)}
                  />
                </span>
                {open && suggestions.length > 0 && (
                  <div className="ac-list">
                    {suggestions.map((c) => (
                      <button type="button" key={c.id} className="ac-item" onClick={() => pick(c)}>
                        <Avatar name={c.name} size="sm" />
                        <span className="ac-item__main">
                          <span className="ac-item__name">{c.name}</span>
                          <span className="ac-item__phone">{c.phone}</span>
                        </span>
                        <StatusBadge status={c.status} dot={false} />
                      </button>
                    ))}
                  </div>
                )}
                {open && query.trim() && suggestions.length === 0 && (
                  <div className="ac-list"><div className="ac-empty">Nenhum cliente. <a className="ac-link">+ Novo cliente</a></div></div>
                )}
              </div>
            )}
          </div>

          {/* Quantidade + Total */}
          <div className="form__row">
            <div className="field">
              <label className="label">Quantidade</label>
              <input className="input num" type="number" inputMode="numeric" placeholder="500" />
            </div>
            <div className="field">
              <label className="label">Total (R$)</label>
              <input className="input num" type="number" inputMode="decimal" step="0.01" placeholder="1.480,00" />
            </div>
          </div>

          {/* Modelo + Tamanho */}
          <div className="form__row">
            <div className="field">
              <label className="label">Modelo</label>
              <input className="input" placeholder="Kraft alça torcida" />
            </div>
            <div className="field">
              <label className="label">Tamanho</label>
              <input className="input" placeholder="28×35 cm" />
            </div>
          </div>

          {/* Status */}
          <div className="field">
            <label className="label">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} options={window.KIT_DATA.orderStatusOptions} />
          </div>

          {/* Endereço */}
          <div className="field">
            <label className="label">Endereço de entrega</label>
            <input className="input" placeholder="Rua, número, bairro — cidade/UF" />
          </div>

          {/* Observações */}
          <div className="field">
            <label className="label">Observações</label>
            <textarea className="textarea" placeholder="Cor da impressão, prazo combinado, contato na entrega…" />
          </div>

          <div className="form__actions">
            <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
            <Button variant="primary" onClick={onSave}>Salvar pedido</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
window.OrderForm = OrderForm
