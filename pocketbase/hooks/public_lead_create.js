routerAdd('POST', '/backend/v1/public/leads', (e) => {
  const body = e.requestInfo().body || {}

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const phone = String(body.phone || '').trim()

  const fieldErrors = {}
  if (!name) fieldErrors['name'] = 'Nome é obrigatório'
  if (!email) {
    fieldErrors['email'] = 'E-mail é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors['email'] = 'E-mail inválido'
  }
  if (!phone) fieldErrors['phone'] = 'Telefone é obrigatório'

  if (Object.keys(fieldErrors).length > 0) {
    throw new BadRequestError('Dados inválidos', fieldErrors)
  }

  const validLeadTypes = ['comprador', 'vendedor', 'investidor', 'proprietario']
  const validPreferredTypes = ['casa', 'apartamento', 'terreno', 'comercial', 'predio']

  const collection = $app.findCollectionByNameOrId('leads')
  const record = new Record(collection)
  record.set('name', name)
  record.set('email', email)
  record.set('phone', phone)
  record.set('lead_type', validLeadTypes.includes(body.lead_type) ? body.lead_type : 'comprador')
  record.set('status', 'novo')
  record.set('score', 0)

  if (body.budget != null && body.budget !== '') {
    const budgetNum = Number(body.budget)
    if (Number.isFinite(budgetNum)) record.set('budget', budgetNum)
  }
  if (body.preferred_neighborhood) {
    record.set('preferred_neighborhood', String(body.preferred_neighborhood).trim())
  }
  if (validPreferredTypes.includes(body.preferred_type)) {
    record.set('preferred_type', body.preferred_type)
  }
  if (body.notes) {
    record.set('notes', String(body.notes).trim())
  }

  $app.save(record)

  return e.json(201, { success: true, message: 'Lead criado com sucesso' })
})
