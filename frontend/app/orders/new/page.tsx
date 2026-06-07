'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Search } from 'lucide-react'
import { api } from '@/lib/api'
import type { Contact, Order } from '@/lib/types'
import {
  Avatar,
  Button,
  Card,
  Input,
  Select,
  StatusBadge,
} from '@/components/ds'

const ORDER_STATUS_OPTIONS = [
  { value: 'quote', label: 'Orçamento' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'vector_pending', label: 'Aguardando vetor' },
  { value: 'factory_pending', label: 'Na fábrica' },
  { value: 'printing', label: 'Em impressão' },
  { value: 'ready_to_deliver', label: 'Pronto p/ entregar' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'paid', label: 'Pago' },
  { value: 'cancelled', label: 'Cancelado' },
]

const ORDER_STATUSES = [
  'quote',
  'confirmed',
  'vector_pending',
  'factory_pending',
  'printing',
  'ready_to_deliver',
  'delivered',
  'paid',
  'cancelled',
] as const

const schema = z.object({
  contact_id: z.string().uuid('Selecione um cliente'),
  quantity: z.number().int().positive('Obrigatório'),
  bag_model: z.string().optional(),
  bag_size: z.string().optional(),
  total: z.number().nonnegative('Obrigatório'),
  status: z.enum(ORDER_STATUSES),
  delivery_address: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function NewOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
          <FormSkeleton />
        </div>
      }
    >
      <NewOrderForm />
    </Suspense>
  )
}

function NewOrderForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillContactId = searchParams.get('contact_id') ?? ''

  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      contact_id: prefillContactId,
      status: 'confirmed',
    },
  })

  useEffect(() => {
    if (!prefillContactId) return
    void api
      .get<Contact>(`/contacts/${prefillContactId}`)
      .then(({ data }) => setSelectedContact(data))
      .catch(() => {
        /* ignore — usuário escolhe manualmente */
      })
  }, [prefillContactId])

  useEffect(() => {
    if (!search || selectedContact) {
      setSuggestions([])
      return
    }
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get<Contact[]>('/contacts/', {
          params: { search, limit: 5 },
        })
        setSuggestions(data)
      } catch {
        setSuggestions([])
      }
    }, 250)
    return () => clearTimeout(t)
  }, [search, selectedContact])

  function pickContact(c: Contact) {
    setSelectedContact(c)
    setValue('contact_id', c.id, { shouldValidate: true })
    setSearch('')
    setSuggestions([])
    setOpen(false)
  }

  function clearContact() {
    setSelectedContact(null)
    setValue('contact_id', '', { shouldValidate: true })
  }

  async function onSubmit(values: FormData) {
    setSubmitError(null)
    try {
      const { data } = await api.post<Order>('/orders/', values)
      router.push(`/contacts/${data.contact_id}`)
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const detail =
          (e.response?.data as { detail?: string } | undefined)?.detail
        setSubmitError(detail ?? e.message)
      } else {
        setSubmitError(e instanceof Error ? e.message : 'Erro ao criar')
      }
    }
  }

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
          Novo pedido
        </h1>
      </header>

      <Card className="max-w-[520px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field label="Cliente" error={errors.contact_id?.message}>
            {selectedContact ? (
              <div className="flex items-center justify-between gap-3 rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] px-3 py-2">
                <span className="flex items-center gap-2.5">
                  <Avatar name={selectedContact.name} size="sm" />
                  <span className="flex flex-col">
                    <span
                      className="text-[color:var(--text-primary)]"
                      style={{
                        fontSize: 'var(--text-body-size)',
                        fontWeight: 'var(--weight-medium)',
                      }}
                    >
                      {selectedContact.name}
                    </span>
                    <span
                      className="text-[color:var(--text-secondary)]"
                      style={{ fontSize: 'var(--text-hint-size)' }}
                    >
                      {selectedContact.phone}
                    </span>
                  </span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearContact}
                >
                  Trocar
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search
                  size={16}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary)]"
                />
                <Input
                  placeholder="Buscar cliente por nome ou telefone…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setOpen(true)
                  }}
                  onFocus={() => setOpen(true)}
                  className="pl-9"
                  invalid={!!errors.contact_id}
                />
                {open && (suggestions.length > 0 || search.trim()) ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 overflow-hidden rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] shadow-md">
                    {suggestions.length > 0 ? (
                      suggestions.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => pickContact(c)}
                          className="flex w-full items-center gap-2.5 border-b border-[color:var(--border-subtle)] bg-transparent px-3 py-2 text-left last:border-b-0 hover:bg-[var(--surface-hover)] cursor-pointer"
                        >
                          <Avatar name={c.name} size="sm" />
                          <span className="flex-1 min-w-0">
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
                              {c.phone}
                            </span>
                          </span>
                          <StatusBadge status={c.status} dot={false} />
                        </button>
                      ))
                    ) : (
                      <div
                        className="px-3 py-3 text-[color:var(--text-secondary)]"
                        style={{ fontSize: 'var(--text-body-size)' }}
                      >
                        Nenhum cliente.{' '}
                        <a
                          href="/contacts/new"
                          className="text-primary hover:underline"
                        >
                          + Novo cliente
                        </a>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
            <input type="hidden" {...register('contact_id')} />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Quantidade" htmlFor="quantity" error={errors.quantity?.message}>
              <Input
                id="quantity"
                type="number"
                inputMode="numeric"
                placeholder="500"
                invalid={!!errors.quantity}
                className="mono"
                {...register('quantity', { valueAsNumber: true })}
              />
            </Field>
            <Field label="Total (R$)" htmlFor="total" error={errors.total?.message}>
              <Input
                id="total"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="1480.00"
                invalid={!!errors.total}
                className="mono"
                {...register('total', { valueAsNumber: true })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Modelo" htmlFor="bag_model">
              <Input
                id="bag_model"
                placeholder="Kraft alça torcida"
                {...register('bag_model')}
              />
            </Field>
            <Field label="Tamanho" htmlFor="bag_size">
              <Input
                id="bag_size"
                placeholder="28×35 cm"
                {...register('bag_size')}
              />
            </Field>
          </div>

          <Field label="Status" htmlFor="status">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  id="status"
                  value={field.value}
                  onChange={field.onChange}
                  options={ORDER_STATUS_OPTIONS}
                />
              )}
            />
          </Field>

          <Field label="Endereço de entrega" htmlFor="delivery_address">
            <Input
              id="delivery_address"
              placeholder="Rua, número, bairro — cidade/UF"
              {...register('delivery_address')}
            />
          </Field>

          <Field label="Observações" htmlFor="notes">
            <textarea
              id="notes"
              rows={3}
              className="w-full rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-2.5 font-sans text-base md:text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-hint)] outline-none transition-[border-color,box-shadow] duration-fast ease-standard focus:border-primary focus:shadow-focus resize-none"
              placeholder="Cor da impressão, prazo combinado, contato na entrega…"
              {...register('notes')}
            />
          </Field>

          {submitError ? (
            <div
              className="rounded-md border bg-[var(--negative-tint)] px-3 py-2"
              style={{
                borderColor: 'var(--negative)',
                color: 'var(--negative)',
                fontSize: '13px',
              }}
            >
              {submitError}
            </div>
          ) : null}

          <div className="mt-1 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando…' : 'Salvar pedido'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[color:var(--text-primary)]"
        style={{
          fontSize: 'var(--text-label-size)',
          fontWeight: 'var(--weight-medium)',
        }}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          className="m-0 text-[color:var(--negative)]"
          style={{ fontSize: 'var(--text-hint-size)' }}
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-4 md:p-6 max-w-[520px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="h-3 w-24 animate-pulse rounded bg-[var(--slate-200)]" />
          <div className="h-9 w-full animate-pulse rounded-md bg-[var(--slate-200)]" />
        </div>
      ))}
    </div>
  )
}
