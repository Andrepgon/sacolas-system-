import type { OrderStatus } from '@/components/ds'

export const STATUS_LABELS: Record<OrderStatus, string> = {
  quote: 'Orçamento',
  confirmed: 'Confirmado',
  vector_pending: 'Aguardando vetor',
  factory_pending: 'Na fábrica',
  printing: 'Em impressão',
  ready_to_deliver: 'Pronto p/ entregar',
  delivered: 'Entregue',
  paid: 'Pago',
  cancelled: 'Cancelado',
}

export const STATUS_ORDER: OrderStatus[] = [
  'quote',
  'confirmed',
  'vector_pending',
  'factory_pending',
  'printing',
  'ready_to_deliver',
  'delivered',
  'paid',
  'cancelled',
]

export const BOARD_STATUS_ORDER: OrderStatus[] = [
  'quote',
  'confirmed',
  'vector_pending',
  'factory_pending',
  'printing',
  'ready_to_deliver',
  'delivered',
  'paid',
]

export function formatBRL(v: number): string {
  return `R$ ${Number(v).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
