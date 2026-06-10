'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Megaphone, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { api } from '@/lib/api'
import type { Campaign } from '@/lib/types'
import { Button, Card, StatusBadge } from '@/components/ds'

export default function CampanhasPage() {
  const router = useRouter()
  const [items, setItems] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setErr(null)
      try {
        const { data } = await api.get<Campaign[]>('/campaigns/')
        if (alive) setItems(data)
      } catch (e: unknown) {
        if (!alive) return
        if (axios.isAxiosError(e)) {
          const detail = (e.response?.data as { detail?: string } | undefined)
            ?.detail
          setErr(detail ?? e.message)
        } else {
          setErr(e instanceof Error ? e.message : 'Falha ao carregar campanhas')
        }
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
      <header className="mb-5 flex items-center justify-between gap-4">
        <h1
          className="m-0 text-[color:var(--text-primary)]"
          style={{
            fontSize: 'var(--text-page-size)',
            lineHeight: 'var(--text-page-lh)',
            fontWeight: 'var(--weight-medium)',
            letterSpacing: 'var(--tracking-tight)',
          }}
        >
          Campanhas
        </h1>
        <Button
          variant="primary"
          iconLeft={<Plus size={16} strokeWidth={1.75} />}
          onClick={() => router.push('/campanhas/nova')}
        >
          Nova campanha
        </Button>
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

      {loading ? (
        <CampaignListSkeleton />
      ) : items.length === 0 ? (
        <EmptyState onNew={() => router.push('/campanhas/nova')} />
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((c) => (
            <li key={c.id}>
              <CampaignCard
                campaign={c}
                onClick={() => router.push(`/campanhas/${c.id}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CampaignCard({
  campaign,
  onClick,
}: {
  campaign: Campaign
  onClick: () => void
}) {
  const created = (() => {
    try {
      return formatDistanceToNow(new Date(campaign.created_at), {
        locale: ptBR,
        addSuffix: true,
      })
    } catch {
      return ''
    }
  })()
  return (
    <Card interactive onClick={onClick} className="cursor-pointer">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h2
            className="m-0 min-w-0 flex-1 truncate text-[color:var(--text-primary)]"
            style={{
              fontSize: 'var(--text-card-size)',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            {campaign.title}
          </h2>
          <StatusBadge status={campaign.status} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Metric label="Destinatários" value={campaign.total_recipients} />
          <Metric
            label="Enviados"
            value={campaign.sent_count}
            valueClass="text-[color:var(--positive-text)]"
          />
          <Metric
            label="Pulados"
            value={campaign.skipped_count}
            valueClass="text-[color:var(--text-secondary)]"
          />
        </div>
        {created ? (
          <p
            className="m-0 text-[color:var(--text-hint)]"
            style={{ fontSize: 'var(--text-hint-size)' }}
          >
            Criada {created}
          </p>
        ) : null}
      </div>
    </Card>
  )
}

function Metric({
  label,
  value,
  valueClass,
}: {
  label: string
  value: number
  valueClass?: string
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md bg-[var(--surface-muted)] px-2.5 py-2">
      <span
        className="text-[color:var(--text-hint)]"
        style={{ fontSize: 'var(--text-hint-size)' }}
      >
        {label}
      </span>
      <span
        className={`font-mono text-[color:var(--text-primary)] ${valueClass ?? ''}`}
        style={{ fontSize: '15px', fontWeight: 500 }}
      >
        {value}
      </span>
    </div>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-tint)] text-primary"
          aria-hidden
        >
          <Megaphone size={22} strokeWidth={1.75} />
        </span>
        <div className="flex flex-col gap-1">
          <p
            className="m-0 text-[color:var(--text-primary)]"
            style={{
              fontSize: 'var(--text-section-size)',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            Nenhuma campanha ainda
          </p>
          <p
            className="m-0 max-w-[420px] text-[color:var(--text-secondary)]"
            style={{ fontSize: 'var(--text-body-size)' }}
          >
            Componha uma mensagem, escolha os clientes e dispare do seu próprio
            WhatsApp, um a um.
          </p>
        </div>
        <Button
          variant="primary"
          iconLeft={<Plus size={16} strokeWidth={1.75} />}
          onClick={onNew}
        >
          Nova campanha
        </Button>
      </div>
    </Card>
  )
}

function CampaignListSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <li key={i}>
          <Card>
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="h-4 w-40 animate-pulse rounded bg-[var(--slate-200)]" />
                <div className="h-[22px] w-20 animate-pulse rounded-full bg-[var(--slate-200)]" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((j) => (
                  <div
                    key={j}
                    className="flex h-[52px] flex-col gap-1.5 rounded-md bg-[var(--surface-muted)] px-2.5 py-2"
                  >
                    <div className="h-2.5 w-14 animate-pulse rounded bg-[var(--slate-200)]" />
                    <div className="h-3 w-8 animate-pulse rounded bg-[var(--slate-200)]" />
                  </div>
                ))}
              </div>
              <div className="h-2.5 w-24 animate-pulse rounded bg-[var(--slate-200)]" />
            </div>
          </Card>
        </li>
      ))}
    </ul>
  )
}
