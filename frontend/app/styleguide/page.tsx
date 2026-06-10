'use client'

import { Phone, Plus, Search } from 'lucide-react'
import {
  Avatar,
  AttentionItem,
  Badge,
  BottomTabBar,
  Button,
  Card,
  ContactRow,
  Input,
  KpiCard,
  Select,
  Sidebar,
  StatusBadge,
} from '@/components/ds'

type Swatch = {
  name: string
  value: string
  textOnBg?: 'light' | 'dark'
}

const semantic: Swatch[] = [
  { name: '--background', value: 'hsl(210 20% 98%)', textOnBg: 'dark' },
  { name: '--foreground', value: 'hsl(222 47% 11%)', textOnBg: 'light' },
  { name: '--card', value: 'hsl(0 0% 100%)', textOnBg: 'dark' },
  { name: '--popover', value: 'hsl(0 0% 100%)', textOnBg: 'dark' },
  { name: '--primary', value: 'hsl(35 78% 41%)', textOnBg: 'light' },
  { name: '--secondary', value: 'hsl(210 40% 96%)', textOnBg: 'dark' },
  { name: '--muted', value: 'hsl(210 40% 96%)', textOnBg: 'dark' },
  { name: '--accent', value: 'hsl(210 40% 96%)', textOnBg: 'dark' },
  { name: '--border', value: 'hsl(214 32% 91%)', textOnBg: 'dark' },
  { name: '--ring', value: 'hsl(35 78% 41%)', textOnBg: 'light' },
  { name: '--success', value: 'hsl(160 84% 39%)', textOnBg: 'light' },
  { name: '--warning', value: 'hsl(35 78% 41%)', textOnBg: 'light' },
  { name: '--destructive', value: 'hsl(0 72% 51%)', textOnBg: 'light' },
  { name: '--info', value: 'hsl(211 80% 43%)', textOnBg: 'light' },
]

const slate: Swatch[] = [
  { name: '--slate-50', value: '#f8fafc', textOnBg: 'dark' },
  { name: '--slate-100', value: '#f1f5f9', textOnBg: 'dark' },
  { name: '--slate-200', value: '#e2e8f0', textOnBg: 'dark' },
  { name: '--slate-300', value: '#cbd5e1', textOnBg: 'dark' },
  { name: '--slate-400', value: '#94a3b8', textOnBg: 'light' },
  { name: '--slate-500', value: '#64748b', textOnBg: 'light' },
  { name: '--slate-600', value: '#475569', textOnBg: 'light' },
  { name: '--slate-700', value: '#334155', textOnBg: 'light' },
  { name: '--slate-900', value: '#0f172a', textOnBg: 'light' },
]

const amber: Swatch[] = [
  { name: '--amber-50', value: '#fbf3e6', textOnBg: 'dark' },
  { name: '--amber-100', value: '#f3e0c2', textOnBg: 'dark' },
  { name: '--amber-600', value: '#ba7517', textOnBg: 'light' },
  { name: '--amber-700', value: '#9a6010', textOnBg: 'light' },
]

const chart: Swatch[] = [
  { name: '--chart-bar', value: '#378add', textOnBg: 'light' },
  { name: '--chart-bar-peak', value: '#185fa5', textOnBg: 'light' },
  { name: '--chart-seg-1', value: '#185fa5', textOnBg: 'light' },
  { name: '--chart-seg-2', value: '#378add', textOnBg: 'light' },
  { name: '--chart-seg-3', value: '#85b7eb', textOnBg: 'dark' },
  { name: '--chart-seg-4', value: '#b5d4f4', textOnBg: 'dark' },
  { name: '--chart-seg-other', value: '#d3d1c7', textOnBg: 'dark' },
  { name: '--chart-grid', value: '#e2e8f0', textOnBg: 'dark' },
]

