// Admin hooks for user management: resetting password and setting attributes
routerAdd('POST', '/backend/v1/admin/users/reset-password', (e) => {
  const auth = e.auth
  if (!auth) {
    throw new ForbiddenError('Não autenticado')
  }

  const role = auth.getString('role')
  if (role !== 'admin') {
    throw new ForbiddenError('Apenas administradores podem executar esta ação')
  }

  const body = e.requestInfo().body || {}
  const userId = String(body.userId || '').trim()
  const newPassword = String(body.newPassword || '').trim()

  if (!userId) {
    throw new BadRequestError('ID do usuário é obrigatório')
  }
  if (!newPassword || newPassword.length < 8) {
    throw new BadRequestError('A nova senha deve ter no mínimo 8 caracteres')
  }

  let userRecord
  try {
    userRecord = $app.findRecordById('users', userId)
  } catch (_) {
    throw new NotFoundError('Usuário não encontrado')
  }

  userRecord.setPassword(newPassword)
  $app.save(userRecord)

  return e.json(200, { success: true, message: 'Senha redefinida com sucesso' })
})
