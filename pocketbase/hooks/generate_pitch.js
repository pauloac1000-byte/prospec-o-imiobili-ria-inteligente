routerAdd(
  'POST',
  '/backend/v1/generate-pitch',
  (e) => {
    const body = e.requestInfo().body || {}
    const { propertyTitle, ownerName, motivation, estimatedValue, marketValue, targetAudience } =
      body

    const prompt = `Crie um Script Profissional e Persuasivo de Comunicação para prospecção imobiliária:
- Tipo: ${targetAudience === 'investor' ? 'Apresentação de Imóvel Oportunidade para Investidor' : 'Abordagem ao Proprietário para Captação com Exclusividade'}
- Nome do Destinatário: ${ownerName || 'Cliente'}
- Imóvel: ${propertyTitle || 'Imóvel em Prospecção'}
- Motivação/Contexto: ${motivation || 'Oportunidade de Mercado'}
- Valor de Oportunidade: R$ ${estimatedValue || 0} (Avaliação: R$ ${marketValue || 0})

Gere um texto pronto para enviar via WhatsApp/E-mail com tom profissional, elegante e focado em gerar valor, confiança e urgência sem ser ostensivo.`

    try {
      const chatRes = $ai.chat({
        model: 'fast',
        messages: [{ role: 'user', content: prompt }],
      })

      return e.json(200, {
        pitch:
          chatRes.choices[0]?.message?.content || 'Não foi possível gerar a abordagem no momento.',
      })
    } catch (err) {
      return e.badRequestError('Falha ao gerar o script com IA.')
    }
  },
  $apis.requireAuth(),
)
