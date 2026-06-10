'use client'

import {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import {
  ArrowRight,
  ImageIcon,
  Info,
  Trash2,
  Upload,
} from 'lucide-react'

import { api } from '@/lib/api'
import type { Campaign } from '@/lib/types'
import { Button, Card, Input, StatusBadge } from '@/components/ds'

const PLACEHOLDERS = [
  { token: '{{primeiro_nome}}', label: 'Primeiro nome' },
  { token: '{{nome}}', label: 'Nome' },
  { token: '{{empresa}}', label: 'Empresa' },
  { token: '{{imagem}}', label: 'Imagem' },
] as const

const SAMPLE_CONTACT = {
  name: 'Maria Silva',
  business_name: 'Padaria Pão Doce',
} as const

const schema = z.object({
  title: z.string().min(1, 'Obrigatório').max(200),
  message_template: z.string().min(1, 'Escreva a mensagem'),
})

type FormData = z.infer<typeof schema>

interface CampaignComposerProps {
  mode: 'new' | 'edit'
  campaign?: Campaign
  onCampaignChange?: (next: Campaign) => void
}

export function CampaignComposer({
  mode,
  campaign,
  onCampaignChange,
}: CampaignComposerProps) {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(
    campaign?.image_url ?? null,
  )
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: campaign?.title ?? '',
      message_template: campaign?.message_template ?? '',
    },
  })

  // Mantém o ref do textarea sem perder o register do RHF.
  const { ref: rhfTextareaRef, ...rhfTextareaRest } = register('message_template')
  const setTextareaRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node
      rhfTextareaRef(node)
    },
    [rhfTextareaRef],
  )

  const messageTemplate = watch('message_template')
  const titleWatch = watch('title')

  const preview = useMemo(
    () => renderPreview(messageTemplate ?? '', SAMPLE_CONTACT, imageUrl),
    [messageTemplate, imageUrl],
  )

  function insertPlaceholder(token: string) {
    const el = textareaRef.current
    const current = getValues('message_template') ?? ''
    if (!el) {
      setValue('message_template', current + token, {
        shouldDirty: true,
        shouldValidate: true,
      })
      return
    }
    const start = el.selectionStart ?? current.length
    const end = el.selectionEnd ?? current.length
    const next = current.slice(0, start) + token + current.slice(end)
    setValue('message_template', next, {
      shouldDirty: true,
      shouldValidate: true,
    })
    // Reposiciona o cursor logo depois do token inserido.
    requestAnimationFrame(() => {
      if (!textareaRef.current) return
      const pos = start + token.length
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(pos, pos)
    })
  }

  async function onSubmit(values: FormData) {
    setSubmitError(null)
    try {
      if (mode === 'new') {
        const { data } = await api.post<Campaign>('/campaigns/', values)
        toast.success('Campanha criada')
        router.push(`/campanhas/${data.id}`)
        return
      }
      if (!campaign) return
      const { data } = await api.patch<Campaign>(
        `/campaigns/${campaign.id}`,
        values,
      )
      onCampaignChange?.(data)
      toast.success('Campanha salva')
    } catch (e: unknown) {
      const msg = extractErr(e, 'Erro ao salvar')
      setSubmitError(msg)
      toast.error(msg)
    }
  }

  function goToRecipients() {
    if (!campaign) return
    router.push(`/campanhas/${campaign.id}/destinatarios`)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-6"
    >
      {/* Coluna esquerda — composição */}
      <div className="flex flex-col gap-4">
        <Card>
          <div className="flex flex-col gap-4">
            <Field
              label="Título (interno)"
              htmlFor="title"
              error={errors.title?.message}
              hint="Só pra você organizar — o cliente não vê."
            >
              <Input
                id="title"
                placeholder="Ex.: Promo de Junho"
                invalid={!!errors.title}
                {...register('title')}
              />
            </Field>

            <Field
              label="Mensagem"
              htmlFor="message_template"
              error={errors.message_template?.message}
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {PLACEHOLDERS.map((p) => (
                    <button
                      key={p.token}
                      type="button"
                      onClick={() => insertPlaceholder(p.token)}
                      className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-card)] px-2.5 py-1 font-mono text-[color:var(--text-secondary)] transition-colors duration-fast ease-standard hover:border-primary hover:text-primary"
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                      title={`Inserir ${p.label}`}
                    >
                      {p.token}
                    </button>
                  ))}
                </div>
                <textarea
                  id="message_template"
                  ref={setTextareaRef}
                  {...rhfTextareaRest}
                  rows={8}
                  placeholder="Oi {{primeiro_nome}}! Tem uma novidade pra {{empresa}}…"
                  className="w-full resize-y rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-2.5 font-sans text-base md:text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-hint)] outline-none transition-[border-color,box-shadow] duration-fast ease-standard focus:border-primary focus:shadow-focus"
                />
                <p
                  className="m-0 text-[color:var(--text-hint)]"
                  style={{ fontSize: 'var(--text-hint-size)' }}
                >
                  Placeholders disponíveis:{' '}
                  <code className="font-mono">{'{{primeiro_nome}}'}</code>,{' '}
                  <code className="font-mono">{'{{nome}}'}</code>,{' '}
                  <code className="font-mono">{'{{empresa}}'}</code>,{' '}
                  <code className="font-mono">{'{{imagem}}'}</code>. Toque no
                  chip pra inserir no cursor.
                </p>
              </div>
            </Field>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  className="m-0 text-[color:var(--text-primary)]"
                  style={{
                    fontSize: 'var(--text-section-size)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  Imagem da campanha
                </h2>
                <p
                  className="m-0 mt-0.5 text-[color:var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-hint-size)' }}
                >
                  Vai como <strong>link no texto</strong> (não anexada).
                </p>
              </div>
            </div>
            <CampaignImageBlock
              mode={mode}
              campaignId={campaign?.id}
              imageUrl={imageUrl}
              onChange={(next) => {
                setImageUrl(next.image_url ?? null)
                onCampaignChange?.(next)
              }}
            />
          </div>
        </Card>

        {submitError ? (
          <div
            className="rounded-md border bg-[var(--negative-tint)] px-3 py-2"
            style={{
              borderColor: 'var(--negative)',
              color: 'var(--negative)',
              fontSize: 'var(--text-body-size)',
            }}
          >
            {submitError}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/campanhas')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? 'Salvando…'
              : mode === 'new'
                ? 'Criar rascunho'
                : isDirty
                  ? 'Salvar alterações'
                  : 'Salvo'}
          </Button>
          {mode === 'edit' ? (
            <Button
              type="button"
              variant="secondary"
              iconRight={<ArrowRight size={16} strokeWidth={1.75} />}
              onClick={goToRecipients}
              disabled={isDirty}
              title={
                isDirty
                  ? 'Salve as alterações antes de selecionar destinatários'
                  : undefined
              }
            >
              Selecionar destinatários
            </Button>
          ) : null}
        </div>
      </div>

      {/* Coluna direita — preview */}
      <div className="md:sticky md:top-4 md:self-start">
        <Card muted>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2
                  className="m-0 text-[color:var(--text-primary)]"
                  style={{
                    fontSize: 'var(--text-section-size)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  Preview
                </h2>
                {campaign ? <StatusBadge status={campaign.status} /> : null}
              </div>
              <span
                className="text-[color:var(--text-hint)]"
                style={{ fontSize: 'var(--text-hint-size)' }}
              >
                Como o cliente vê
              </span>
            </div>
            <PreviewBubble
              title={titleWatch}
              text={preview}
              imageUrl={imageUrl}
            />
            <div
              className="flex items-start gap-2 rounded-md bg-[var(--info-tint)] px-3 py-2 text-[color:var(--info-color)]"
              style={{ fontSize: 'var(--text-hint-size)' }}
            >
              <Info size={14} strokeWidth={1.75} className="mt-px shrink-0" />
              <span>
                A imagem é enviada como <strong>link</strong> dentro do texto —
                o WhatsApp gera a prévia ao receber.
              </span>
            </div>
            <p
              className="m-0 text-[color:var(--text-hint)]"
              style={{ fontSize: 'var(--text-hint-size)' }}
            >
              Exemplo: <strong>{SAMPLE_CONTACT.name}</strong> ·{' '}
              {SAMPLE_CONTACT.business_name}
            </p>
          </div>
        </Card>
      </div>
    </form>
  )
}

function PreviewBubble({
  title,
  text,
  imageUrl,
}: {
  title: string
  text: string
  imageUrl: string | null
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-3 shadow-xs">
      <div
        className="mb-2 truncate text-[color:var(--text-secondary)]"
        style={{ fontSize: 'var(--text-hint-size)' }}
      >
        {title || 'Sua mensagem aparecerá assim'}
      </div>
      <div
        className="whitespace-pre-wrap break-words text-[color:var(--text-primary)]"
        style={{ fontSize: 'var(--text-body-size)' }}
      >
        {text || (
          <span className="text-[color:var(--text-hint)]">
            Comece a escrever para ver o preview…
          </span>
        )}
      </div>
      {imageUrl ? (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block overflow-hidden rounded-lg border border-[color:var(--border-subtle)] bg-[var(--surface-muted)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Miniatura da imagem da campanha"
            className="h-40 w-full object-cover"
          />
        </a>
      ) : null}
    </div>
  )
}

function CampaignImageBlock({
  mode,
  campaignId,
  imageUrl,
  onChange,
}: {
  mode: 'new' | 'edit'
  campaignId?: string
  imageUrl: string | null
  onChange: (next: Campaign) => void
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !campaignId) {
      e.target.value = ''
      return
    }
    setUploading(true)
    setErr(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post<Campaign>(
        `/campaigns/${campaignId}/image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      onChange(data)
      toast.success('Imagem atualizada')
    } catch (ex: unknown) {
      const msg = extractErr(ex, 'Falha no upload')
      setErr(msg)
      toast.error(msg)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (mode === 'new') {
    return (
      <div className="flex items-center gap-2 rounded-md border border-dashed border-[color:var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-3 text-[color:var(--text-secondary)]">
        <ImageIcon size={16} strokeWidth={1.5} />
        <span style={{ fontSize: 'var(--text-body-size)' }}>
          Crie o rascunho primeiro pra subir a imagem.
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {imageUrl ? (
          <div className="overflow-hidden rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-muted)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Imagem da campanha"
              className="h-28 w-28 object-cover sm:h-24 sm:w-24"
            />
          </div>
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-md border border-dashed border-[color:var(--border-subtle)] bg-[var(--surface-muted)] text-[color:var(--text-hint)] sm:h-24 sm:w-24">
            <ImageIcon size={22} strokeWidth={1.5} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            iconLeft={<Upload size={16} strokeWidth={1.75} />}
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading
              ? 'Enviando…'
              : imageUrl
                ? 'Trocar imagem'
                : 'Enviar imagem'}
          </Button>
          {imageUrl ? (
            <p
              className="m-0 break-all text-[color:var(--text-hint)]"
              style={{ fontSize: 'var(--text-hint-size)' }}
            >
              {imageUrl}
            </p>
          ) : null}
        </div>
      </div>
      {err ? (
        <div
          className="flex items-center gap-2 rounded-md border bg-[var(--negative-tint)] px-3 py-2"
          style={{
            borderColor: 'var(--negative)',
            color: 'var(--negative)',
            fontSize: 'var(--text-hint-size)',
          }}
        >
          <Trash2 size={14} strokeWidth={1.75} />
          {err}
        </div>
      ) : null}
    </div>
  )
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
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
      ) : hint ? (
        <p
          className="m-0 text-[color:var(--text-hint)]"
          style={{ fontSize: 'var(--text-hint-size)' }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function renderPreview(
  template: string,
  contact: { name: string; business_name?: string | null },
  imageUrl: string | null,
): string {
  const name = (contact.name ?? '').trim()
  const businessName = (contact.business_name ?? '').trim()
  const primeiroNome = name ? name.split(' ')[0] : ''
  const empresa = businessName || name
  const imagem = imageUrl ?? ''

  let out = template
  out = out.split('{{primeiro_nome}}').join(primeiroNome)
  out = out.split('{{nome}}').join(name)
  out = out.split('{{empresa}}').join(empresa)
  out = out.split('{{imagem}}').join(imagem)

  if (imageUrl && !template.includes('{{imagem}}')) {
    out = `${out}\n${imageUrl}`
  }
  return out
}

function extractErr(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const detail = (e.response?.data as { detail?: string } | undefined)?.detail
    if (typeof detail === 'string') return detail
    return e.message || fallback
  }
  return e instanceof Error ? e.message : fallback
}
