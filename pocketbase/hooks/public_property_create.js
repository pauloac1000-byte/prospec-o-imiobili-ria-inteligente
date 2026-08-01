routerAdd('POST', '/backend/v1/public/properties', (e) => {
  const body = e.requestInfo().body || {}

  const ownerName = String(body.owner_name || '').trim()
  const ownerPhone = String(body.owner_phone || '').trim()
  const ownerEmail = String(body.owner_email || '').trim()
  const title = String(body.title || '').trim()
  const address = String(body.address || '').trim()
  const neighborhood = String(body.neighborhood || '').trim()
  const city = String(body.city || '').trim()
  const estimatedValue = Number(body.estimated_value) || 0

  const fieldErrors = {}
  if (!ownerName) fieldErrors['owner_name'] = 'Nome do proprietário é obrigatório'
  if (!ownerPhone) fieldErrors['owner_phone'] = 'Telefone é obrigatório'
  if (!ownerEmail) {
    fieldErrors['owner_email'] = 'E-mail é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) {
    fieldErrors['owner_email'] = 'E-mail inválido'
  }
  if (!title) fieldErrors['title'] = 'Título é obrigatório'
  if (!address) fieldErrors['address'] = 'Endereço é obrigatório'
  if (!neighborhood) fieldErrors['neighborhood'] = 'Bairro é obrigatório'
  if (!city) fieldErrors['city'] = 'Cidade é obrigatória'
  if (!estimatedValue || estimatedValue <= 0)
    fieldErrors['estimated_value'] = 'Valor estimado é obrigatório'

  const validTypes = ['casa', 'apartamento', 'terreno', 'comercial', 'predio']
  if (!validTypes.includes(body.property_type))
    fieldErrors['property_type'] = 'Tipo de imóvel inválido'

  const validMotivations = [
    'inventario',
    'divorcio',
    'urgencia_financeira',
    'mudanca',
    'investimento',
    'outro',
  ]
  if (!validMotivations.includes(body.owner_motivation))
    fieldErrors['owner_motivation'] = 'Motivação inválida'

  if (Object.keys(fieldErrors).length > 0) {
    throw new BadRequestError('Dados inválidos', fieldErrors)
  }

  const marketValue = Math.round(estimatedValue * 1.3)
  const diff = marketValue - estimatedValue
  const roiPotential = Math.round((diff / estimatedValue) * 100 * 10) / 10

  let baseScore = 50
  if (roiPotential > 30) baseScore += 30
  else if (roiPotential > 15) baseScore += 20
  else if (roiPotential > 5) baseScore += 10
  if (body.owner_motivation === 'inventario' || body.owner_motivation === 'urgencia_financeira')
    baseScore += 15
  if (body.owner_motivation === 'mudanca' || body.owner_motivation === 'divorcio') baseScore += 10
  const opportunityScore = Math.min(Math.max(baseScore, 10), 99)

  let aiAnalysis = null
  try {
    const prompt =
      'Analise esta oportunidade imobiliária:\n' +
      '- Imóvel: ' +
      title +
      ' (' +
      body.property_type +
      ') em ' +
      neighborhood +
      ', ' +
      city +
      '\n' +
      '- Endereço: ' +
      address +
      '\n' +
      '- Valor Estimado: R$ ' +
      estimatedValue +
      '\n' +
      '- Motivação: ' +
      body.owner_motivation +
      '\n' +
      'Forneça: 1. Análise de atratividade; 2. Pontos críticos; 3. Recomendação estratégica.'
    const chatRes = $ai.chat({ model: 'fast', messages: [{ role: 'user', content: prompt }] })
    aiAnalysis = {
      summary: chatRes.choices[0]?.message?.content || '',
      opportunity_score: opportunityScore,
      roi_potential: roiPotential,
      market_value_estimate: marketValue,
      generated_at: new Date().toISOString(),
    }
  } catch (err) {
    aiAnalysis = {
      summary: 'Análise indisponível. Imóvel com potencial de retorno.',
      opportunity_score: opportunityScore,
      roi_potential: roiPotential,
      market_value_estimate: marketValue,
      generated_at: new Date().toISOString(),
    }
  }

  const collection = $app.findCollectionByNameOrId('properties')
  const record = new Record(collection)
  record.set('title', title)
  record.set('address', address)
  record.set('neighborhood', neighborhood)
  record.set('city', city)
  record.set('property_type', body.property_type)
  record.set('status', 'em_prospeccao')
  record.set('estimated_value', estimatedValue)
  record.set('market_value', marketValue)
  record.set('opportunity_score', opportunityScore)
  record.set('roi_potential', roiPotential)
  record.set('owner_name', ownerName)
  record.set('owner_phone', ownerPhone)
  record.set('owner_email', ownerEmail)
  record.set('owner_motivation', body.owner_motivation)
  if (body.notes) record.set('notes', String(body.notes).trim())
  record.set('ai_analysis', aiAnalysis)

  $app.save(record)

  return e.json(201, { success: true, message: 'Imóvel cadastrado com sucesso' })
})
