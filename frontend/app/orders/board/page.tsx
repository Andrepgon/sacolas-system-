'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Order } from '@/lib/types'
import { Button, type OrderStatus } from '@/components/ds'
import {
  BOARD_STATUS_ORDER,
  STATUS_LABELS,
  STATUS_ORDER,
  formatBRL,
} from '@/lib/orders'
import { OrdersViewSwitcher } from '../_view-switcher'

export default function OrdersBoardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [includeCancelled, setIncludeCancelled] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setErr(null)
      try {
        const { data } = await api.get<Order[]>('/orders/')
        if (!cancelled) setOrders(data)
      } catch (e: unknown) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : 'Falha ao carregar pedidos')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const visibleStatuses: OrderStatus[] = includeCancelled
    ? [...BOARD_STATUS_ORDER, 'cancelled']
    : BOARD_STATUS_ORDER

  const byStatus = useMemo(() => {
    const m = {} as Record<OrderStatus, Order[]>
    STATUS_ORDER.forEach((s) => {
      m[s] = []
    })
    orders.forEach((o) => {
      m[o.status]?.push(o)
    })
    return m
  }, [orders])

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id))
  }

  async function onDragEnd(e: DragEndEvent) {
    setActiveId(null)
    const { active, over } = e
    if (!over) return

    const id = String(active.id)
    const overId = String(over.id)
    const targetStatus: OrderStatus | undefined = overId.startsWith('col:')
      ? (overId.slice(4) as OrderStatus)
      : orders.find((o) => o.id === overId)?.status
    if (!targetStatus) return

    const dragged = orders.find((o) => o.id === id)
    if (!dragged || dragged.status === targetStatus) return

    const prev = orders
    setOrders((cur) =>
      cur.map((o) => (o.id === id ? { ...o, status: targetStatus } : o))
    )
    try {
      await api.patch<Order>(`/orders/${id}`, { status: targetStatus })
      toast.success(`Movido pra ${STATUS_LABELS[targetStatus]}`)
    } catch (err) {
      setOrders(prev)
      const detail = axios.isAxiosError(err)
        ? (err.response?.data as { detail?: string } | undefined)?.detail
        : null
      toast.error(detail ?? 'Falha ao mover')
    }
  }

  const activeOrder = activeId
    ? orders.find((o) => o.id === activeId) ?? null
    : null

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-5 md:px-6 md:py-6">
      <header className="mb-3 flex items-center justify-between gap-4">
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

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <OrdersViewSwitcher mode="board" />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--text-secondary)]">
          <input
            type="checkbox"
            checked={includeCancelled}
            onChange={(e) => setIncludeCancelled(e.target.checked)}
          />
          Mostrar cancelados
        </label>
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
        <BoardSkeleton statuses={visibleStatuses} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-3 md:mx-0 md:px-0">
            {visibleStatuses.map((s) => (
              <Column
                key={s}
                status={s}
                orders={byStatus[s] ?? []}
                onOpenOrder={(o) => router.push(`/contacts/${o.contact_id}`)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeOrder ? <CardPreview order={activeOrder} dragging /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}

function Column({
  status,
  orders,
  onOpenOrder,
}: {
  status: OrderStatus
  orders: Order[]
  onOpenOrder: (o: Order) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${status}` })
  const total = orders.reduce((sum, o) => sum + Number(o.total), 0)
  return (
    <section
      ref={setNodeRef}
      className={cn(
        'flex w-[280px] shrink-0 flex-col rounded-lg border bg-[var(--surface-muted)]',
        isOver
          ? 'border-[color:var(--accent)]'
          : 'border-[color:var(--border-subtle)]'
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b border-[color:var(--border-subtle)] px-3 py-2">
        <span className="text-sm font-medium text-[color:var(--text-primary)]">
          {STATUS_LABELS[status]}
        </span>
        <span className="flex items-center gap-2 text-xs text-[color:var(--text-secondary)]">
          <span className="tabular-nums">{orders.length}</span>
          <span className="font-mono tabular-nums">{formatBRL(total)}</span>
        </span>
      </header>
      <SortableContext
        items={orders.map((o) => o.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-[60px] flex-col gap-2 p-2">
          {orders.length === 0 ? (
            <span className="px-1 py-3 text-center text-xs text-[color:var(--text-hint)]">
              Vazio
            </span>
          ) : (
            orders.map((o) => (
              <SortableCard
                key={o.id}
                order={o}
                onClick={() => onOpenOrder(o)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  )
}

function SortableCard({
  order,
  onClick,
}: {
  order: Order
  onClick: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      <CardPreview order={order} />
    </div>
  )
}

function CardPreview({
  order,
  dragging,
}: {
  order: Order
  dragging?: boolean
}) {
  return (
    <div
      className={cn(
        'flex cursor-grab flex-col gap-1 rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-2.5 text-left',
        'transition-shadow hover:shadow-sm active:cursor-grabbing',
        dragging && 'shadow-md'
      )}
    >
      <span className="truncate text-sm font-medium text-[color:var(--text-primary)]">
        {order.contact?.name ?? '—'}
      </span>
      {order.contact?.business_name ? (
        <span className="truncate text-xs text-[color:var(--text-secondary)]">
          {order.contact.business_name}
        </span>
      ) : null}
      <div className="mt-1 flex items-center justify-between text-xs text-[color:var(--text-secondary)]">
        <span>{order.quantity} un.</span>
        <span className="font-mono tabular-nums text-[color:var(--text-primary)]">
          {formatBRL(Number(order.total))}
        </span>
      </div>
    </div>
  )
}

function BoardSkeleton({ statuses }: { statuses: OrderStatus[] }) {
  return (
    <div className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-3 md:mx-0 md:px-0">
      {statuses.map((s) => (
        <section
          key={s}
          className="flex w-[280px] shrink-0 flex-col rounded-lg border border-[color:var(--border-subtle)] bg-[var(--surface-muted)]"
        >
          <header className="flex items-center justify-between gap-2 border-b border-[color:var(--border-subtle)] px-3 py-2">
            <span className="text-sm font-medium text-[color:var(--text-primary)]">
              {STATUS_LABELS[s]}
            </span>
            <span className="h-3 w-12 animate-pulse rounded bg-[var(--slate-200)]" />
          </header>
          <div className="flex flex-col gap-2 p-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[68px] animate-pulse rounded-md bg-[var(--slate-200)]"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
