'use client'

import { useEffect, useState } from 'react'
import { MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import axios from 'axios'
import { api } from '@/lib/api'
import type { ContactAddress } from '@/lib/types'
import { Button, Input } from '@/components/ds'

interface AddressDraft {
  label: string
  address: string
  is_default: boolean
}

const EMPTY_DRAFT: AddressDraft = { label: '', address: '', is_default: false }

export function ContactAddressesSection({ contactId }: { contactId: string }) {
  const [items, setItems] = useState<ContactAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [addingOpen, setAddingOpen] = useState(false)
  const [draft, setDraft] = useState<AddressDraft>(EMPTY_DRAFT)
  const [saving, setSaving] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<AddressDraft>(EMPTY_DRAFT)

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId])

  async function load() {
    setLoading(true)
    setErr(null)
    try {
      const res = await api.get<ContactAddress[]>(
        `/contacts/${contactId}/addresses`,
      )
      setItems(res.data)
    } catch (e: unknown) {
      setErr(extractErr(e, 'Falha ao carregar endereços'))
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    const address = draft.address.trim()
    if (!address) {
      setErr('Digite o endereço')
      return
    }
    setSaving(true)
    setErr(null)
    try {
      const res = await api.post<ContactAddress>(
        `/contacts/${contactId}/addresses`,
        {
          label: draft.label.trim() || null,
          address,
          is_default: draft.is_default,
        },
      )
      // se o novo entrou como padrão, desmarca os outros localmente
      setItems((cur) => {
        const next = draft.is_default
          ? cur.map((a) => ({ ...a, is_default: false }))
          : cur
        return sortAddresses([...next, res.data])
      })
      setDraft(EMPTY_DRAFT)
      setAddingOpen(false)
    } catch (e: unknown) {
      setErr(extractErr(e, 'Falha ao salvar endereço'))
    } finally {
      setSaving(false)
    }
  }

  function startEdit(addr: ContactAddress) {
    setEditingId(addr.id)
    setEditDraft({
      label: addr.label ?? '',
      address: addr.address,
      is_default: addr.is_default,
    })
  }

  async function handleSaveEdit(id: string) {
    const address = editDraft.address.trim()
    if (!address) {
      setErr('Digite o endereço')
      return
    }
    setSaving(true)
    setErr(null)
    try {
      const res = await api.patch<ContactAddress>(`/addresses/${id}`, {
        label: editDraft.label.trim() || null,
        address,
        is_default: editDraft.is_default,
      })
      setItems((cur) => {
        const next = editDraft.is_default
          ? cur.map((a) =>
              a.id === id ? res.data : { ...a, is_default: false },
            )
          : cur.map((a) => (a.id === id ? res.data : a))
        return sortAddresses(next)
      })
      setEditingId(null)
    } catch (e: unknown) {
      setErr(extractErr(e, 'Falha ao salvar endereço'))
    } finally {
      setSaving(false)
    }
  }

  async function handleSetDefault(id: string) {
    setErr(null)
    try {
      await api.patch(`/addresses/${id}`, { is_default: true })
      setItems((cur) =>
        sortAddresses(
          cur.map((a) => ({ ...a, is_default: a.id === id })),
        ),
      )
    } catch (e: unknown) {
      setErr(extractErr(e, 'Falha ao marcar como padrão'))
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Remover esse endereço?')) return
    try {
      await api.delete(`/addresses/${id}`)
      setItems((cur) => cur.filter((a) => a.id !== id))
    } catch (e: unknown) {
      setErr(extractErr(e, 'Falha ao remover'))
    }
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4 md:px-6">
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
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-md bg-[var(--surface-muted)]"
            />
          ))}
        </div>
      ) : items.length === 0 && !addingOpen ? (
        <div
          className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-[color:var(--border-subtle)] px-4 py-6 text-[color:var(--text-secondary)]"
          style={{ fontSize: 'var(--text-body-size)' }}
        >
          <MapPin size={20} strokeWidth={1.5} />
          <span>Nenhum endereço salvo.</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((a) =>
            editingId === a.id ? (
              <li
                key={a.id}
                className="rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-3"
              >
                <AddressForm
                  draft={editDraft}
                  setDraft={setEditDraft}
                  disabled={saving}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(null)}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleSaveEdit(a.id)}
                    disabled={saving}
                  >
                    {saving ? 'Salvando…' : 'Salvar'}
                  </Button>
                </div>
              </li>
            ) : (
              <li
                key={a.id}
                className="flex items-start gap-3 rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] px-3 py-2.5"
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
                    style={{
                      fontSize: 'var(--text-body-size)',
                      lineHeight: 'var(--text-body-lh)',
                    }}
                  >
                    {a.address}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!a.is_default ? (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(a.id)}
                      aria-label="Marcar como padrão"
                      className="rounded p-1.5 text-[color:var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-primary"
                    >
                      <Star size={16} strokeWidth={1.75} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => startEdit(a)}
                    aria-label="Editar endereço"
                    className="rounded p-1.5 text-[color:var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[color:var(--text-primary)]"
                  >
                    <Pencil size={16} strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    aria-label="Remover endereço"
                    className="rounded p-1.5 text-[color:var(--text-secondary)] hover:bg-[var(--negative-tint)] hover:text-[color:var(--negative)]"
                  >
                    <Trash2 size={16} strokeWidth={1.75} />
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}

      {addingOpen ? (
        <div className="rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-3">
          <AddressForm draft={draft} setDraft={setDraft} disabled={saving} />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setAddingOpen(false)
                setDraft(EMPTY_DRAFT)
              }}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={saving}
            >
              {saving ? 'Salvando…' : 'Adicionar'}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          iconLeft={<Plus size={16} strokeWidth={1.75} />}
          onClick={() => setAddingOpen(true)}
          className="self-start"
        >
          Adicionar endereço
        </Button>
      )}
    </div>
  )
}

export function AddressForm({
  draft,
  setDraft,
  disabled,
}: {
  draft: AddressDraft
  setDraft: (d: AddressDraft) => void
  disabled?: boolean
}) {
  return (
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
          onChange={(e) => setDraft({ ...draft, label: e.target.value })}
          placeholder="Ex.: Loja centro"
          disabled={disabled}
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
          onChange={(e) => setDraft({ ...draft, address: e.target.value })}
          rows={2}
          disabled={disabled}
          placeholder="Rua, número, bairro — cidade/UF"
          className="w-full resize-none rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-card)] p-2.5 font-sans text-base text-[color:var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-fast ease-standard placeholder:text-[color:var(--text-hint)] focus:border-primary focus:shadow-focus disabled:opacity-60 md:text-sm"
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2 self-start">
        <input
          type="checkbox"
          checked={draft.is_default}
          disabled={disabled}
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
  )
}

function sortAddresses(list: ContactAddress[]): ContactAddress[] {
  return [...list].sort((a, b) => {
    if (a.is_default && !b.is_default) return -1
    if (!a.is_default && b.is_default) return 1
    return a.created_at.localeCompare(b.created_at)
  })
}

function extractErr(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const detail = e.response?.data?.detail
    if (typeof detail === 'string') return detail
  }
  return e instanceof Error ? e.message : fallback
}

