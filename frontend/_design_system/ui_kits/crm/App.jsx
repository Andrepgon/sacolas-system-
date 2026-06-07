/* App shell — sidebar/tabbar + screen router. Click-through interactive. */

function App() {
  const [screen, setScreen] = React.useState('overview')
  const [selected, setSelected] = React.useState(null)
  const [viewVariant, setViewVariant] = React.useState('reativar')

  function navigate(key) { setSelected(null); setScreen(key) }
  function openContact(c) { setSelected(c); setScreen('detail') }
  function newContact() { setScreen('new') }
  function newOrder(c) { setSelected(c || null); setScreen('newOrder') }
  function openView(v) { setViewVariant(v); setScreen('view') }

  const activeNav = (screen === 'detail' || screen === 'new' || screen === 'newOrder' || screen === 'view') ? (screen === 'view' ? 'overview' : 'contacts') : screen

  let view
  if (screen === 'overview') view = <Dashboard onNavigate={navigate} onOpenView={openView} />
  else if (screen === 'contacts') view = <Contacts onOpen={openContact} onNew={newContact} />
  else if (screen === 'orders' || screen === 'top') view = <TopClients onOpen={openContact} />
  else if (screen === 'new') view = <NewContact onCancel={() => navigate('contacts')} onSave={() => navigate('contacts')} />
  else if (screen === 'newOrder') view = <OrderForm prefillContact={selected} onCancel={() => (selected ? openContact(selected) : navigate('contacts'))} onSave={() => (selected ? openContact(selected) : navigate('contacts'))} />
  else if (screen === 'view') view = <ViewList variant={viewVariant} onOpen={openContact} onChangeVariant={setViewVariant} />
  else if (screen === 'detail' && selected) view = <ContactDetail contact={selected} onBack={() => navigate('contacts')} onNewOrder={newOrder} />
  else view = <Dashboard onNavigate={navigate} onOpenView={openView} />

  return (
    <div className="app">
      <div className="app__rail">
        <Sidebar active={activeNav} onNavigate={navigate} onNew={newContact} />
      </div>
      <div className="app__main">
        <div className="app__scroll">
          <div className="content">{view}</div>
        </div>
        <div className="app__tabbar">
          <BottomTabBar active={activeNav} onNavigate={navigate} onNew={newContact} />
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
