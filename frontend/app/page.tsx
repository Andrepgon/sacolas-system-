'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { api } from '@/lib/api'
import { AttentionItem, Card, KpiCard } from '@/components/ds'

type DashboardSummary = {
  receita_mes: number | string
  receita_de_pagos: number | string
  receita_de_sinais: number | string
  pedidos_em_aberto: number
  saldo_a_receber: number | string
  pedidos_mes: number
  ticket_medio: number | string
  renda_media_diaria: number | string
  receita_mes_anterior: number | string
  delta_receita_pct: number | string | null
  total_customers: number
  ltv_medio: number | string
  total_leads: number
  leads_sem_resposta: number
}

type ReceitaMensalRow = {
  mes: string
  pedidos: number
  receita: number | string
}

type PorSegmentoRow = {
  segment: string
  total_clientes: number
  receita_total: number | string
}

type ViewContact = { id: string }

function toNum(v: number | string | null | undefined): number {
  if (v == null) return 0
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

function formatBRL(v: number): string {
  return `R$ ${v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

function pickDeltaDir(pct: number | null): 'up' | 'down' | 'flat' {
  if (pct === null) return 'flat'
  if (pct > 0.5) return 'up'
  if (pct < -0.5) return 'down'
  return 'flat'
}

export default function DashboardPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [receitaMensal, setReceitaMensal] = useState<ReceitaMensalRow[]>([])
  const [porSegmento, setPorSegmento] = useState<PorSegmentoRow[]>([])
  const [reativarCount, setReativarCount] = useState<number | null>(null)
  const [emRiscoCount, setEmRiscoCount] = useState<number | null>(null)
  const [leadsSemRespostaCount, setLeadsSemRespostaCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    void fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    setErr(null)
    try {
      const [s, rm, ps, rea, ris, leads] = await Promise.all([
        api.get<DashboardSummary>('/views/dashboard-summary'),
        api.get<ReceitaMensalRow[]>('/views/receita-mensal'),
        api.get<PorSegmentoRow[]>('/views/por-segmento'),
        api.get<ViewContact[]>('/views/para-reativar'),
        api.get<ViewContact[]>('/views/em-risco'),
        api.get<ViewContact[]>('/views/leads-sem-resposta'),
      ])
      setSummary(s.data)
      setReceitaMensal(rm.data)
      setPorSegmento(ps.data)
      setReativarCount(rea.data.length)
      setEmRiscoCount(ris.data.length)
      setLeadsSemRespostaCount(leads.data.length)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Falha ao carregar dashboard')
    } finally {
      setLoading(false)
    }
  }

  const deltaPct =
    summary?.delta_receita_pct == null ? null : toNum(summary.delta_receita_pct)
  const deltaDir = pickDeltaDir(deltaPct)
  const deltaText =
    deltaPct === null
      ? null
      : `${Math.abs(deltaPct).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%`

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
      <header className="mb-5 flex flex-col gap-1">
        <h1
          className="m-0 text-[color:var(--text-primary)]"
          style={{
            fontSize: 'var(--text-page-size)',
            lineHeight: 'var(--text-page-lh)',
            fontWeight: 'var(--weight-medium)',
            letterSpacing: 'var(--tracking-tight)',
          }}
        >
          Visão geral
        </h1>
        <p
          className="m-0 text-[color:var(--text-secondary)]"
          style={{ fontSize: '13px' }}
        >
          Resumo do mês e o que precisa de atenção hoje
        </p>
      </header>

      {err ? (
        <div
          className="mb-4 rounded-lg border bg-[var(--negative-tint)] px-4 py-3"
          style={{
            borderColor: 'var(--negative)',
            color: 'var(--negative)',
            fontSize: 'var(--text-body-size)',
          }}
        >
          {err}
        </div>
      ) : null}

      <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading || !summary ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              label="Receita do mês"
              value={formatBRL(toNum(summary.receita_mes))}
              delta={deltaText ?? undefined}
              deltaDir={deltaDir}
              sub={
                <>
                  <div>
                    Pagos {formatBRL(toNum(summary.receita_de_pagos))} · Sinais{' '}
                    {formatBRL(toNum(summary.receita_de_sinais))}
                  </div>
                  <div>vs. mês anterior</div>
                </>
              }
            />
            <KpiCard
              label="Renda média diária"
              value={formatBRL(toNum(summary.renda_media_diaria))}
              sub="receita do mês ÷ dias decorridos"
            />
            <KpiCard
              label="Pedidos do mês"
              value={summary.pedidos_mes}
              sub={`Ticket médio ${formatBRL(toNum(summary.ticket_medio))}`}
            />
            <KpiCard
              label="Pedidos em aberto"
              value={summary.pedidos_em_aberto}
              sub={`${formatBRL(toNum(summary.saldo_a_receber))} a receber`}
            />
            <KpiCard
              label="Clientes ativos"
              value={summary.total_customers}
              sub={`LTV médio ${formatBRL(toNum(summary.ltv_medio))}`}
            />
            <KpiCard
              label="Leads abertos"
              value={summary.total_leads}
              sub={
                summary.leads_sem_resposta > 0
                  ? `${summary.leads_sem_resposta} sem resposta`
                  : 'em dia'
              }
              alertSub={summary.leads_sem_resposta > 0}
            />
          </>
        )}
      </section>

      <section className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_1fr]">
        <Card title="Receita por mês">
          {loading ? (
            <ChartSkeleton />
          ) : receitaMensal.length === 0 ? (
            <EmptyChart label="Sem pedidos entregues ainda." />
          ) : (
            <RevenueBars data={receitaMensal} />
          )}
        </Card>

        <Card title="Precisa de atenção hoje">
          {loading ? (
            <AttentionSkeleton />
          ) : (
            <AttentionList
              reativar={reativarCount}
              emRisco={emRiscoCount}
              leadsSemResposta={leadsSemRespostaCount}
              onOpen={(slug) => router.push(`/views/${slug}`)}
            />
          )}
        </Card>
      </section>

      <Card title="Clientes por segmento">
        {loading ? (
          <SegmentSkeleton />
        ) : porSegmento.length === 0 ? (
          <EmptyChart label="Nenhum cliente cadastrado ainda." />
        ) : (
          <SegmentBars data={porSegmento} />
        )}
      </Card>
    </div>
  )
}

function RevenueBars({ data }: { data: ReceitaMensalRow[] }) {
  const rows = data.map((d) => ({
    label: format(parseISO(d.mes), 'MMM', { locale: ptBR }),
    receita: toNum(d.receita),
  }))
  const max = Math.max(1, ...rows.map((r) => r.receita))
  const peakIdx = rows.reduce(
    (best, r, i) => (r.receita > rows[best].receita ? i : best),
    0
  )
  return (
    <div>
      <div className="flex h-[180px] items-end gap-2.5 pt-2">
        {rows.map((r, i) => {
          const h = Math.max(4, (r.receita / max) * 100)
          const isPeak = i === peakIdx
          return (
            <div
              key={`${r.label}-${i}`}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                title={formatBRL(r.receita)}
                className={`w-full max-w-[34px] rounded-t-[4px] ${
                  isPeak ? 'bg-chart-bar-peak' : 'bg-chart-bar'
                }`}
                style={{ height: `${h}%` }}
              />
              <span
                className="text-[color:var(--text-secondary)]"
                style={{ fontSize: '11px' }}
              >
                {r.label}
              </span>
            </div>
          )
        })}
      </div>
      <div
        className="mt-3 flex flex-wrap gap-4 text-[color:var(--text-secondary)]"
        style={{ fontSize: '12px' }}
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-chart-bar-peak" />
          Mês de pico
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-chart-bar" />
          Receita mensal
        </span>
      </div>
    </div>
  )
}

const SEG_BG = [
  'bg-chart-seg-1',
  'bg-chart-seg-2',
  'bg-chart-seg-3',
  'bg-chart-seg-4',
  'bg-chart-seg-other',
] as const

function SegmentBars({ data }: { data: PorSegmentoRow[] }) {
  const rows = data.map((d) => ({
    segment: d.segment,
    total: d.total_clientes,
  }))
  const max = Math.max(1, ...rows.map((r) => r.total))
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div
          key={r.segment}
          className="grid items-center gap-2.5"
          style={{ gridTemplateColumns: '92px 1fr 36px' }}
        >
          <span
            className="capitalize text-[color:var(--text-primary)]"
            style={{ fontSize: '13px' }}
          >
            {r.segment === 'sem_segmento' ? 'sem segmento' : r.segment}
          </span>
          <span className="block h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <span
              className={`block h-full rounded-full ${SEG_BG[i % SEG_BG.length]}`}
              style={{ width: `${(r.total / max) * 100}%` }}
            />
          </span>
          <span
            className="text-right text-[color:var(--text-secondary)] mono"
            style={{ fontSize: '12px' }}
          >
            {r.total}
          </span>
        </div>
      ))}
    </div>
  )
}

function AttentionList({
  reativar,
  emRisco,
  leadsSemResposta,
  onOpen,
}: {
  reativar: number | null
  emRisco: number | null
  leadsSemResposta: number | null
  onOpen: (slug: string) => void
}) {
  const items: { tone: 'amber' | 'danger' | 'info'; label: string; count: number; slug: string }[] = [
    { tone: 'amber', label: 'Clientes pra reativar', count: reativar ?? 0, slug: 'para-reativar' },
    { tone: 'danger', label: 'Em risco — sem comprar há +60 dias', count: emRisco ?? 0, slug: 'em-risco' },
    { tone: 'info', label: 'Leads sem resposta há +3 dias', count: leadsSemResposta ?? 0, slug: 'leads-sem-resposta' },
  ]
  const hasAny = items.some((i) => i.count > 0)
  if (!hasAny) {
    return (
      <p
        className="text-[color:var(--text-secondary)]"
        style={{ fontSize: 'var(--text-body-size)' }}
      >
        Tudo em dia por aqui. Bom trabalho.
      </p>
    )
  }
  return (
    <div className="flex flex-col">
      {items.map((it) => (
        <AttentionItem
          key={it.slug}
          tone={it.tone}
          label={it.label}
          count={it.count}
          onClick={() => onOpen(it.slug)}
        />
      ))}
    </div>
  )
}

function KpiSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-[var(--surface-muted)] p-4">
      <div className="h-3 w-24 animate-pulse rounded bg-[var(--slate-200)]" />
      <div className="h-7 w-32 animate-pulse rounded bg-[var(--slate-200)]" />
      <div className="h-3 w-20 animate-pulse rounded bg-[var(--slate-200)]" />
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="flex h-[180px] items-end gap-2.5 pt-2">
      {[60, 80, 45, 95, 70, 55, 90].map((h, i) => (
        <div
          key={i}
          className="h-full flex-1 animate-pulse rounded-t-[4px] bg-[var(--slate-100)]"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

function SegmentSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[80, 60, 45, 30, 20].map((w, i) => (
        <div key={i} className="grid items-center gap-2.5" style={{ gridTemplateColumns: '92px 1fr 36px' }}>
          <div className="h-3 w-20 animate-pulse rounded bg-[var(--slate-200)]" />
          <div className="block h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <div
              className="h-full animate-pulse rounded-full bg-[var(--slate-200)]"
              style={{ width: `${w}%` }}
            />
          </div>
          <div className="h-3 w-6 animate-pulse rounded bg-[var(--slate-200)]" />
        </div>
      ))}
    </div>
  )
}

function AttentionSkeleton() {
  return (
    <div className="flex flex-col">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-1 py-3 last:border-b-0"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--slate-200)]" />
          <span className="h-3 flex-1 animate-pulse rounded bg-[var(--slate-200)]" />
          <span className="h-3 w-6 animate-pulse rounded bg-[var(--slate-200)]" />
        </div>
      ))}
    </div>
  )
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div
      className="flex h-[180px] items-center justify-center text-[color:var(--text-hint)]"
      style={{ fontSize: 'var(--text-body-size)' }}
    >
      {label}
    </div>
  )
}
