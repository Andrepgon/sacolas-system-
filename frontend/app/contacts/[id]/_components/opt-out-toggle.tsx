'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { BellOff } from 'lucide-react'

import { api } from '@/lib/api'
import type { Contact } from '@/lib/types'

interface OptOutToggleProps {
  contact: Contact
  onChange?: (next: Contact) => void
}

export function OptOutToggle({ contact, onChange }: OptOutToggleProps) {
  const [optOut, setOptOut] = useState<boolean>(!!contact.opt_out)
  const [saving, setSaving] = useState(false)

  async function toggle() {
    if (saving) return
    const next = !optOut
    setSaving(true)
    setOptOut(next) // otimista
    try {
      const { data } = await api.patch<Contact>(`/contacts/${contact.id}`, {
        opt_out: next,
      })
      onChange?.(data)
      toast.success(
        next ? 'Contato marcado como "não perturbar"' : 'Opt-out removido',
      )
    } catch (e: unknown) {
      setOptOut(!next) // desfaz
      const msg = axios.isAxiosError(e)
        ? ((e.response?.data as { detail?: string } | undefined)?.detail ??
          e.message)
        : 'Falha ao salvar'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-4 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className="m-0 text-[color:var(--text-primary)]"
            style={{
              fontSize: 'var(--text-body-size)',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            Não perturbar (opt-out de campanhas)
          </p>
          <p
            className="m-0 mt-0.5 text-[color:var(--text-hint)]"
            style={{ fontSize: 'var(--text-hint-size)' }}
          >
            LGPD: respeite quem pediu pra não receber mensagens em massa.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={optOut}
          disabled={saving}
          onClick={toggle}
          className={
            optOut
              ? 'relative h-7 w-12 shrink-0 cursor-pointer rounded-full bg-primary transition-colors duration-fast ease-standard disabled:opacity-50'
              : 'relative h-7 w-12 shrink-0 cursor-pointer rounded-full bg-[var(--slate-300)] transition-colors duration-fast ease-standard disabled:opacity-50'
          }
        >
          <span
            className={
              optOut
                ? 'absolute top-1 left-6 h-5 w-5 rounded-full bg-white shadow-xs transition-[left] duration-fast ease-standard'
                : 'absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-xs transition-[left] duration-fast ease-standard'
            }
          />
        </button>
      </div>
      {optOut ? (
        <div
          className="flex items-start gap-2 rounded-md bg-[var(--slate-100)] px-3 py-2 text-[color:var(--slate-600)]"
          style={{ fontSize: 'var(--text-hint-size)' }}
        >
          <BellOff size={14} strokeWidth={1.75} className="mt-px shrink-0" />
          <span>
            Este contato não entra em nenhuma fila de campanha. Ele continua
            disponível pra conversas e pedidos normais.
          </span>
        </div>
      ) : null}
    </div>
  )
}
