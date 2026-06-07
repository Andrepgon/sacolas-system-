'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Avatar, Card } from '@/components/ds'

type TopCliente = {
  id: string
  name: string
  business_name: string | null
  segment: string | null
  total_orders: number
  lifetime_value: number | string
  last_order_at: string | null
}

function formatBRL(v: number): string {
  return `R$ ${v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

function lastOrderText(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('pt-BR')
  } catch {
    return '—'
  }
}

export default function TopClientesPage() {
  const router = useRouter()
  const [rows, setRows] = useState<TopCliente[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchTop() {
      setLoading(true)
      setErr(null)
      try {
        const { data } = await api.get<TopCliente[]>('/views/top-clientes', {
          params: { limit: 20 },
        })
        if (!cancelled) setRows(data)
      } catch (e: unknown) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : 'Falha ao carregar ranking')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void fetchTop()
    return () => {
      cancelled = true
    }
  }, [])

  const max = Math.max(1, ...rows.map((r) => Number(r.lifetime_value)))

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
      <header className="mb-5">
        <h1
          className="m-0 text-[color:var(--text-primary)]"
          style={{
            fontSize: 'var(--text-page-size)',
            lineHeight: 'var(--text-page-lh)',
            fontWeight: 'var(--weight-medium)',
            letterSpacing: 'var(--tracking-tight)',
          }}
        >
          Melhores clientes
        </h1>
        <p
          className="mt-1 text-[color:var(--text-secondary)]"
          style={{ fontSize: '13px' }}
        >
          Ranking por valor gerado (LTV)
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

      <Card padded={false} className="overflow-hidden">
        {loading ? (
          <TopSkeleton />
        ) : rows.length === 0 ? (
          <div className="px-4 py-4 md:px-6">
            <p
              className="text-[color:var(--text-secondary)]"
              style={{ fontSize: 'var(--text-body-size)' }}
            >
              Sem clientes ainda.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: cards. Desktop: table. */}
            <ul className="flex flex-col md:hidden">
              {rows.map((r, i) => (
                <li
                  key={r.id}
                  className="flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-3.5 py-3 last:border-b-0 cursor-pointer hover:bg-[var(--surface-hover)]"
                  onClick={() => router.push(`/contacts/${r.id}`)}
                >
                  <Rank index={i} />
                  <Avatar name={r.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-medium text-[color:var(--text-primary)]">
                      {r.name}
                    </div>
                    <div className="text-xs capitalize text-[color:var(--text-secondary)]">
                      {r.segment || '—'} · {r.total_orders} pedido(s)
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-sm font-medium tabular-nums text-[color:var(--text-primary)]">
                      {formatBRL(Number(r.lifetime_value))}
                    </span>
                    <span className="text-[11px] text-[color:var(--text-hint)]">
                      {lastOrderText(r.last_order_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <table className="hidden w-full border-collapse text-sm md:table">
              <thead>
                <tr>
                  <th className="w-12 px-3 py-2.5 text-left text-xs font-medium text-[color:var(--text-secondary)] border-b border-[color:var(--border-subtle)]">
                    #
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-[color:var(--text-secondary)] border-b border-[color:var(--border-subtle)]">
                    Cliente
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-[color:var(--text-secondary)] border-b border-[color:var(--border-subtle)]">
                    Segmento
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-medium text-[color:var(--text-secondary)] border-b border-[color:var(--border-subtle)]">
                    Pedidos
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-medium text-[color:var(--text-secondary)] border-b border-[color:var(--border-subtle)]">
                    LTV
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-[color:var(--text-secondary)] border-b border-[color:var(--border-subtle)]">
                    Última compra
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const ltv = Number(r.lifetime_value)
                  return (
                    <tr
                      key={r.id}
                      onClick={() => router.push(`/contacts/${r.id}`)}
                      className="cursor-pointer transition-colors duration-fast ease-standard even:bg-[color-mix(in_oklch,var(--surface-muted)_45%,transparent)] hover:bg-[var(--surface-hover)]"
                    >
                      <td className="border-b border-[color:var(--border-subtle)] px-3 py-2.5">
                        <Rank index={i} />
                      </td>
                      <td className="border-b border-[color:var(--border-subtle)] px-3 py-2.5">
                        <span className="flex items-center gap-2.5">
                          <Avatar name={r.name} size="sm" />
                          <span className="font-medium text-[color:var(--text-primary)]">
                            {r.name}
                          </span>
                        </span>
                      </td>
                      <td className="border-b border-[color:var(--border-subtle)] px-3 py-2.5 capitalize text-[color:var(--text-secondary)]">
                        {r.segment || '—'}
                      </td>
                      <td className="border-b border-[color:var(--border-subtle)] px-3 py-2.5 text-right font-mono tabular-nums">
                        {r.total_orders}
                      </td>
                      <td className="border-b border-[color:var(--border-subtle)] px-3 py-2.5">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-mono tabular-nums">
                            {formatBRL(ltv)}
                          </span>
                          <span
                            className="block h-1 rounded-full bg-chart-bar"
                            style={{
                              width: `${Math.max(12, (ltv / max) * 120)}px`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="border-b border-[color:var(--border-subtle)] px-3 py-2.5 text-[color:var(--text-secondary)]">
                        {lastOrderText(r.last_order_at)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}
      </Card>
    </div>
  )
}

function Rank({ index }: { index: number }) {
  const isFirst = index === 0
  return (
    <span
      className={`inline-flex h-[22px] w-[22px] items-center justify-center rounded-full font-mono text-xs font-medium ${
        isFirst
          ? 'bg-[var(--accent-tint)] text-[color:var(--accent-hover)]'
          : 'bg-[var(--surface-muted)] text-[color:var(--text-secondary)]'
      }`}
    >
      {index + 1}
    </span>
  )
}

function TopSkeleton() {
  return (
    <div className="flex flex-col">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-3.5 py-3 last:border-b-0"
        >
          <span className="h-[22px] w-[22px] animate-pulse rounded-full bg-[var(--slate-200)]" />
          <span className="h-7 w-7 animate-pulse rounded-full bg-[var(--slate-200)]" />
          <div className="flex-1">
            <div className="h-3 w-40 animate-pulse rounded bg-[var(--slate-200)]" />
            <div className="mt-1.5 h-3 w-28 animate-pulse rounded bg-[var(--slate-200)]" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="h-3 w-20 animate-pulse rounded bg-[var(--slate-200)]" />
            <div className="h-1 w-16 animate-pulse rounded-full bg-[var(--slate-200)]" />
          </div>
        </div>
      ))}
    </div>
  )
}
