import pb from '@/lib/pocketbase/client'

export const sendAgentChatMessage = (message: string, conversationId?: string) =>
  pb.send('/backend/v1/agent-chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversation_id: conversationId }),
    headers: { 'Content-Type': 'application/json' },
  })
