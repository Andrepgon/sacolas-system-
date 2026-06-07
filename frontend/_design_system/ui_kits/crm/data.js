/* Sacolas CRM UI kit — mock data (realistic pt-BR). Window-assigned. */

window.KIT_DATA = {
  stats: {
    receita: 'R$ 12.480', receitaDelta: '18%', receitaDir: 'up',
    pedidos: '38', ticket: 'R$ 328',
    clientes: '64', ltv: 'R$ 1.940',
    leads: '7', leadsSemResposta: 2,
  },
  receitaMensal: [
    { mes: 'set', receita: 6200 }, { mes: 'out', receita: 7400 },
    { mes: 'nov', receita: 9100 }, { mes: 'dez', receita: 13800 },
    { mes: 'jan', receita: 8600 }, { mes: 'fev', receita: 10200 },
    { mes: 'mar', receita: 12480 },
  ],
  segmentos: [
    { segment: 'papelaria', total: 21 }, { segment: 'restaurante', total: 16 },
    { segment: 'confeitaria', total: 13 }, { segment: 'boutique', total: 9 },
    { segment: 'outro', total: 5 },
  ],
  atencao: [
    { tone: 'amber', label: 'Clientes pra reativar', count: 5, view: 'reativar' },
    { tone: 'danger', label: 'Em risco — sem comprar há +60 dias', count: 3, view: 'risco' },
    { tone: 'info', label: 'Leads sem resposta há +3 dias', count: 2, view: 'leads' },
  ],
  contacts: [
    { id: '1', name: 'Papelaria Aurora', business: 'Papelaria Aurora', phone: '(11) 98812-4410', segment: 'papelaria', status: 'customer', ltv: 4820, orders: 11, lastOrder: 'há 6 dias' },
    { id: '2', name: 'Bistrô do Tó', business: 'Restaurante', phone: '(11) 99654-2201', segment: 'restaurante', status: 'customer', ltv: 3960, orders: 8, lastOrder: 'há 12 dias' },
    { id: '3', name: 'Confeitaria Bem-Doce', business: 'Confeitaria', phone: '(11) 99123-7788', segment: 'confeitaria', status: 'customer', ltv: 3210, orders: 7, lastOrder: 'há 21 dias' },
    { id: '4', name: 'Boutique Lis', business: 'Boutique', phone: '(11) 98800-1122', segment: 'boutique', status: 'customer', ltv: 2780, orders: 6, lastOrder: 'há 34 dias' },
    { id: '5', name: 'Maria Souza', business: 'Ateliê Maria', phone: '(11) 99777-0099', segment: 'outro', status: 'lead', ltv: 0, orders: 0, lastOrder: null },
    { id: '6', name: 'Padaria Pão Quente', business: 'Padaria', phone: '(11) 98345-6611', segment: 'restaurante', status: 'customer', ltv: 2140, orders: 5, lastOrder: 'há 41 dias' },
    { id: '7', name: 'Livraria Sebo Velho', business: 'Papelaria', phone: '(11) 99001-2233', segment: 'papelaria', status: 'inactive', ltv: 980, orders: 3, lastOrder: 'há 4 meses' },
    { id: '8', name: 'João Mendes', business: null, phone: '(11) 99555-8080', segment: 'outro', status: 'lead', ltv: 0, orders: 0, lastOrder: null },
    { id: '9', name: 'Doceria Açúcar & Sal', business: 'Confeitaria', phone: '(11) 98122-3434', segment: 'confeitaria', status: 'customer', ltv: 1760, orders: 4, lastOrder: 'há 18 dias' },
    { id: '10', name: 'Floricultura Bela Flor', business: 'Boutique', phone: '(11) 99876-5544', segment: 'boutique', status: 'inactive', ltv: 620, orders: 2, lastOrder: 'há 5 meses' },
  ],
  segOptions: [
    { value: 'all', label: 'Todos os segmentos' },
    { value: 'papelaria', label: 'Papelaria' },
    { value: 'restaurante', label: 'Restaurante' },
    { value: 'boutique', label: 'Boutique' },
    { value: 'confeitaria', label: 'Confeitaria' },
    { value: 'outro', label: 'Outro' },
  ],
  statusOptions: [
    { value: 'all', label: 'Todos os status' },
    { value: 'lead', label: 'Leads' },
    { value: 'customer', label: 'Clientes' },
    { value: 'inactive', label: 'Inativos' },
  ],
  orderStatusOptions: [
    { value: 'quote', label: 'Orçamento' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'vector_pending', label: 'Aguardando vetor' },
    { value: 'factory_pending', label: 'Na fábrica' },
    { value: 'printing', label: 'Em impressão' },
    { value: 'ready_to_deliver', label: 'Pronto p/ entregar' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'paid', label: 'Pago' },
    { value: 'cancelled', label: 'Cancelado' },
  ],
  views: {
    reativar: {
      title: 'Clientes pra reativar',
      context: 'Sem comprar há mais de 30 dias — vale um alô antes de esfriar.',
      tone: 'amber',
      rows: [
        { id: '4', since: 'há 34 dias' },
        { id: '6', since: 'há 41 dias' },
        { id: '3', since: 'há 38 dias' },
        { id: '9', since: 'há 45 dias' },
        { id: '2', since: 'há 32 dias' },
      ],
    },
    risco: {
      title: 'Clientes em risco',
      context: 'Sem comprar há mais de 60 dias. Eram recorrentes — reconquiste agora.',
      tone: 'danger',
      rows: [
        { id: '7', since: 'há 4 meses' },
        { id: '10', since: 'há 5 meses' },
        { id: '1', since: 'há 78 dias' },
      ],
    },
    leads: {
      title: 'Leads sem resposta há +3 dias',
      context: 'Pediram orçamento e ficaram no vácuo. Um lembrete costuma destravar.',
      tone: 'info',
      rows: [
        { id: '5', since: 'sem resposta há 6 dias' },
        { id: '8', since: 'sem resposta há 4 dias' },
      ],
    },
  },
}
