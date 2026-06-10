'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ExternalLink,
  LayoutList,
  SkipForward,
  Target,
} from 'lucide-react'

import { api } from '@/lib/api'
import type { Campaign, CampaignSend } from '@/lib/types'
import { Button, Card } from '@/components/ds'

type ViewMode = 'focus' | 'list'

export default function DispararPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [pending, setPending] = useState<CampaignSend[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [view, setView] = useState<ViewMode>('focus')
  // ids dos sends cujo wa.me já foi aberto (libera Enviado/Pular)
  const [opened, setOpened] = useState<Set<string>>(new Set())
  // id do send sendo atualizado (evita toque duplo)
  const [updating, setUpdating] = useState<string | null>(null)

  const load = useCallback(async (campaignId: string) => {
    setLoading(true)
    setErr(null)
    try {
      const [{ data: camp }, { data: sends }] = await Promise.all([
        api.get<Campaign>(`/campaigns/${campaignId}`),
        api.get<CampaignSend[]>(`/campaigns/${campaignId}/sends`, {
          params: { status: 'pending', limit: 500 },
        }),
      ])
      setCampaign(camp)
      setPending(sends)
    } catch (e: unknown) {
      setErr(extractErr(e, 'Falha ao carregar a fila'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!id) return
    void load(id)
  }, [id, load])

  const total = campaign?.total_recipients ?? 0
  const doneCount = useMemo(() => {
    if (!campaign) return 0
    // total - pendentes restantes = enviados + pulados (sempre consistente
    // com o que está na tela, mesmo antes de re-fetch do campaign)
    return Math.max(total - pending.length, 0)
  }, [campaign, total, pending.length])
  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0
  const current = pending[0] ?? null

  function markOpened(sendId: string) {
    setOpened((prev) => {
      const next = new Set(prev)
      next.add(sendId)
      return next
    })
  }

  async function resolveSend(send: CampaignSend, status: 'sent' | 'skipped') {
    if (!id || updating) return
    setUpdating(send.id)
    try {
      await api.patch(`/campaigns/${id}/sends/${send.id}`, { status })
      setPending((prev) => prev.filter((s) => s.id !== send.id))
      setCampaign((prev) =>
        prev
          ? {
              ...prev,
              sent_count: prev.sent_count + (status === 'sent' ? 1 : 0),
              skipped_count: prev.skipped_count + (status === 'skipped' ? 1 : 0),
            }
          : prev,
      )
      if (status === 'skipped') toast('Contato pulado')
    } catch (e: unknown) {
      const msg = extractErr(e, 'Falha ao atualizar envio')
      toast.error(msg)
      // 409 = já resolvido em outra aba/sessão → tira da fila local
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        setPending((prev) => prev.filter((s) => s.id !== send.id))
      }
    } finally {
      setUpdating(null)
    }
  }

  const finished = !loading && !err && pending.length === 0 && total > 0

  return (
    <div className="mx-auto max-w-[700px] px-4 py-5 md:px-6 md:py-6">
      <header className="mb-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => router.push(`/campanhas/${id}`)}
          className="inline-flex w-fit items-center gap-1 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
          style={{ fontSize: 'var(--text-hint-size)' }}
        >
          <ArrowLeft size={14} strokeWidth={1.75} /> Voltar pra campanha
        </button>
        <div className="flex items-center justify-between gap-2">
          <h1
            className="m-0 truncate text-[color:var(--text-primary)]"
            style={{
              fontSize: 'var(--text-page-size)',
              lineHeight: 'var(--text-page-lh)',
              fontWeight: 'var(--weight-medium)',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            {campaign?.title ?? 'Disparo'}
          </h1>
          {!finished && pending.length > 0 ? (
            <ViewToggle view={view} onChange={setView} />
          ) : null}
        </div>
      </header>

      {/* Progresso */}
      {total > 0 ? (
        <div className="mb-5">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span
              className="text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-body-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Enviados {doneCount} de {total}
            </span>
            <span
              className="font-mono tabular-nums text-[color:var(--text-secondary)]"
              style={{ fontSize: 'var(--text-hint-size)' }}
            >
              {progressPct}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--slate-200)]">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      ) : null}

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

      {loading ? (
        <FocusSkeleton />
      ) : finished ? (
        <DoneState
          sent={campaign?.sent_count ?? 0}
          skipped={campaign?.skipped_count ?? 0}
          onBack={() => router.push('/campanhas')}
        />
      ) : pending.length === 0 ? (
        <Card>
          <p
            className="m-0 text-[color:var(--text-secondary)]"
            style={{ fontSize: 'var(--text-body-size)' }}
          >
            A fila está vazia. Selecione os destinatários primeiro.
          </p>
          <div className="mt-3">
            <Button
              variant="secondary"
              onClick={() => router.push(`/campanhas/${id}/destinatarios`)}
            >
              Selecionar destinatários
            </Button>
          </div>
        </Card>
      ) : view === 'focus' && current ? (
        <FocusCard
          send={current}
          remaining={pending.length}
          opened={opened.has(current.id)}
          busy={updating === current.id}
          onOpen={() => markOpened(current.id)}
          onSent={() => resolveSend(current, 'sent')}
          onSkip={() => resolveSend(current, 'skipped')}
        />
      ) : (
        <ListView
          sends={pending}
          opened={opened}
          updating={updating}
          onOpen={markOpened}
          onResolve={resolveSend}
        />
      )}
    </div>
  )
}

/* ---------- Modo foco ---------- */

function FocusCard({
  send,
  remaining,
  opened,
  busy,
  onOpen,
  onSent,
  onSkip,
}: {
  send: CampaignSend
  remaining: number
  opened: boolean
  busy: boolean
  onOpen: () => void
  onSent: () => void
  onSkip: () => void
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2
              className="m-0 truncate text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-section-size)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              {send.contact?.name ?? 'Contato'}
            </h2>
            <p
              className="m-0 mt-0.5 truncate text-[color:var(--text-secondary)]"
              style={{ fontSize: 'var(--text-body-size)' }}
            >
              {send.contact?.business_name
                ? `${send.contact.business_name} · `
                : ''}
              {send.phone}
            </p>
          </div>
          <span
            className="shrink-0 rounded-full bg-[var(--slate-100)] px-2.5 py-1 text-[color:var(--slate-600)]"
            style={{ fontSize: '12px', fontWeight: 500 }}
          >
            {remaining} na fila
          </span>
        </div>

        <div
          className="whitespace-pre-wrap break-words rounded-lg border border-[color:var(--border-subtle)] bg-[var(--surface-muted)] p-3 text-[color:var(--text-primary)]"
          style={{
            fontSize: 'var(--text-body-size)',
            lineHeight: 'var(--text-body-lh)',
          }}
        >
          {send.rendered_message}
        </div>

        <a
          href={waLink(send.phone, send.rendered_message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onOpen}
          className="block"
        >
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="h-12 w-full text-base"
            iconLeft={<ExternalLink size={18} strokeWidth={1.75} />}
          >
            Abrir no WhatsApp
          </Button>
        </a>

        {opened ? (
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="h-12 bg-[var(--positive-tint)] text-[color:var(--positive-text)] hover:bg-[var(--positive-tint)]/80"
              iconLeft={<Check size={18} strokeWidth={2} />}
              disabled={busy}
              onClick={onSent}
            >
              {busy ? 'Salvando…' : 'Enviado'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-12"
              iconLeft={<SkipForward size={18} strokeWidth={1.75} />}
              disabled={busy}
              onClick={onSkip}
            >
              Pular
            </Button>
          </div>
        ) : (
          <p
            className="m-0 text-center text-[color:var(--text-hint)]"
            style={{ fontSize: 'var(--text-hint-size)' }}
          >
            Depois de mandar a mensagem, volte aqui e marque{' '}
            <strong>Enviado</strong> pra avançar.
          </p>
        )}
      </div>
    </Card>
  )
}

/* ---------- Visão lista ---------- */

function ListView({
  sends,
  opened,
  updating,
  onOpen,
  onResolve,
}: {
  sends: CampaignSend[]
  opened: Set<string>
  updating: string | null
  onOpen: (id: string) => void
  onResolve: (send: CampaignSend, status: 'sent' | 'skipped') => void
}) {
  return (
    <Card padded={false}>
      {sends.map((s) => {
        const wasOpened = opened.has(s.id)
        const busy = updating === s.id
        return (
          <div
            key={s.id}
            className="flex flex-col gap-2 border-b border-[color:var(--border-subtle)] px-3.5 py-3 last:border-b-0"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span
                  className="block truncate text-[color:var(--text-primary)]"
                  style={{
                    fontSize: 'var(--text-body-size)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  {s.contact?.name ?? 'Contato'}
                </span>
                <span
                  className="block truncate text-[color:var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-hint-size)' }}
                >
                  {s.contact?.business_name
                    ? `${s.contact.business_name} · `
                    : ''}
                  {s.phone}
                </span>
              </div>
              <a
                href={waLink(s.phone, s.rendered_message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onOpen(s.id)}
                className="shrink-0"
              >
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  iconLeft={<ExternalLink size={14} strokeWidth={1.75} />}
                >
                  Abrir
                </Button>
              </a>
            </div>
            {wasOpened ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="bg-[var(--positive-tint)] text-[color:var(--positive-text)] hover:bg-[var(--positive-tint)]/80"
                  iconLeft={<Check size={14} strokeWidth={2} />}
                  disabled={busy}
                  onClick={() => onResolve(s, 'sent')}
                >
                  Enviado
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  iconLeft={<SkipForward size={14} strokeWidth={1.75} />}
                  disabled={busy}
                  onClick={() => onResolve(s, 'skipped')}
                >
                  Pular
                </Button>
              </div>
            ) : null}
          </div>
        )
      })}
    </Card>
  )
}

/* ---------- Conclusão ---------- */

function DoneState({
  sent,
  skipped,
  onBack,
}: {
  sent: number
  skipped: number
  onBack: () => void
}) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2
          size={44}
          strokeWidth={1.5}
          className="text-[color:var(--positive)]"
        />
        <h2
          className="m-0 text-[color:var(--text-primary)]"
          style={{
            fontSize: 'var(--text-section-size)',
            fontWeight: 'var(--weight-medium)',
          }}
        >
          Campanha concluída
        </h2>
        <p
          className="m-0 text-[color:var(--text-secondary)]"
          style={{ fontSize: 'var(--text-body-size)' }}
        >
          {sent} enviado{sent === 1 ? '' : 's'} · {skipped} pulado
          {skipped === 1 ? '' : 's'}
        </p>
        <Button type="button" variant="primary" size="lg" onClick={onBack}>
          Voltar pra Campanhas
        </Button>
      </div>
    </Card>
  )
}

/* ---------- Toggle Foco / Lista ---------- */

function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode
  onChange: (v: ViewMode) => void
}) {
  return (
    <div className="flex shrink-0 overflow-hidden rounded-md border border-[color:var(--border-subtle)]">
      <ToggleBtn
        active={view === 'focus'}
        onClick={() => onChange('focus')}
        icon={<Target size={14} strokeWidth={1.75} />}
        label="Foco"
      />
      <ToggleBtn
        active={view === 'list'}
        onClick={() => onChange('list')}
        icon={<LayoutList size={14} strokeWidth={1.75} />}
        label="Lista"
      />
    </div>
  )
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'inline-flex h-9 items-center gap-1.5 bg-[var(--accent-tint)] px-3 text-[color:var(--accent-hover)]'
          : 'inline-flex h-9 items-center gap-1.5 bg-[var(--surface-card)] px-3 text-[color:var(--text-secondary)] hover:bg-[var(--surface-muted)]'
      }
      style={{ fontSize: '13px', fontWeight: 500 }}
    >
      {icon}
      {label}
    </button>
  )
}

/* ---------- Helpers ---------- */

function waLink(phone: string, message: string): string {
  let digits = phone.replace(/\D/g, '')
  // Garante DDI do Brasil: números locais (até 11 dígitos) ganham o 55.
  if (digits.length <= 11) digits = `55${digits}`
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

function FocusSkeleton() {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="h-5 w-44 animate-pulse rounded bg-[var(--slate-200)]" />
        <div className="h-4 w-32 animate-pulse rounded bg-[var(--slate-200)]" />
        <div className="h-32 w-full animate-pulse rounded-lg bg-[var(--slate-200)]" />
        <div className="h-12 w-full animate-pulse rounded-md bg-[var(--slate-200)]" />
      </div>
    </Card>
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
