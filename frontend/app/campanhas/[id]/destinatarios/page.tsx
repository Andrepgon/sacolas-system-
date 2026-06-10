'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BellOff,
  Search,
  Trophy,
} from 'lucide-react'

import { api } from '@/lib/api'
import { SEGMENTS } from '@/lib/segments'
import type { Campaign, Contact } from '@/lib/types'
import { Button, Card, Input, Select, StatusBadge } from '@/components/ds'

const BULK_WARNING_THRESHOLD = 200

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'lead', label: 'Leads' },
  { value: 'customer', label: 'Clientes' },
  { value: 'inactive', label: 'Inativos' },
  { value: 'churned', label: 'Perdidos' },
]

const SEGMENT_OPTIONS = [
  { value: 'all', label: 'Todos os segmentos' },
  ...SEGMENTS.map((s) => ({ value: s, label: s })),
]

const TOP_LTV_OPTIONS = [
  { value: '0', label: 'Top LTV: desligado' },
  { value: '10', label: 'Top 10 por LTV' },
  { value: '20', label: 'Top 20 por LTV' },
  { value: '50', label: 'Top 50 por LTV' },
  { value: '100', label: 'Top 100 por LTV' },
]

type StatusFilter = 'all' | Contact['status']

export default function DestinatariosPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  // Filtros
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [segment, setSegment] = useState('all')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [topLtv, setTopLtv] = useState('0')

  // Seleção manual
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const load = useCallback(async (campaignId: string) => {
    setLoading(true)
    setErr(null)
    try {
      const [{ data: camp }, allContacts] = await Promise.all([
        api.get<Campaign>(`/campaigns/${campaignId}`),
        fetchAllContacts(),
      ])
      setCampaign(camp)
      setContacts(allContacts)
    } catch (e: unknown) {
      setErr(extractErr(e, 'Falha ao carregar dados'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!id) return
    void load(id)
  }, [id, load])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const c of contacts) for (const t of c.tags ?? []) set.add(t)
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [contacts])

  // Contatos que passam pelos filtros atuais (visíveis na lista).
  const filtered = useMemo(() => {
    let list = contacts.filter((c) => {
      if (status !== 'all' && c.status !== status) return false
      if (segment !== 'all' && c.segment !== segment) return false
      if (
        activeTags.length > 0 &&
        !activeTags.some((t) => (c.tags ?? []).includes(t))
      )
        return false
      if (search) {
        const q = search.toLowerCase()
        const haystack =
          `${c.name} ${c.business_name ?? ''} ${c.phone}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
    const n = Number(topLtv)
    if (n > 0) {
      list = [...list]
        .sort((a, b) => Number(b.lifetime_value) - Number(a.lifetime_value))
        .slice(0, n)
    } else {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    }
    return list
  }, [contacts, status, segment, activeTags, search, topLtv])

  const selectedContacts = useMemo(
    () => contacts.filter((c) => selected.has(c.id)),
    [contacts, selected],
  )
  const optOutCount = selectedContacts.filter((c) => c.opt_out).length
  const eligibleCount = selectedContacts.length - optOutCount

  function toggleContact(contactId: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(contactId)) next.delete(contactId)
      else next.add(contactId)
      return next
    })
  }

  function selectAllFiltered() {
    setSelected((prev) => {
      const next = new Set(prev)
      for (const c of filtered) next.add(c.id)
      return next
    })
  }

  function clearSelection() {
    setSelected(new Set())
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  async function generateQueue() {
    if (!id || eligibleCount === 0) return
    setGenerating(true)
    try {
      // Só manda quem não tem opt-out (o backend re-valida de qualquer forma).
      const ids = selectedContacts.filter((c) => !c.opt_out).map((c) => c.id)
      const { data } = await api.post<{
        total_recipients: number
        excluded_opt_out: number
      }>(`/campaigns/${id}/recipients`, { contact_ids: ids })
      await api.patch(`/campaigns/${id}`, { status: 'ready' })
      toast.success(
        `Fila gerada: ${data.total_recipients} destinatário${data.total_recipients === 1 ? '' : 's'}`,
      )
      router.push(`/campanhas/${id}/disparar`)
    } catch (e: unknown) {
      toast.error(extractErr(e, 'Falha ao gerar a fila'))
      setGenerating(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6 pb-32">
      <header className="mb-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => router.push(`/campanhas/${id}`)}
          className="inline-flex w-fit items-center gap-1 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
          style={{ fontSize: 'var(--text-hint-size)' }}
        >
          <ArrowLeft size={14} strokeWidth={1.75} /> Voltar pra campanha
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <h1
            className="m-0 text-[color:var(--text-primary)]"
            style={{
              fontSize: 'var(--text-page-size)',
              lineHeight: 'var(--text-page-lh)',
              fontWeight: 'var(--weight-medium)',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            Destinatários
          </h1>
          {campaign ? <StatusBadge status={campaign.status} /> : null}
        </div>
        {campaign ? (
          <p
            className="m-0 text-[color:var(--text-secondary)]"
            style={{ fontSize: 'var(--text-body-size)' }}
          >
            {campaign.title}
          </p>
        ) : null}
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

      {/* Filtros */}
      <Card className="mb-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search
              size={16}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary)]"
            />
            <Input
              placeholder="Buscar por nome, empresa ou telefone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              options={SEGMENT_OPTIONS}
            />
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              options={STATUS_OPTIONS}
            />
            <Select
              value={topLtv}
              onChange={(e) => setTopLtv(e.target.value)}
              options={TOP_LTV_OPTIONS}
            />
          </div>
          {Number(topLtv) > 0 ? (
            <div
              className="flex items-center gap-1.5 text-[color:var(--text-secondary)]"
              style={{ fontSize: 'var(--text-hint-size)' }}
            >
              <Trophy size={13} strokeWidth={1.75} className="text-primary" />
              Mostrando os {topLtv} melhores clientes por LTV (dentro dos
              filtros atuais).
            </div>
          ) : null}
          {allTags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="text-[color:var(--text-hint)]"
                style={{ fontSize: 'var(--text-hint-size)' }}
              >
                Tags:
              </span>
              {allTags.map((tag) => {
                const active = activeTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={
                      active
                        ? 'inline-flex items-center rounded-full border border-primary bg-[var(--accent-tint)] px-2.5 py-1 text-[color:var(--accent-hover)]'
                        : 'inline-flex items-center rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-card)] px-2.5 py-1 text-[color:var(--text-secondary)] hover:border-primary'
                    }
                    style={{ fontSize: '12px', fontWeight: 500 }}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--border-subtle)] pt-3">
            <span
              className="text-[color:var(--text-secondary)]"
              style={{ fontSize: 'var(--text-hint-size)' }}
            >
              {filtered.length} contato{filtered.length === 1 ? '' : 's'} no
              filtro atual
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={selectAllFiltered}
                disabled={loading || filtered.length === 0}
              >
                Selecionar todos do filtro
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                disabled={selected.size === 0}
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista com checkboxes */}
      {loading ? (
        <Card padded={false}>
          {[1, 2, 3, 4, 5].map((i) => (
            <RowSkeleton key={i} />
          ))}
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <p
            className="m-0 text-[color:var(--text-secondary)]"
            style={{ fontSize: 'var(--text-body-size)' }}
          >
            Nenhum contato com esses filtros.
          </p>
        </Card>
      ) : (
        <Card padded={false}>
          {filtered.map((c) => {
            const checked = selected.has(c.id)
            return (
              <label
                key={c.id}
                className="flex min-h-[56px] cursor-pointer items-center gap-3 border-b border-[color:var(--border-subtle)] px-3.5 py-3 last:border-b-0 hover:bg-[var(--surface-hover)]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleContact(c.id)}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-[#BA7517]"
                />
                <span className="min-w-0 flex-1">
                  <span
                    className="block truncate text-[color:var(--text-primary)]"
                    style={{
                      fontSize: 'var(--text-body-size)',
                      fontWeight: 'var(--weight-medium)',
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    className="block truncate text-[color:var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-hint-size)' }}
                  >
                    {c.business_name ? `${c.business_name} · ` : ''}
                    {c.phone}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {c.opt_out ? (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--slate-100)] px-2 py-0.5 text-[color:var(--slate-500)]"
                      style={{ fontSize: '11px', fontWeight: 500 }}
                      title="Não perturbe — excluído automaticamente"
                    >
                      <BellOff size={11} strokeWidth={1.75} /> opt-out
                    </span>
                  ) : null}
                  <StatusBadge status={c.status} dot={false} />
                </span>
              </label>
            )
          })}
        </Card>
      )}

      {/* Barra fixa de resumo + ação */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[color:var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-2">
          {eligibleCount > BULK_WARNING_THRESHOLD ? (
            <div
              className="flex items-start gap-2 rounded-md bg-[var(--accent-tint)] px-3 py-2 text-[color:var(--accent-hover)]"
              style={{ fontSize: 'var(--text-hint-size)' }}
            >
              <AlertTriangle
                size={14}
                strokeWidth={1.75}
                className="mt-px shrink-0"
              />
              <span>
                Disparar muitas mensagens iguais de um número pessoal de uma
                vez aumenta o risco de bloqueio do WhatsApp. Considere fatiar
                em lotes e espaçar os envios.
              </span>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p
                className="m-0 text-[color:var(--text-primary)]"
                style={{
                  fontSize: 'var(--text-body-size)',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                {eligibleCount} destinatário{eligibleCount === 1 ? '' : 's'}{' '}
                selecionado{eligibleCount === 1 ? '' : 's'}
              </p>
              <p
                className="m-0 text-[color:var(--text-hint)]"
                style={{ fontSize: 'var(--text-hint-size)' }}
              >
                {optOutCount > 0
                  ? `${optOutCount} excluído${optOutCount === 1 ? '' : 's'} por opt-out (não perturbe)`
                  : 'Contatos com opt-out são excluídos automaticamente'}
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="lg"
              iconRight={<ArrowRight size={16} strokeWidth={1.75} />}
              disabled={eligibleCount === 0 || generating}
              onClick={generateQueue}
            >
              {generating ? 'Gerando…' : 'Gerar fila'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

async function fetchAllContacts(): Promise<Contact[]> {
  const PAGE = 200
  const all: Contact[] = []
  let offset = 0
  // Pagina até esgotar (proteção: máx. 5000 contatos).
  for (let i = 0; i < 25; i++) {
    const { data } = await api.get<Contact[]>('/contacts/', {
      params: { limit: PAGE, offset },
    })
    all.push(...data)
    if (data.length < PAGE) break
    offset += PAGE
  }
  return all
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-3.5 py-3 last:border-b-0">
      <span className="h-5 w-5 animate-pulse rounded bg-[var(--slate-200)]" />
      <div className="flex-1">
        <div className="h-3 w-40 animate-pulse rounded bg-[var(--slate-200)]" />
        <div className="mt-1.5 h-3 w-28 animate-pulse rounded bg-[var(--slate-200)]" />
      </div>
      <div className="h-5 w-16 animate-pulse rounded-full bg-[var(--slate-200)]" />
    </div>
  )
}

function extractErr(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const detail = (e.response?.data as { detail?: string } | undefined)?.detail
    if (typeof detail === 'string') return detail
    return e.message || fallback
  }
  return e instanceof Error ? e.message : fallback
}
