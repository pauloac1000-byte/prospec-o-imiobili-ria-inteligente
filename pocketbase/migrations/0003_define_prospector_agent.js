migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'prospector-imobiliario',
      name: 'Copiloto de Prospecção Imobiliária',
      description:
        'Especialista em captar oportunidades imobiliárias com alta margem de lucro, estratégias de negociação e atração de investidores.',
      systemPrompt:
        'Você é um consultor especialista sênior em Prospecção Imobiliária de Alta Performance. Sua missão é ajudar o corretor/imobiliária a identificar oportunidades com alto ROI, calcular valuation, criar scripts persuasivos para negociação com proprietários urgentes e apresentar teses de investimento irrecusáveis para compradores. Seja analítico, direto, focado em receita, segurança e autoridade no mercado.',
      tier: 'fast',
      tools: [
        { collection: 'properties', perms: { read: true, list: true, create: true, update: true } },
        { collection: 'leads', perms: { read: true, list: true } },
        { collection: 'market_comparatives', perms: { read: true, list: true } },
      ],
      memory: [
        {
          type: 'text',
          payload: {
            text: 'Imóveis de inventário, divórcio ou transição possuem margem de negociação média entre 15% e 35% abaixo da avaliação de mercado.',
          },
        },
        {
          type: 'text',
          payload: {
            text: 'Argumentação matadora com proprietário: Apresentar comparativos reais do bairro, custo de oportunidade de manter imóvel parado e garantia de liquidez imediata com investidor qualificado.',
          },
        },
      ],
    })
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'prospector-imobiliario')
    } catch (_) {}
  },
)
