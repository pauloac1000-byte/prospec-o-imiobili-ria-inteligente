import pb from '@/lib/pocketbase/client'

export interface LeadItem {
  id: string
  name: string
  email?: string
  phone?: string
  lead_type: 'comprador' | 'vendedor' | 'investidor' | 'proprietario'
  status: 'novo' | 'em_contato' | 'qualificado' | 'proposta' | 'fechado' | 'perdido'
  budget?: number
  preferred_neighborhood?: string
  preferred_type?: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'predio'
  score?: number
  notes?: string
  created?: string
  updated?: string
}

export const getLeads = () => pb.collection('leads').getFullList<LeadItem>({ sort: '-created' })

export const getLead = (id: string) => pb.collection('leads').getOne<LeadItem>(id)

export const createLead = (data: Partial<LeadItem>) =>
  pb.collection('leads').create<LeadItem>({ ...data, user: pb.authStore.record?.id })

export const updateLead = (id: string, data: Partial<LeadItem>) =>
  pb.collection('leads').update<LeadItem>(id, data)

export const deleteLead = (id: string) => pb.collection('leads').delete(id)

export const createPublicLead = (data: Partial<LeadItem>) =>
  pb.send('/backend/v1/public/leads', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
