'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Order } from '@/lib/types'
import {
  Button,
  Card,
  Input,
  Select,
  StatusBadge,
  type OrderStatus,
} from '@/components/ds'
import { STATUS_LABELS, STATUS_ORDER, formatBRL } from '@/lib/orders'
import { OrdersViewSwitcher } from './_view-switcher'

const STATUS_SELECT_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
]

const STATUS_ROW_OPTIONS = STATUS_ORDER.map((s) => ({
  value: s,
  label: STATUS_LABELS[s],
}))

type StatusFilter = 'all' | OrderStatus
type StatusCount = { status: OrderStatus; count: number }

function relevantDateLabel(o: Order): string {
  if (o.delivered_at) {
    return `Entregue ${format(new Date(o.delivered_at), 'dd/MM', { locale: ptBR })}`
  }
  return `Criado ${format(new Date(o.created_at), 'dd/MM', { locale: ptBR })}`
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [counts, setCounts] = useState<StatusCount[]>([])
  const [status, setStatus] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchOrders()
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  useEffect(() => {
    void fetchCounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchOrders() {
    setLoading(true)
    setErr(null)
    try {
      const params: { status?: OrderStatus } = {}
      if (status !== 'all') params.status = status
      const { data } = await api.get<Order[]>('/orders/', { params })
      setOrders(data)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Falha ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  async function fetchCounts() {
    try {
      const { data } = await api.get<StatusCount[]>('/orders/por-status')
      setCounts(data)
    } catch {
      /* faixa silenciosamente vazia se falhar */
    }
  }

  async function changeStatus(id: string, next: OrderStatus) {
    const prev = orders
    setOrders((cur) =>
      cur.map((o) => (o.id === id ? { ...o, status: next } : o))
    )
    try {
      await api.patch<Order>(`/orders/${id}`, { status: next })
      void fetchCounts()
      toast.success(`Status: ${STATUS_LABELS[next]}`)
    } catch (e: unknown) {
      setOrders(prev)
      const detail = axios.isAxiosError(e)
        ? (e.response?.data as { detail?: string } | undefined)?.detail
        : null
      toast.error(detail ?? 'Falha ao atualizar status')
    }
  }

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        (o.contact?.name ?? '').toLowerCase().includes(q) ||
        (o.contact?.business_name ?? '').toLowerCase().includes(q)
    )
  }, [orders, search])

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
          Pedidos
        </h1>
        <Button
          variant="primary"
          iconLeft={<Plus size={16} strokeWidth={1.75} />}
          onClick={() => router.push('/orders/new')}
        >
          Novo pedido
        </Button>
      </header>

      <div className="mb-4">
        <OrdersViewSwitcher mode="list" />
      </div>

      <div className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {STATUS_ORDER.map((s) => {
          const c = counts.find((x) => x.status === s)?.count ?? 0
          const selected = status === s
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(selected ? 'all' : s)}
              aria-pressed={selected}
              className={cn(
                'shrink-0 rounded-full transition-shadow',
                selected && 'shadow-[0_0_0_2px_var(--accent)]'
              )}
            >
              <StatusBadge
                status={s}
                dot={false}
                label={
                  <>
                    {STATUS_LABELS[s]}{' '}
                    <span className="ml-1 tabular-nums opacity-70">{c}</span>
                  </>
                }
              />
            </button>
          )
        })}
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary)]"
          />
          <Input
            placeholder="Buscar por nome do cliente…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            options={STATUS_SELECT_OPTIONS}
          />
        </div>
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
          <OrderRowSkeleton />
          <OrderRowSkeleton />
          <OrderRowSkeleton />
          <OrderRowSkeleton />
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <p
            className="text-[color:var(--text-secondary)]"
            style={{ fontSize: 'var(--text-body-size)' }}
          >
            Sem pedidos ainda.
          </p>
        </Card>
      ) : (
        <Card padded={false}>
          {rows.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              onChangeStatus={changeStatus}
              onOpen={() =>
                o.contact_id && router.push(`/contacts/${o.contact_id}`)
              }
            />
          ))}
        </Card>
      )}
    </div>
  )
}

function OrderRow({
  order,
  onChangeStatus,
  onOpen,
}: {
  order: Order
  onChangeStatus: (id: string, next: OrderStatus) => void
  onOpen: () => void
}) {
  const total = Number(order.total)
  const paid = Number(order.paid_amount ?? 0)
  const saldo = total - paid

  return (
    <div
      onClick={onOpen}
      className="flex cursor-pointer flex-col items-stretch gap-2 border-b border-[color:var(--border-subtle)] bg-[var(--surface-card)] px-3.5 py-3 transition-colors last:border-b-0 hover:bg-[var(--surface-hover)] sm:flex-row sm:items-center sm:gap-3"
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-[color:var(--text-primary)]">
          {order.contact?.name ?? '—'}
        </div>
        {order.contact?.business_name ? (
          <div className="truncate text-xs text-[color:var(--text-secondary)]">
            {order.contact.business_name}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
        <div className="flex flex-col items-start sm:items-end">
          <span className="font-mono text-[13px] font-medium tabular-nums text-[color:var(--text-primary)]">
            {formatBRL(total)}
          </span>
          <span className="text-[11px] text-[color:var(--text-hint)]">
            {order.quantity} un.
          </span>
          {saldo > 0 ? (
            <span className="text-[11px] text-[color:var(--accent-hover)]">
              Saldo {formatBRL(saldo)}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={order.status} dot={false} />
          <span className="text-[11px] text-[color:var(--text-hint)]">
            {relevantDateLabel(order)}
          </span>
        </div>
      </div>

      <div
        className="w-full sm:w-[170px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Select
          value={order.status}
          onChange={(e) =>
            onChangeStatus(order.id, e.target.value as OrderStatus)
          }
          options={STATUS_ROW_OPTIONS}
          aria-label="Trocar status"
        />
      </div>
    </div>
  )
}

function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-3.5 py-3 last:border-b-0">
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="h-3 w-40 animate-pulse rounded bg-[var(--slate-200)]" />
        <div className="mt-1.5 h-3 w-28 animate-pulse rounded bg-[var(--slate-200)]" />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className="h-3 w-16 animate-pulse rounded bg-[var(--slate-200)]" />
        <div className="h-3 w-10 animate-pulse rounded bg-[var(--slate-200)]" />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className="h-5 w-20 animate-pulse rounded-full bg-[var(--slate-200)]" />
        <div className="h-3 w-14 animate-pulse rounded bg-[var(--slate-200)]" />
      </div>
      <div className="h-9 w-[170px] animate-pulse rounded-md bg-[var(--slate-200)]" />
    </div>
  )
}
