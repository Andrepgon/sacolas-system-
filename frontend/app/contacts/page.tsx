'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { api } from '@/lib/api'
import type { Contact } from '@/lib/types'
import { Button, Card, ContactRow, Input, Select } from '@/components/ds'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type StatusFilter = 'all' | Contact['status']
type SortKey = 'ltv' | 'name'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'lead', label: 'Leads' },
  { value: 'customer', label: 'Clientes' },
  { value: 'inactive', label: 'Inativos' },
  { value: 'churned', label: 'Perdidos' },
]

const SORT_OPTIONS = [
  { value: 'ltv', label: 'Maior LTV' },
  { value: 'name', label: 'Nome (A–Z)' },
]

function formatBRL(v: number): string {
  return `R$ ${v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

function lastOrderText(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined
  try {
    return formatDistanceToNow(new Date(iso), { locale: ptBR, addSuffix: true })
  } catch {
    return undefined
  }
}

export default function ContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortKey>('ltv')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchContacts()
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status])

  async function fetchContacts() {
    setLoading(true)
    setErr(null)
    try {
      const params: { search?: string; status?: Contact['status'] } = {}
      if (search) params.search = search
      if (status !== 'all') params.status = status
      const { data } = await api.get<Contact[]>('/contacts/', { params })
      setContacts(data)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Falha ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }

  const rows = useMemo(() => {
    const sorted = [...contacts]
    sorted.sort((a, b) =>
      sort === 'ltv'
        ? Number(b.lifetime_value) - Number(a.lifetime_value)
        : a.name.localeCompare(b.name, 'pt-BR')
    )
    return sorted
  }, [contacts, sort])

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
          Clientes
        </h1>
        <Button
          variant="primary"
          iconLeft={<Plus size={16} strokeWidth={1.75} />}
          onClick={() => router.push('/contacts/new')}
        >
          Novo
        </Button>
      </header>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary)]"
          />
          <Input
            placeholder="Buscar por nome ou telefone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto">
          <div className="w-full sm:w-[160px]">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              options={STATUS_OPTIONS}
            />
          </div>
          <div className="w-full sm:w-[150px]">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              options={SORT_OPTIONS}
            />
          </div>
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
          <ContactRowSkeleton />
          <ContactRowSkeleton />
          <ContactRowSkeleton />
          <ContactRowSkeleton />
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <p
            className="text-[color:var(--text-secondary)]"
            style={{ fontSize: 'var(--text-body-size)' }}
          >
            Nenhum cliente encontrado.
          </p>
        </Card>
      ) : (
        <Card padded={false}>
          {rows.map((c) => (
            <ContactRow
              key={c.id}
              name={c.name}
              business={c.business_name}
              phone={c.phone}
              status={c.status}
              ltv={
                Number(c.lifetime_value) > 0
                  ? formatBRL(Number(c.lifetime_value))
                  : undefined
              }
              lastOrder={lastOrderText(c.last_order_at)}
              onClick={() => router.push(`/contacts/${c.id}`)}
            />
          ))}
        </Card>
      )}
    </div>
  )
}

function ContactRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-3.5 py-3 last:border-b-0">
      <span className="h-9 w-9 animate-pulse rounded-full bg-[var(--slate-200)]" />
      <div className="flex-1 flex-col gap-1.5">
        <div className="h-3 w-40 animate-pulse rounded bg-[var(--slate-200)]" />
        <div className="mt-1.5 h-3 w-28 animate-pulse rounded bg-[var(--slate-200)]" />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className="h-5 w-20 animate-pulse rounded-full bg-[var(--slate-200)]" />
        <div className="h-3 w-16 animate-pulse rounded bg-[var(--slate-200)]" />
      </div>
    </div>
  )
}
