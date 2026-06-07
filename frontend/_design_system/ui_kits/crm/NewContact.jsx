/* Novo cliente — the refined form: normal-size amber Salvar aligned right with
   a secondary Cancelar, segment as a Select (structured), proper pt-BR accents. */

function NewContact({ onCancel, onSave }) {
  const [logo, setLogo] = React.useState(false)
  const [seg, setSeg] = React.useState('papelaria')
  return (
    <div>
      <div className="phead"><div><h1 className="phead__title">Novo cliente</h1></div></div>

      <div className="card card--pad" style={{ maxWidth: 520 }}>
        <div className="form">
          <div className="field">
            <label className="label">Nome</label>
            <input className="input" placeholder="Nome do contato" defaultValue="" />
          </div>
          <div className="field">
            <label className="label">Telefone</label>
            <input className="input" inputMode="tel" placeholder="(11) 98765-4321" />
          </div>
          <div className="field">
            <label className="label">Nome do negócio</label>
            <input className="input" placeholder="Ex.: Papelaria Aurora" />
          </div>
          <div className="form__row">
            <div className="field">
              <label className="label">Segmento</label>
              <Select value={seg} onChange={(e) => setSeg(e.target.value)} options={window.KIT_DATA.segOptions.slice(1)} />
            </div>
            <div className="field">
              <label className="label">Logo vetorizada</label>
              <button type="button" onClick={() => setLogo(!logo)}
                className={`switch${logo ? ' switch--on' : ''}`} aria-pressed={logo}>
                <span className="switch__knob" />
              </button>
            </div>
          </div>
          <div className="field">
            <label className="label">Observações</label>
            <textarea className="textarea" placeholder="Preferências de modelo, prazos, endereço de entrega…" />
          </div>
          <div className="form__actions">
            <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
            <Button variant="primary" onClick={onSave}>Salvar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
window.NewContact = NewContact
