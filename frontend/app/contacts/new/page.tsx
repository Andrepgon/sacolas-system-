'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { api } from '@/lib/api'
import type { Contact } from '@/lib/types'
import { Button, Card, Input, Select } from '@/components/ds'

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

const SEGMENT_OPTIONS = [
  { value: 'papelaria', label: 'Papelaria' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'boutique', label: 'Boutique' },
  { value: 'confeitaria', label: 'Confeitaria' },
  { value: 'outro', label: 'Outro' },
]

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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      segment: 'papelaria',
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
                    options={SEGMENT_OPTIONS}
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

          <Field label="Observações" htmlFor="notes">
            <textarea
              id="notes"
              rows={3}
              className="w-full rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-2.5 font-sans text-base md:text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-hint)] outline-none transition-[border-color,box-shadow] duration-fast ease-standard focus:border-primary focus:shadow-focus resize-none"
              placeholder="Preferências de modelo, prazos, endereço de entrega…"
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
