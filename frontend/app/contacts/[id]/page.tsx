'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import type { Contact, Order } from '@/lib/types'
import {
  Avatar,
  Badge,
  Button,
  Card,
  KpiCard,
  StatusBadge,
} from '@/components/ds'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ContactImagesSection } from './_components/contact-images-section'
import { ContactAddressesSection } from './_components/contact-addresses-section'
import { OptOutToggle } from './_components/opt-out-toggle'

function formatBRL(v: number): string {
  return `R$ ${v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '')
}

export default function ContactDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [contact, setContact] = useState<Contact | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    void load(id)
  }, [id])

  async function load(contactId: string) {
    setLoading(true)
    setErr(null)
    try {
      const [c, o] = await Promise.all([
        api.get<Contact>(`/contacts/${contactId}`),
        api.get<Order[]>('/orders/', { params: { contact_id: contactId } }),
      ])
      setContact(c.data)
      setOrders(o.data)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Falha ao carregar contato')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
        <DetailSkeleton />
      </div>
    )
  }

  if (err) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
        <div
          className="rounded-lg border bg-[var(--negative-tint)] px-4 py-3"
          style={{
            borderColor: 'var(--negative)',
            color: 'var(--negative)',
            fontSize: 'var(--text-body-size)',
          }}
        >
          {err}
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
        <Card>
          <p
            className="text-[color:var(--text-secondary)]"
            style={{ fontSize: 'var(--text-body-size)' }}
          >
            Contato não encontrado.
          </p>
        </Card>
      </div>
    )
  }

  const waUrl = `https://wa.me/55${digitsOnly(contact.phone)}`
  const lastOrderRelative = contact.last_order_at
    ? formatDistanceToNow(new Date(contact.last_order_at), {
        locale: ptBR,
        addSuffix: true,
      })
    : '—'
  const ltv = Number(contact.lifetime_value)
  const ticketMedio = contact.total_orders > 0 ? Math.round(ltv / contact.total_orders) : 0

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-3 inline-flex items-center gap-1.5 bg-transparent border-0 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] cursor-pointer"
        style={{ fontSize: '13px' }}
      >
        <ArrowLeft size={16} strokeWidth={1.75} /> Clientes
      </button>

      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={contact.name} size="lg" />
          <div>
            <h1
              className="m-0 text-[color:var(--text-primary)]"
              style={{
                fontSize: 'var(--text-page-size)',
                lineHeight: 'var(--text-page-lh)',
                fontWeight: 'var(--weight-medium)',
                letterSpacing: 'var(--tracking-tight)',
              }}
            >
              {contact.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={contact.status} />
              {contact.segment ? (
                <Badge variant="lead" className="capitalize">
                  {contact.segment}
                </Badge>
              ) : null}
              <span
                className="text-[color:var(--text-secondary)]"
                style={{ fontSize: '13px' }}
              >
                {contact.phone}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="secondary"
              className="bg-[var(--positive-tint)] text-[color:var(--positive-text)] hover:bg-[var(--positive-tint)]/80"
            >
              WhatsApp
            </Button>
          </a>
          <Link href={`/orders/new?contact_id=${contact.id}`}>
            <Button
              variant="primary"
              iconLeft={<Plus size={16} strokeWidth={1.75} />}
            >
              Pedido
            </Button>
          </Link>
        </div>
      </header>

      <section className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Pedidos" value={contact.total_orders} />
        <KpiCard label="LTV" value={formatBRL(ltv)} />
        <KpiCard label="Última compra" value={lastOrderRelative} />
        <KpiCard label="Ticket médio" value={formatBRL(ticketMedio)} />
      </section>

      <Card title="Pedidos" padded={false}>
        {orders.length === 0 ? (
          <div className="px-4 py-4 md:px-6">
            <p
              className="text-[color:var(--text-secondary)]"
              style={{ fontSize: 'var(--text-body-size)' }}
            >
              Nenhum pedido ainda.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {orders.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        )}
      </Card>

      <Card title="Endereços" padded={false} className="mt-4">
        <ContactAddressesSection contactId={contact.id} />
      </Card>

      <Card title="Imagens" padded={false} className="mt-4">
        <ContactImagesSection contactId={contact.id} />
      </Card>

      <Card title="Campanhas" padded={false} className="mt-4">
        <OptOutToggle contact={contact} onChange={setContact} />
      </Card>

      {contact.notes ? (
        <Card title="Notas" className="mt-4">
          <p
            className="whitespace-pre-wrap text-[color:var(--text-primary)]"
            style={{
              fontSize: 'var(--text-body-size)',
              lineHeight: 'var(--text-body-lh)',
            }}
          >
            {contact.notes}
          </p>
        </Card>
      ) : null}
    </div>
  )
}

function OrderRow({ order }: { order: Order }) {
  const model = order.bag_model
    ? `${order.bag_model}${order.bag_size ? ` · ${order.bag_size}` : ''}`
    : 'Pedido'
  const dateLabel = format(new Date(order.created_at), 'dd/MM/yyyy', {
    locale: ptBR,
  })
  return (
    <div className="flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-4 py-3 last:border-b-0 md:px-6">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[color:var(--text-primary)] truncate">
          {model}
        </div>
        <div className="text-xs text-[color:var(--text-secondary)]">
          Qtd. {order.quantity} · {dateLabel}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <StatusBadge status={order.status} />
        <span className="font-mono text-sm font-medium text-[color:var(--text-primary)] tabular-nums">
          {`R$ ${Number(order.total).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
        </span>
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="h-11 w-11 animate-pulse rounded-full bg-[var(--slate-200)]" />
        <div className="flex flex-col gap-2">
          <div className="h-5 w-48 animate-pulse rounded bg-[var(--slate-200)]" />
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--slate-200)]" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-lg bg-[var(--surface-muted)] p-4"
          >
            <div className="h-3 w-16 animate-pulse rounded bg-[var(--slate-200)]" />
            <div className="h-6 w-24 animate-pulse rounded bg-[var(--slate-200)]" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--slate-200)] mb-4" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-[color:var(--border-subtle)] py-3 last:border-b-0"
          >
            <div className="h-4 w-40 animate-pulse rounded bg-[var(--slate-200)]" />
            <div className="h-4 w-20 animate-pulse rounded bg-[var(--slate-200)]" />
          </div>
        ))}
      </div>
    </div>
  )
}
