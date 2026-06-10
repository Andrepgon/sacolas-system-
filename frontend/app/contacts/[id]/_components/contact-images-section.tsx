'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { ImageIcon, Trash2, Upload } from 'lucide-react'
import axios from 'axios'
import { api } from '@/lib/api'
import type { ContactMedia, ContactMediaKind } from '@/lib/types'
import { Button, Input, Select } from '@/components/ds'

const KIND_OPTIONS: { value: ContactMediaKind; label: string }[] = [
  { value: 'logo_vetor', label: 'Logo vetor' },
  { value: 'mockup', label: 'Mockup' },
  { value: 'outro', label: 'Outro' },
]

function kindLabel(k: ContactMediaKind): string {
  return KIND_OPTIONS.find((o) => o.value === k)?.label ?? k
}

export function ContactImagesSection({ contactId }: { contactId: string }) {
  const [items, setItems] = useState<ContactMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [kind, setKind] = useState<ContactMediaKind>('outro')
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId])

  async function load() {
    setLoading(true)
    setErr(null)
    try {
      const res = await api.get<ContactMedia[]>(`/contacts/${contactId}/media`)
      setItems(res.data)
    } catch (e: unknown) {
      setErr(extractErr(e, 'Falha ao carregar imagens'))
    } finally {
      setLoading(false)
    }
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setErr(null)
    try {
      const res = await api.postForm<ContactMedia>(
        `/contacts/${contactId}/media`,
        {
          file,
          kind,
          ...(caption ? { caption } : {}),
        },
      )
      setItems((cur) => [res.data, ...cur])
      setCaption('')
    } catch (e: unknown) {
      setErr(extractErr(e, 'Falha no upload'))
    } finally {
      setUploading(false)
      // permite reupload do mesmo arquivo
      e.target.value = ''
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Remover essa imagem?')) return
    try {
      await api.delete(`/media/${id}`)
      setItems((cur) => cur.filter((m) => m.id !== id))
    } catch (e: unknown) {
      setErr(extractErr(e, 'Falha ao remover'))
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            className="mb-1 block text-[color:var(--text-secondary)]"
            style={{ fontSize: '12px' }}
          >
            Tipo
          </label>
          <Select
            value={kind}
            onChange={(e) => setKind(e.target.value as ContactMediaKind)}
            options={KIND_OPTIONS}
          />
        </div>
        <div className="flex-1">
          <label
            className="mb-1 block text-[color:var(--text-secondary)]"
            style={{ fontSize: '12px' }}
          >
            Legenda (opcional)
          </label>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Ex: logo vetorizada final"
          />
        </div>
        <div className="sm:self-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFile}
          />
          <Button
            variant="primary"
            iconLeft={<Upload size={16} strokeWidth={1.75} />}
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Enviando…' : 'Enviar imagem'}
          </Button>
        </div>
      </div>

      {err ? (
        <div
          className="rounded-lg border bg-[var(--negative-tint)] px-3 py-2"
          style={{
            borderColor: 'var(--negative)',
            color: 'var(--negative)',
            fontSize: '13px',
          }}
        >
          {err}
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-md bg-[var(--surface-muted)]"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-[color:var(--border-subtle)] px-4 py-8 text-[color:var(--text-secondary)]"
          style={{ fontSize: 'var(--text-body-size)' }}
        >
          <ImageIcon size={24} strokeWidth={1.5} />
          <span>Nenhuma imagem ainda.</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {items.map((m) => (
            <MediaTile key={m.id} media={m} onDelete={() => handleDelete(m.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function MediaTile({
  media,
  onDelete,
}: {
  media: ContactMedia
  onDelete: () => void
}) {
  return (
    <div className="group relative overflow-hidden rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-muted)]">
      <a
        href={media.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.url}
          alt={media.caption ?? kindLabel(media.kind)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </a>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
        <div className="min-w-0 flex-1">
          <div
            className="truncate text-white"
            style={{ fontSize: '11px', fontWeight: 500 }}
          >
            {kindLabel(media.kind)}
          </div>
          {media.caption ? (
            <div className="truncate text-white/80" style={{ fontSize: '11px' }}>
              {media.caption}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Remover imagem"
          className="shrink-0 rounded-full bg-white/90 p-1.5 text-[color:var(--negative)] hover:bg-white"
        >
          <Trash2 size={14} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}

function extractErr(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const detail = e.response?.data?.detail
    if (typeof detail === 'string') return detail
  }
  return e instanceof Error ? e.message : fallback
}
