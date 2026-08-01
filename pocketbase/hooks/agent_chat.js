routerAdd(
  'POST',
  '/backend/v1/agent-chat',
  (e) => {
    const body = e.requestInfo().body || {}
    const userId = e.auth?.id

    if (!userId) return e.unauthorizedError('Autenticação necessária')
    if (!body.message?.trim()) return e.badRequestError('Mensagem é obrigatória')

    try {
      const result = $ai.agent('prospector-imobiliario').chat({
        user_id: userId,
        conversation_id: body.conversation_id || null,
        message: body.message,
      })

      return e.json(200, {
        conversation_id: result.conversation_id,
        content: result.content,
        citations: result.citations || [],
        message_id: result.message_id,
      })
    } catch (err) {
      return e.json(500, { error: err.message || 'Erro no processamento da IA' })
    }
  },
  $apis.requireAuth(),
)
