'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'

import { api } from '@/lib/api'
import type { Campaign } from '@/lib/types'
import { Button, Card } from '@/components/ds'

import { CampaignComposer } from '../_components/campaign-composer'

export default function CampanhaDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let alive = true
    ;(async () => {
      setLoading(true)
      setErr(null)
      try {
        const { data } = await api.get<Campaign>(`/campaigns/${id}`)
        if (alive) setCampaign(data)
      } catch (e: unknown) {
        if (!alive) return
        if (axios.isAxiosError(e)) {
          const detail = (e.response?.data as { detail?: string } | undefined)
            ?.detail
          setErr(detail ?? e.message)
        } else {
          setErr(e instanceof Error ? e.message : 'Falha ao carregar campanha')
        }
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
      <header className="mb-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => router.push('/campanhas')}
          className="inline-flex w-fit items-center gap-1 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
          style={{ fontSize: 'var(--text-hint-size)' }}
        >
          <ArrowLeft size={14} strokeWidth={1.75} /> Campanhas
        </button>
        <h1
          className="m-0 text-[color:var(--text-primary)]"
          style={{
            fontSize: 'var(--text-page-size)',
            lineHeight: 'var(--text-page-lh)',
            fontWeight: 'var(--weight-medium)',
            letterSpacing: 'var(--tracking-tight)',
          }}
        >
          {campaign?.title || 'Editar campanha'}
        </h1>
      </header>

      {loading ? (
        <ComposerSkeleton />
      ) : err ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p
              className="m-0 text-[color:var(--negative)]"
              style={{ fontSize: 'var(--text-body-size)' }}
            >
              {err}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/campanhas')}
            >
              Voltar
            </Button>
          </div>
        </Card>
      ) : campaign ? (
        <CampaignComposer
          mode="edit"
          campaign={campaign}
          onCampaignChange={setCampaign}
        />
      ) : null}
    </div>
  )
}

function ComposerSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      <Card>
        <div className="flex flex-col gap-4">
          <div className="h-3 w-20 animate-pulse rounded bg-[var(--slate-200)]" />
          <div className="h-10 w-full animate-pulse rounded bg-[var(--slate-200)]" />
          <div className="h-3 w-24 animate-pulse rounded bg-[var(--slate-200)]" />
          <div className="h-32 w-full animate-pulse rounded bg-[var(--slate-200)]" />
        </div>
      </Card>
      <Card muted>
        <div className="flex flex-col gap-3">
          <div className="h-3 w-20 animate-pulse rounded bg-[var(--slate-200)]" />
          <div className="h-40 w-full animate-pulse rounded bg-[var(--slate-200)]" />
        </div>
      </Card>
    </div>
  )
}
