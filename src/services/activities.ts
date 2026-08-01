import pb from '@/lib/pocketbase/client'

export interface ActivityItem {
  id: string
  title: string
  activity_type: 'ligacao' | 'visita' | 'reuniao' | 'proposta' | 'whatsapp' | 'analise'
  status: 'agendado' | 'concluido' | 'cancelado'
  due_date?: string
  description?: string
  property?: string
  lead?: string
  created?: string
}

export const getActivities = () =>
  pb.collection('prospecting_activities').getFullList<ActivityItem>({
    sort: '-created',
    expand: 'property,lead',
  })

export const createActivity = (data: Partial<ActivityItem>) =>
  pb.collection('prospecting_activities').create<ActivityItem>({
    ...data,
    user: pb.authStore.record?.id,
  })

export const updateActivity = (id: string, data: Partial<ActivityItem>) =>
  pb.collection('prospecting_activities').update<ActivityItem>(id, data)

export const deleteActivity = (id: string) => pb.collection('prospecting_activities').delete(id)
