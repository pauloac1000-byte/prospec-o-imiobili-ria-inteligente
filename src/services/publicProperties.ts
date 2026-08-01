import pb from '@/lib/pocketbase/client'

export const createPublicProperty = (data: Record<string, unknown>) =>
  pb.send('/backend/v1/public/properties', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
