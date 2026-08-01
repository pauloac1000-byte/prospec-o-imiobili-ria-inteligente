import pb from '@/lib/pocketbase/client'

export interface PropertyItem {
  id: string
  title: string
  address: string
  neighborhood: string
  city: string
  property_type: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'predio'
  status: 'em_prospeccao' | 'avaliacao' | 'em_negociacao' | 'captado' | 'vendido' | 'descartado'
  estimated_value: number
  market_value: number
  opportunity_score: number
  roi_potential: number
  owner_name?: string
  owner_phone?: string
  owner_email?: string
  owner_motivation?: string
  notes?: string
  ai_analysis?: any
  created?: string
  updated?: string
}

export const getProperties = () =>
  pb.collection('properties').getFullList<PropertyItem>({ sort: '-created' })

export const getProperty = (id: string) => pb.collection('properties').getOne<PropertyItem>(id)

export const createProperty = (data: Partial<PropertyItem>) =>
  pb.collection('properties').create<PropertyItem>({ ...data, user: pb.authStore.record?.id })

export const updateProperty = (id: string, data: Partial<PropertyItem>) =>
  pb.collection('properties').update<PropertyItem>(id, data)

export const deleteProperty = (id: string) => pb.collection('properties').delete(id)

export const analyzePropertyWithAI = (data: Partial<PropertyItem>) =>
  pb.send('/backend/v1/analyze-property', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })

export const generateNegotiationPitch = (data: {
  propertyTitle: string
  ownerName?: string
  motivation?: string
  estimatedValue?: number
  marketValue?: number
  targetAudience: 'owner' | 'investor'
}) =>
  pb.send('/backend/v1/generate-pitch', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
