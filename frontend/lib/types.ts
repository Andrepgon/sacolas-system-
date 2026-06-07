export interface Contact {
  id: string
  phone: string
  name: string
  business_name?: string
  segment?: string
  source: string
  status: 'lead' | 'customer' | 'inactive' | 'churned'
  tags: string[]
  has_vector_logo: boolean
  notes?: string
  first_order_at?: string
  last_order_at?: string
  last_contact_at?: string
  total_orders: number
  lifetime_value: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  contact_id: string
  quantity: number
  bag_model?: string
  bag_size?: string
  unit_price?: number
  total: number
  paid_amount: number
  status:
    | 'quote'
    | 'confirmed'
    | 'vector_pending'
    | 'factory_pending'
    | 'printing'
    | 'ready_to_deliver'
    | 'delivered'
    | 'paid'
    | 'cancelled'
  confirmed_at?: string
  delivered_at?: string
  paid_at?: string
  delivery_address?: string
  notes?: string
  created_at: string
  updated_at: string
  contact?: {
    name: string
    business_name?: string | null
  }
}
