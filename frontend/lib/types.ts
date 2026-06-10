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
  last_campaign_at?: string | null
  opt_out?: boolean
  opt_out_at?: string | null
  total_orders: number
  lifetime_value: number
  created_at: string
  updated_at: string
}

export type ContactMediaKind = 'logo_vetor' | 'mockup' | 'outro'

export interface ContactMedia {
  id: string
  contact_id: string
  url: string
  storage_path?: string | null
  kind: ContactMediaKind
  caption?: string | null
  created_at: string
}

export interface ContactAddress {
  id: string
  contact_id: string
  label?: string | null
  address: string
  lat?: number | null
  lng?: number | null
  is_default: boolean
  created_at: string
}

export type CampaignStatus =
  | 'draft'
  | 'ready'
  | 'sending'
  | 'done'
  | 'archived'

export interface Campaign {
  id: string
  title: string
  message_template: string
  image_url?: string | null
  image_storage_path?: string | null
  status: CampaignStatus
  total_recipients: number
  sent_count: number
  skipped_count: number
  created_at: string
  updated_at: string
}

export type CampaignSendStatus = 'pending' | 'sent' | 'skipped'

export interface CampaignSend {
  id: string
  campaign_id: string
  contact_id: string
  phone: string
  rendered_message: string
  status: CampaignSendStatus
  sent_at?: string | null
  position: number
  contact?: {
    name: string
    business_name?: string | null
  }
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
    | 'signal_paid'
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
  delivery_address_id?: string | null
  notes?: string
  created_at: string
  updated_at: string
  contact?: {
    name: string
    business_name?: string | null
  }
}
