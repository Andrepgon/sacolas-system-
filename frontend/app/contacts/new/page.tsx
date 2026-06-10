'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'
import type { Contact } from '@/lib/types'
import { Button, Card, Input, Select } from '@/components/ds'
import { SEGMENTS } from '@/lib/segments'

interface AddressDraft {
  label: string
  address: string
  is_default: boolean
}

const E164 = /^\+?[1-9]\d{1,14}$/

function normalizePhone(raw: string): string {
  let cleaned = raw.replace(/[^\d+]/g, '')
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10 || cleaned.length === 11) {
      cleaned = '+55' + cleaned
    } else {
      cleaned = '+' + cleaned
    }
  }
  return cleaned
}

const schema = z.object({
  name: z.string().min(1, 'Obrigatório').max(200),
  phone: z
    .string()
    .min(1, 'Obrigatório')
    .refine((v) => E164.test(normalizePhone(v)), 'Telefone inválido'),
  business_name: z.string().optional(),
  segment: z.string().optional(),
  has_vector_logo: z.boolean().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function NewContactPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<AddressDraft[]>([])
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      segment: '',
      has_vector_logo: false,
    },
  })

  async function onSubmit(values: FormData) {
    setSubmitError(null)
    try {
      const payload = {
        ...values,
        phone: normalizePhone(values.phone),
        status: 'lead' as const,
        source: 'manual',
        tags: [] as string[],
      }
      const { data } = await api.post<Contact>('/contacts/', payload)

      // Posta endereços staged. Manter ordem: o backend desmarca outros como
      // is_default cada vez que recebe um com is_default=true.
      for (const a of addresses) {
        try {
          await api.post(`/contacts/${data.id}/addresses`, {
            label: a.label.trim() || null,
            address: a.address.trim(),
            is_default: a.is_default,
          })
        } catch {
          // ignora individual; usuário pode reabrir na tela de detalhe.
        }
      }

      router.push(`/contacts/${data.id}`)
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
          Novo cliente
        </h1>
      </header>

      <Card className="max-w-[520px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field label="Nome" htmlFor="name" error={errors.name?.message}>
            <Input
              id="name"
              placeholder="Nome do contato"
              invalid={!!errors.name}
              {...register('name')}
            />
          </Field>

          <Field label="Telefone" htmlFor="phone" error={errors.phone?.message}>
            <Input
              id="phone"
              inputMode="tel"
              placeholder="(11) 98765-4321"
              invalid={!!errors.phone}
              {...register('phone')}
            />
          </Field>

          <Field label="Nome do negócio" htmlFor="business_name">
            <Input
              id="business_name"
              placeholder="Ex.: Papelaria Aurora"
              {...register('business_name')}
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Segmento" htmlFor="segment">
              <Controller
                control={control}
                name="segment"
                render={({ field }) => (
                  <Select
                    id="segment"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    options={SEGMENTS as unknown as string[]}
                    placeholder="Selecione…"
                  />
                )}
              />
            </Field>

            <Field label="Logo vetorizada">
              <Controller
                control={control}
                name="has_vector_logo"
                render={({ field }) => (
                  <Switch
                    checked={!!field.value}
                    onChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </Field>
          </div>

          <Field label="Endereços">
            <StagedAddresses value={addresses} onChange={setAddresses} />
          </Field>

          <Field label="Observações" htmlFor="notes">
            <textarea
              id="notes"
              rows={3}
              className="w-full rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-2.5 font-sans text-base md:text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-hint)] outline-none transition-[border-color,box-shadow] duration-fast ease-standard focus:border-primary focus:shadow-focus resize-none"
              placeholder="Preferências de modelo, prazos…"
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
              {isSubmitting ? 'Salvando…' : 'Salvar'}
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

function StagedAddresses({
  value,
  onChange,
}: {
  value: AddressDraft[]
  onChange: (next: AddressDraft[]) => void
}) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<AddressDraft>({
    label: '',
    address: '',
    is_default: false,
  })
  const [editingIdx, setEditingIdx] = useState<number | null>(null)

  function commit(next: AddressDraft) {
    const trimmed: AddressDraft = {
      label: next.label.trim(),
      address: next.address.trim(),
      is_default: next.is_default,
    }
    if (!trimmed.address) return
    let updated: AddressDraft[]
    if (editingIdx !== null) {
      updated = value.map((a, i) => (i === editingIdx ? trimmed : a))
    } else {
      updated = [...value, trimmed]
    }
    if (trimmed.is_default) {
      updated = updated.map((a, i) => ({
        ...a,
        is_default:
          editingIdx !== null ? i === editingIdx : i === updated.length - 1,
      }))
    }
    onChange(updated)
    setDraft({ label: '', address: '', is_default: false })
    setEditingIdx(null)
    setAdding(false)
  }

  function startEdit(idx: number) {
    setDraft(value[idx])
    setEditingIdx(idx)
    setAdding(true)
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx))
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length === 0 && !adding ? (
        <div
          className="flex items-center gap-2 rounded-md border border-dashed border-[color:var(--border-subtle)] px-3 py-3 text-[color:var(--text-secondary)]"
          style={{ fontSize: 'var(--text-body-size)' }}
        >
          <MapPin size={16} strokeWidth={1.5} />
          <span>Nenhum endereço.</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {value.map((a, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {a.label ? (
                    <span
                      className="text-[color:var(--text-primary)]"
                      style={{
                        fontSize: 'var(--text-body-size)',
                        fontWeight: 'var(--weight-medium)',
                      }}
                    >
                      {a.label}
                    </span>
                  ) : null}
                  {a.is_default ? (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary"
                      style={{ fontSize: '11px', fontWeight: 500 }}
                    >
                      <Star size={11} strokeWidth={1.75} /> Padrão
                    </span>
                  ) : null}
                </div>
                <div
                  className="mt-0.5 whitespace-pre-wrap break-words text-[color:var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-body-size)' }}
                >
                  {a.address}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(idx)}
                  aria-label="Editar"
                  className="rounded p-1.5 text-[color:var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[color:var(--text-primary)]"
                >
                  <Pencil size={16} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  aria-label="Remover"
                  className="rounded p-1.5 text-[color:var(--text-secondary)] hover:bg-[var(--negative-tint)] hover:text-[color:var(--negative)]"
                >
                  <Trash2 size={16} strokeWidth={1.75} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <div className="rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-3">
          <div className="flex flex-col gap-2">
            <div>
              <label
                className="mb-1 block text-[color:var(--text-secondary)]"
                style={{ fontSize: '12px' }}
              >
                Apelido (opcional)
              </label>
              <Input
                value={draft.label}
                onChange={(e) =>
                  setDraft({ ...draft, label: e.target.value })
                }
                placeholder="Ex.: Loja centro"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-[color:var(--text-secondary)]"
                style={{ fontSize: '12px' }}
              >
                Endereço
              </label>
              <textarea
                value={draft.address}
                onChange={(e) =>
                  setDraft({ ...draft, address: e.target.value })
                }
                rows={2}
                placeholder="Rua, número, bairro — cidade/UF"
                className="w-full resize-none rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-2.5 font-sans text-base text-[color:var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-fast ease-standard placeholder:text-[color:var(--text-hint)] focus:border-primary focus:shadow-focus md:text-sm"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 self-start">
              <input
                type="checkbox"
                checked={draft.is_default}
                onChange={(e) =>
                  setDraft({ ...draft, is_default: e.target.checked })
                }
              />
              <span
                className="text-[color:var(--text-primary)]"
                style={{ fontSize: 'var(--text-body-size)' }}
              >
                Marcar como padrão
              </span>
            </label>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setAdding(false)
                setEditingIdx(null)
                setDraft({ label: '', address: '', is_default: false })
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => commit(draft)}
            >
              {editingIdx !== null ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          iconLeft={<Plus size={16} strokeWidth={1.75} />}
          onClick={() => setAdding(true)}
          className="self-start"
        >
          Adicionar endereço
        </Button>
      )}
    </div>
  )
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-fast ease-standard outline-none focus-visible:shadow-focus ${
        checked ? 'bg-primary' : 'bg-[var(--slate-300)]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-fast ease-standard ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
