'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, notFound } from 'next/navigation'
import { Phone } from 'lucide-react'
import { api } from '@/lib/api'
import { Card } from '@/components/ds'
import { initials } from '@/components/ds/_utils'
import type { Contact } from '@/lib/types'

type ViewContact = Contact & {
  dias_sem_comprar?: number
  dias_como_lead?: number
}

const SLUG_MAP = {
  'para-reativar': {
    title: 'Clientes pra reativar',
    context:
      'Sem comprar há mais de 60 dias — vale um alô antes de esfriar.',
    tone: 'amber' as const,
    endpoint: '/views/para-reativar',
    sinceLabel: (c: ViewContact) =>
      c.dias_sem_comprar != null ? `há ${c.dias_sem_comprar} dias` : null,
  },
  'em-risco': {
    title: 'Clientes em risco',
    context:
      'Sem comprar há mais de 60 dias. Eram recorrentes — reconquiste agora.',
    tone: 'danger' as const,
    endpoint: '/views/em-risco',
    sinceLabel: (c: ViewContact) =>
      c.dias_sem_comprar != null ? `há ${c.dias_sem_comprar} dias` : null,
  },
  'leads-sem-resposta': {
    title: 'Leads sem resposta há +3 dias',
    context:
      'Pediram orçamento e ficaram no vácuo. Um lembrete costuma destravar.',
    tone: 'info' as const,
    endpoint: '/views/leads-sem-resposta',
    sinceLabel: (c: ViewContact) =>
      c.dias_como_lead != null
        ? `sem resposta há ${c.dias_como_lead} dias`
        : null,
  },
} as const

type Slug = keyof typeof SLUG_MAP

function isSlug(value: string): value is Slug {
  return value in SLUG_MAP
}

const TABS: { key: Slug; label: string }[] = [
  { key: 'para-reativar', label: 'Pra reativar' },
  { key: 'em-risco', label: 'Em risco' },
  { key: 'leads-sem-resposta', label: 'Leads sem resposta' },
]

const COUNT_TONE_CLS: Record<'amber' | 'danger' | 'info', string> = {
  amber: 'bg-[var(--accent-tint)] text-[color:var(--accent-hover)]',
  danger: 'bg-[var(--negative-tint)] text-[color:var(--negative)]',
  info: 'bg-[var(--info-tint)] text-[color:var(--info-color)]',
}

function formatBRL(v: number): string {
  return `R$ ${v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '')
}

export default function ViewSlugPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params?.slug

  if (!slug || !isSlug(slug)) {
    notFound()
  }

  const cfg = SLUG_MAP[slug as Slug]
  const [contacts, setContacts] = useState<ViewContact[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchView() {
      setLoading(true)
      setErr(null)
      try {
        const { data } = await api.get<ViewContact[]>(cfg.endpoint)
        if (!cancelled) setContacts(data)
      } catch (e: unknown) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : 'Falha ao carregar lista')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void fetchView()
    return () => {
      cancelled = true
    }
  }, [cfg.endpoint])

  function openWhatsApp(c: ViewContact, e: React.MouseEvent) {
    e.stopPropagation()
    const url = `https://wa.me/55${digitsOnly(c.phone)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
      <header className="mb-5">
        <div className="flex items-center gap-2.5">
          <h1
            className="m-0 text-[color:var(--text-primary)]"
            style={{
              fontSize: 'var(--text-page-size)',
              lineHeight: 'var(--text-page-lh)',
              fontWeight: 'var(--weight-medium)',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            {cfg.title}
          </h1>
          <span
            className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 font-mono text-xs font-medium tabular-nums ${COUNT_TONE_CLS[cfg.tone]}`}
          >
            {loading ? '—' : contacts.length}
          </span>
        </div>
        <p
          className="mt-1 text-[color:var(--text-secondary)]"
          style={{ fontSize: '13px' }}
        >
          {cfg.context}
        </p>
      </header>

      <div className="mb-4 inline-flex flex-wrap gap-0.5 rounded-md bg-[var(--surface-muted)] p-[3px]">
        {TABS.map((t) => {
          const active = slug === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => router.push(`/views/${t.key}`)}
              className={`rounded-[5px] border-0 bg-transparent px-3 py-1.5 font-sans text-[13px] font-medium cursor-pointer transition-colors duration-fast ease-standard ${
                active
                  ? 'bg-[var(--surface-card)] text-[color:var(--text-primary)] shadow-xs'
                  : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

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
        <Card padded={false}>
          {[1, 2, 3, 4].map((i) => (
            <RowSkeleton key={i} />
          ))}
        </Card>
      ) : contacts.length === 0 ? (
        <Card>
          <p
            className="text-[color:var(--text-secondary)]"
            style={{ fontSize: 'var(--text-body-size)' }}
          >
            Tudo em dia — nenhum contato nessa lista no momento.
          </p>
        </Card>
      ) : (
        <Card padded={false}>
          {contacts.map((c) => {
            const since = cfg.sinceLabel(c)
            const ltv = Number(c.lifetime_value)
            return (
              <div
                key={c.id}
                onClick={() => router.push(`/contacts/${c.id}`)}
                className="flex items-center gap-3 border-b border-[color:var(--border-subtle)] bg-[var(--surface-card)] px-3.5 py-3 last:border-b-0 cursor-pointer transition-colors duration-fast ease-standard hover:bg-[var(--surface-hover)]"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--slate-100)] font-medium uppercase text-[color:var(--slate-600)] text-[13px]">
                  {initials(c.name)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[color:var(--text-primary)] truncate">
                    {c.name}
                  </div>
                  <div className="text-xs text-[color:var(--text-secondary)] truncate">
                    {(c.business_name || c.phone) ?? c.phone}
                    {c.segment ? (
                      <>
                        {' · '}
                        <span className="capitalize">{c.segment}</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end shrink-0">
                  {since ? (
                    <span className="text-[11px] text-[color:var(--text-hint)]">
                      {since}
                    </span>
                  ) : null}
                  {ltv > 0 ? (
                    <span className="font-mono text-[13px] font-medium tabular-nums text-[color:var(--text-primary)]">
                      {formatBRL(ltv)}
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={(e) => openWhatsApp(c, e)}
                  className="inline-flex items-center gap-1.5 rounded-md border-0 bg-[var(--positive-tint)] px-2.5 py-1.5 text-[color:var(--positive-text)] font-sans text-[13px] font-medium cursor-pointer transition-colors duration-fast ease-standard hover:bg-[#d8f5e6]"
                  aria-label={`WhatsApp ${c.name}`}
                >
                  <Phone size={14} strokeWidth={1.75} />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              </div>
            )
          })}
        </Card>
      )}
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-3.5 py-3 last:border-b-0">
      <span className="h-9 w-9 animate-pulse rounded-full bg-[var(--slate-200)]" />
      <div className="flex-1">
        <div className="h-3 w-40 animate-pulse rounded bg-[var(--slate-200)]" />
        <div className="mt-1.5 h-3 w-28 animate-pulse rounded bg-[var(--slate-200)]" />
      </div>
      <div className="h-7 w-24 animate-pulse rounded-md bg-[var(--slate-200)]" />
    </div>
  )
}