function SwatchCard({ swatch }: { swatch: Swatch }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-20 w-full rounded-md border"
        style={{
          background: swatch.value,
          borderColor: 'var(--border-subtle)',
        }}
      />
      <div className="flex flex-col">
        <code className="text-xs font-medium text-[color:var(--text-primary)]">
          {swatch.name}
        </code>
        <code className="text-xs text-[color:var(--text-secondary)]">
          {swatch.value}
        </code>
      </div>
    </div>
  )
}

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {swatches.map((s) => (
        <SwatchCard key={s.name} swatch={s} />
      ))}
    </div>
  )
}

function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2
        className="text-[color:var(--text-primary)]"
        style={{
          fontSize: 'var(--text-section-size)',
          lineHeight: 'var(--text-section-lh)',
          fontWeight: 'var(--weight-medium)',
        }}
      >
        {title}
      </h2>
      {hint ? (
        <p
          className="text-[color:var(--text-secondary)]"
          style={{
            fontSize: 'var(--text-hint-size)',
            lineHeight: 'var(--text-hint-lh)',
          }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const typeScale = [
  {
    name: 'Page title',
    token: 'text-page',
    sample: 'Visão geral',
    size: 'var(--text-page-size)',
    lh: 'var(--text-page-lh)',
    weight: 'var(--weight-medium)',
    tracking: 'var(--tracking-tight)',
  },
  {
    name: 'KPI value',
    token: 'text-kpi',
    sample: 'R$ 128.430',
    size: 'var(--text-kpi-size)',
    lh: 'var(--text-kpi-lh)',
    weight: 'var(--weight-medium)',
    tracking: 'var(--tracking-tight)',
    mono: true,
  },
  {
    name: 'Section heading',
    token: 'text-section',
    sample: 'Clientes em atenção',
    size: 'var(--text-section-size)',
    lh: 'var(--text-section-lh)',
    weight: 'var(--weight-medium)',
    tracking: 'var(--tracking-normal)',
  },
  {
    name: 'Card title',
    token: 'text-card',
    sample: 'Pedidos do mês',
    size: 'var(--text-card-size)',
    lh: 'var(--text-card-lh)',
    weight: 'var(--weight-medium)',
    tracking: 'var(--tracking-normal)',
  },
  {
    name: 'Body',
    token: 'text-body',
    sample:
      'Texto corrido de apoio, com peso regular e leitura confortável a 14px.',
    size: 'var(--text-body-size)',
    lh: 'var(--text-body-lh)',
    weight: 'var(--weight-regular)',
    tracking: 'var(--tracking-normal)',
  },
  {
    name: 'Form label',
    token: 'text-label',
    sample: 'Nome do contato',
    size: 'var(--text-label-size)',
    lh: 'var(--text-label-lh)',
    weight: 'var(--weight-medium)',
    tracking: 'var(--tracking-normal)',
  },
  {
    name: 'Hint / caption',
    token: 'text-hint',
    sample: 'Atualizado há 2 minutos',
    size: 'var(--text-hint-size)',
    lh: 'var(--text-hint-lh)',
    weight: 'var(--weight-regular)',
    tracking: 'var(--tracking-normal)',
  },
]

const spaces = [
  { name: '--space-1', value: '0.25rem' },
  { name: '--space-2', value: '0.5rem' },
  { name: '--space-3', value: '0.75rem' },
  { name: '--space-4', value: '1rem' },
  { name: '--space-5', value: '1.25rem' },
  { name: '--space-6', value: '1.5rem' },
  { name: '--space-8', value: '2rem' },
  { name: '--space-10', value: '2.5rem' },
  { name: '--space-12', value: '3rem' },
]

const radii = [
  { name: '--radius-sm', value: '0.25rem' },
  { name: '--radius-md', value: '0.375rem' },
  { name: '--radius-lg', value: '0.5rem' },
  { name: '--radius-xl', value: '0.75rem' },
  { name: '--radius-full', value: '9999px' },
]

const shadows = [
  { name: '--shadow-xs', cls: 'shadow-xs' },
  { name: '--shadow-sm', cls: 'shadow-sm' },
  { name: '--shadow-md', cls: 'shadow-md' },
  { name: '--shadow-lg', cls: 'shadow-lg' },
  { name: '--shadow-focus', cls: 'shadow-focus' },
]

export default function StyleguidePage() {
  return (
    <div
      className="mx-auto max-w-[1100px] px-6 py-10"
      style={{ background: 'var(--surface-page)' }}
    >
      <header className="mb-10 flex flex-col gap-2">
        <p
          className="uppercase"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-hint-size)',
            lineHeight: 'var(--text-hint-lh)',
            letterSpacing: '0.08em',
          }}
        >
          Sacolas CRM · Design system
        </p>
        <h1
          className="text-[color:var(--text-primary)]"
          style={{
            fontSize: 'var(--text-page-size)',
            lineHeight: 'var(--text-page-lh)',
            fontWeight: 'var(--weight-medium)',
            letterSpacing: 'var(--tracking-tight)',
          }}
        >
          Styleguide — fundação (Leva 1)
        </h1>
        <p
          className="text-[color:var(--text-secondary)]"
          style={{
            fontSize: 'var(--text-body-size)',
            lineHeight: 'var(--text-body-lh)',
          }}
        >
          Tokens base portados de <code className="mono">_design_system/tokens/</code>.
          Sem componentes nem telas — só a fundação para revisão.
        </p>
      </header>

      <div className="flex flex-col gap-14">
        <section className="flex flex-col gap-6">
          <SectionHeading
            title="Componentes"
            hint="Reimplementados em TS+Tailwind a partir das specs em _design_system/components/."
          />

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Button
            </h3>
            <Card>
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Salvar</Button>
                  <Button variant="secondary">Cancelar</Button>
                  <Button variant="outline">Editar</Button>
                  <Button variant="ghost">Voltar</Button>
                  <Button variant="destructive">Excluir</Button>
                  <Button variant="link">Saber mais</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm">
                    Pequeno
                  </Button>
                  <Button variant="primary" size="default">
                    Padrão
                  </Button>
                  <Button variant="primary" size="lg">
                    Grande
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Buscar">
                    <Search size={16} strokeWidth={1.75} />
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    iconLeft={<Plus size={16} strokeWidth={1.75} />}
                  >
                    Novo cliente
                  </Button>
                  <Button
                    variant="outline"
                    iconLeft={<Phone size={16} strokeWidth={1.75} />}
                  >
                    Ligar
                  </Button>
                  <Button variant="primary" disabled>
                    Desabilitado
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Badge
            </h3>
            <Card>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="customer" dot>
                    Cliente
                  </Badge>
                  <Badge variant="lead" dot>
                    Lead
                  </Badge>
                  <Badge variant="inactive" dot>
                    Inativo
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="info" dot>
                    Aguardando vetor
                  </Badge>
                  <Badge variant="success" dot>
                    Entregue
                  </Badge>
                  <Badge variant="warning" dot>
                    Em impressão
                  </Badge>
                  <Badge variant="destructive" dot>
                    Cancelado
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="accent">Accent</Badge>
                  <Badge variant="customer">Sem dot</Badge>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Avatar
            </h3>
            <Card>
              <div className="flex items-end gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Avatar name="Maria Souza" size="sm" />
                  <code
                    className="text-[color:var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-hint-size)' }}
                  >
                    sm · 28
                  </code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar name="Padaria Pão Quente" />
                  <code
                    className="text-[color:var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-hint-size)' }}
                  >
                    default · 36
                  </code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar name="João Pereira" size="lg" />
                  <code
                    className="text-[color:var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-hint-size)' }}
                  >
                    lg · 44
                  </code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar name="?" />
                  <code
                    className="text-[color:var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-hint-size)' }}
                  >
                    empty
                  </code>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Card
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card title="Receita & pedidos por mês">
                <p
                  className="text-[color:var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-body-size)' }}
                >
                  Card padrão — superfície branca, borda slate-200, radius-lg.
                </p>
              </Card>
              <Card muted>
                <p
                  className="text-[color:var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-body-size)' }}
                >
                  Card <code className="mono">muted</code> — fill slate-100, sem
                  borda. Usado em KPIs.
                </p>
              </Card>
              <Card interactive>
                <p
                  className="text-[color:var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-body-size)' }}
                >
                  Card <code className="mono">interactive</code> — cursor + hover.
                </p>
              </Card>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Input + Select
            </h3>
            <Card>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sg-input"
                    className="text-[color:var(--text-primary)]"
                    style={{
                      fontSize: 'var(--text-label-size)',
                      fontWeight: 'var(--weight-medium)',
                    }}
                  >
                    Nome do contato
                  </label>
                  <Input
                    id="sg-input"
                    placeholder="Buscar por nome ou telefone…"
                    defaultValue=""
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sg-input-invalid"
                    className="text-[color:var(--text-primary)]"
                    style={{
                      fontSize: 'var(--text-label-size)',
                      fontWeight: 'var(--weight-medium)',
                    }}
                  >
                    Telefone (inválido)
                  </label>
                  <Input id="sg-input-invalid" invalid defaultValue="11 9999" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sg-input-disabled"
                    className="text-[color:var(--text-primary)]"
                    style={{
                      fontSize: 'var(--text-label-size)',
                      fontWeight: 'var(--weight-medium)',
                    }}
                  >
                    Campo desabilitado
                  </label>
                  <Input
                    id="sg-input-disabled"
                    disabled
                    defaultValue="Não editável"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sg-select-status"
                    className="text-[color:var(--text-primary)]"
                    style={{
                      fontSize: 'var(--text-label-size)',
                      fontWeight: 'var(--weight-medium)',
                    }}
                  >
                    Status
                  </label>
                  <Select
                    id="sg-select-status"
                    placeholder="Todos os status"
                    options={[
                      { value: 'lead', label: 'Leads' },
                      { value: 'customer', label: 'Clientes' },
                      { value: 'inactive', label: 'Inativos' },
                    ]}
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label
                    htmlFor="sg-select-segment"
                    className="text-[color:var(--text-primary)]"
                    style={{
                      fontSize: 'var(--text-label-size)',
                      fontWeight: 'var(--weight-medium)',
                    }}
                  >
                    Segmento
                  </label>
                  <Select
                    id="sg-select-segment"
                    options={[
                      'papelaria',
                      'restaurante',
                      'boutique',
                      'confeitaria',
                      'outro',
                    ]}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              KpiCard
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                label="Receita do mês"
                value="R$ 12.480"
                delta="18%"
                deltaDir="up"
                sub="Ticket médio R$ 312"
              />
              <KpiCard
                label="Pedidos abertos"
                value="42"
                delta="3%"
                deltaDir="down"
                sub="vs mês anterior"
              />
              <KpiCard
                label="LTV médio"
                value="R$ 1.840"
                delta="estável"
                deltaDir="flat"
                sub="últimos 90 dias"
              />
              <KpiCard
                label="Leads abertos"
                value="7"
                sub="2 sem resposta"
                alertSub
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              StatusBadge
            </h3>
            <Card>
              <div className="flex flex-col gap-4">
                <div>
                  <p
                    className="mb-2 text-[color:var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-hint-size)' }}
                  >
                    Contatos
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status="lead" />
                    <StatusBadge status="customer" />
                    <StatusBadge status="inactive" />
                    <StatusBadge status="churned" />
                  </div>
                </div>
                <div>
                  <p
                    className="mb-2 text-[color:var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-hint-size)' }}
                  >
                    Pipeline de pedido
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status="quote" />
                    <StatusBadge status="signal_paid" />
                    <StatusBadge status="vector_pending" />
                    <StatusBadge status="factory_pending" />
                    <StatusBadge status="printing" />
                    <StatusBadge status="ready_to_deliver" />
                    <StatusBadge status="delivered" />
                    <StatusBadge status="paid" />
                    <StatusBadge status="cancelled" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              ContactRow
            </h3>
            <Card padded={false}>
              <ContactRow
                name="Maria Souza"
                business="Papelaria Aurora"
                status="customer"
                ltv="R$ 2.480"
                lastOrder="há 12 dias"
              />
              <ContactRow
                name="João Pereira"
                business="Restaurante do João"
                status="lead"
                ltv="R$ 0"
                lastOrder="sem pedido"
              />
              <ContactRow
                name="Padaria Pão Quente"
                phone="(11) 98765-4321"
                status="inactive"
                ltv="R$ 540"
                lastOrder="há 4 meses"
              />
              <ContactRow
                name="Confeitaria Doce Lar"
                business="Atelier de bolos"
                status="customer"
                ltv="R$ 8.120"
                lastOrder="há 3 dias"
              />
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              AttentionItem
            </h3>
            <Card title="Precisa de atenção hoje">
              <AttentionItem
                tone="amber"
                label="Clientes pra reativar"
                count={5}
              />
              <AttentionItem
                tone="danger"
                label="Em risco — sem comprar há +60 dias"
                count={3}
              />
              <AttentionItem
                tone="info"
                label="Leads sem resposta há +3 dias"
                count={2}
              />
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Sidebar (desktop)
            </h3>
            <div
              className="overflow-hidden rounded-lg border"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex h-[420px]">
                <Sidebar active="contacts" />
                <div className="flex-1 bg-[var(--surface-page)] p-6">
                  <p
                    className="text-[color:var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-body-size)' }}
                  >
                    Área de conteúdo (placeholder). Sidebar fixa em 220px com item
                    ativo destacado pela barra âmbar e fill slate-100.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-card-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              BottomTabBar (mobile)
            </h3>
            <div
              className="mx-auto w-full max-w-[400px] overflow-hidden rounded-lg border bg-[var(--surface-page)]"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <div className="h-32 p-4">
                <p
                  className="text-[color:var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-body-size)' }}
                >
                  Conteúdo da tela (preview 375px).
                </p>
              </div>
              <BottomTabBar active="overview" />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Paleta semântica"
            hint="Tokens shadcn (HSL). Componentes usam estas chaves, nunca cores cruas."
          />
          <SwatchGrid swatches={semantic} />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Slate (neutro)"
            hint="Base neutra do app. Texto, superfícies, hairlines."
          />
          <SwatchGrid swatches={slate} />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Kraft-amber (acento)"
            hint="Acento único. Botão primário e nav ativa apenas — nunca decoração."
          />
          <SwatchGrid swatches={amber} />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Paleta de gráfico"
            hint="Monocromática azul. Cor semântica nunca aparece em chart."
          />
          <SwatchGrid swatches={chart} />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Tipografia"
            hint="Geist em duas únicas grossuras: 400 e 500. Sentence case sempre."
          />
          <div
            className="flex flex-col divide-y rounded-lg border bg-white"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {typeScale.map((t) => (
              <div
                key={t.token}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex flex-col sm:w-48 sm:shrink-0">
                  <code
                    className="text-[color:var(--text-primary)]"
                    style={{
                      fontSize: 'var(--text-label-size)',
                      fontWeight: 'var(--weight-medium)',
                    }}
                  >
                    {t.name}
                  </code>
                  <code
                    className="text-[color:var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-hint-size)' }}
                  >
                    {t.token} · {t.size} / {t.weight}
                  </code>
                </div>
                <span
                  className={`text-[color:var(--text-primary)] ${t.mono ? 'mono' : ''}`}
                  style={{
                    fontSize: t.size,
                    lineHeight: t.lh,
                    fontWeight: t.weight,
                    letterSpacing: t.tracking,
                  }}
                >
                  {t.sample}
                </span>
              </div>
            ))}
          </div>
          <div
            className="rounded-lg border bg-white p-5"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <p
              className="mb-3 text-[color:var(--text-secondary)]"
              style={{ fontSize: 'var(--text-hint-size)' }}
            >
              Numerais tabulares (Geist Mono) — uso para LTV, totais, IDs.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span
                  className="text-[color:var(--text-hint)]"
                  style={{ fontSize: 'var(--text-hint-size)' }}
                >
                  Receita
                </span>
                <span
                  className="mono text-[color:var(--text-primary)]"
                  style={{
                    fontSize: 'var(--text-kpi-size)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  R$ 128.430
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[color:var(--text-hint)]"
                  style={{ fontSize: 'var(--text-hint-size)' }}
                >
                  Pedidos
                </span>
                <span
                  className="mono text-[color:var(--text-primary)]"
                  style={{
                    fontSize: 'var(--text-kpi-size)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  342
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[color:var(--text-hint)]"
                  style={{ fontSize: 'var(--text-hint-size)' }}
                >
                  Ticket médio
                </span>
                <span
                  className="mono text-[color:var(--text-primary)]"
                  style={{
                    fontSize: 'var(--text-kpi-size)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  R$ 375,52
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Espaçamento"
            hint="Escala base 4px. Padding padrão de card: --space-4 (mobile) / --space-6 (desktop)."
          />
          <div
            className="flex flex-col gap-3 rounded-lg border bg-white p-5"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {spaces.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <code
                  className="w-28 shrink-0 text-[color:var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-hint-size)' }}
                >
                  {s.name}
                </code>
                <div
                  style={{
                    height: '0.5rem',
                    width: s.value,
                    background: 'var(--amber-600)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
                <code
                  className="text-[color:var(--text-hint)]"
                  style={{ fontSize: 'var(--text-hint-size)' }}
                >
                  {s.value}
                </code>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Raio de borda"
            hint="--radius-lg (0.5rem) é o padrão dos cards. Pills usam --radius-full."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {radii.map((r) => (
              <div key={r.name} className="flex flex-col items-start gap-2">
                <div
                  className="h-20 w-full border"
                  style={{
                    background: 'var(--amber-50)',
                    borderColor: 'var(--amber-600)',
                    borderRadius: r.value,
                  }}
                />
                <code
                  className="text-[color:var(--text-primary)]"
                  style={{
                    fontSize: 'var(--text-hint-size)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  {r.name}
                </code>
                <code
                  className="text-[color:var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-hint-size)' }}
                >
                  {r.value}
                </code>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Elevação (sombra)"
            hint="Cards se apoiam na borda, não na sombra. Use shadow-md+ só em popover/dialog."
          />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {shadows.map((s) => (
              <div key={s.name} className="flex flex-col items-start gap-3">
                <div
                  className={`h-20 w-full rounded-lg bg-white ${s.cls}`}
                  style={{ border: '1px solid var(--border-subtle)' }}
                />
                <code
                  className="text-[color:var(--text-primary)]"
                  style={{
                    fontSize: 'var(--text-hint-size)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  {s.name}
                </code>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Layout"
            hint="Constantes de chrome do app — sidebar/topbar/tabbar e largura do conteúdo."
          />
          <div
            className="grid grid-cols-1 gap-3 rounded-lg border bg-white p-5 sm:grid-cols-2"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {[
              { name: '--sidebar-width', value: '220px' },
              { name: '--topbar-height', value: '56px' },
              { name: '--tabbar-height', value: '56px' },
              { name: '--content-max', value: '1100px' },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-baseline justify-between"
              >
                <code
                  className="text-[color:var(--text-primary)]"
                  style={{
                    fontSize: 'var(--text-label-size)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  {row.name}
                </code>
                <code
                  className="text-[color:var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-hint-size)' }}
                >
                  {row.value}
                </code>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
