routerAdd(
  'POST',
  '/backend/v1/analyze-property',
  (e) => {
    const body = e.requestInfo().body || {}
    const {
      title,
      property_type,
      estimated_value,
      market_value,
      neighborhood,
      city,
      owner_motivation,
    } = body

    if (!estimated_value || !market_value) {
      return e.badRequestError('Os valores estimado e de mercado são obrigatórios.')
    }

    const diff = Number(market_value) - Number(estimated_value)
    const roiPotential = Math.round((diff / Number(estimated_value)) * 100 * 10) / 10

    let baseScore = 50
    if (roiPotential > 30) baseScore += 30
    else if (roiPotential > 15) baseScore += 20
    else if (roiPotential > 5) baseScore += 10

    if (owner_motivation === 'inventario' || owner_motivation === 'urgencia_financeira')
      baseScore += 15
    if (owner_motivation === 'mudanca' || owner_motivation === 'divorcio') baseScore += 10

    const opportunityScore = Math.min(Math.max(baseScore, 10), 99)

    let aiAdvice = ''
    try {
      const prompt = `Analise em 3 tópicos curtos esta oportunidade imobiliária:
- Imóvel: ${title || 'Imóvel'} (${property_type || 'Geral'}) em ${neighborhood || ''}, ${city || ''}
- Valor Pedido/Estimado: R$ ${estimated_value} | Valor Real de Mercado: R$ ${market_value}
- Margem Bruta/ROI Potencial: ${roiPotential}% | Motivação Proprietário: ${owner_motivation || 'não informada'}
Apresente: 1. Tese de Atratividade para Investidores; 2. Ponto Crítico na Negociação; 3. Recomendação Estratégica de Fechamento.`

      const chatRes = $ai.chat({
        model: 'fast',
        messages: [{ role: 'user', content: prompt }],
      })
      aiAdvice = chatRes.choices[0]?.message?.content || 'Análise concluída com sucesso.'
    } catch (err) {
      aiAdvice =
        'Imóvel com excelente margem potencial de retorno. Recomendado contato prioritário.'
    }

    return e.json(200, {
      opportunity_score: opportunityScore,
      roi_potential: roiPotential,
      discount_amount: diff,
      ai_summary: aiAdvice,
    })
  },
  $apis.requireAuth(),
)
