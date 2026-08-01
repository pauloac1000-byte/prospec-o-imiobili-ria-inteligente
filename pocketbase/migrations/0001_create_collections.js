migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    const properties = new Collection({
      name: 'properties',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'address', type: 'text', required: true },
        { name: 'neighborhood', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        {
          name: 'property_type',
          type: 'select',
          required: true,
          values: ['casa', 'apartamento', 'terreno', 'comercial', 'predio'],
          maxSelect: 1,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: [
            'em_prospeccao',
            'avaliacao',
            'em_negociacao',
            'captado',
            'vendido',
            'descartado',
          ],
          maxSelect: 1,
        },
        { name: 'estimated_value', type: 'number', min: 0 },
        { name: 'market_value', type: 'number', min: 0 },
        { name: 'opportunity_score', type: 'number', min: 0, max: 100 },
        { name: 'roi_potential', type: 'number', min: 0 },
        { name: 'owner_name', type: 'text' },
        { name: 'owner_phone', type: 'text' },
        { name: 'owner_email', type: 'email' },
        {
          name: 'owner_motivation',
          type: 'select',
          values: [
            'inventario',
            'divorcio',
            'urgencia_financeira',
            'mudanca',
            'investimento',
            'outro',
          ],
          maxSelect: 1,
        },
        { name: 'notes', type: 'text' },
        { name: 'ai_analysis', type: 'json' },
        {
          name: 'user',
          type: 'relation',
          collectionId: usersCol.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_properties_status ON properties (status)',
        'CREATE INDEX idx_properties_score ON properties (opportunity_score DESC)',
      ],
    })
    app.save(properties)

    const leads = new Collection({
      name: 'leads',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        {
          name: 'lead_type',
          type: 'select',
          required: true,
          values: ['comprador', 'vendedor', 'investidor', 'proprietario'],
          maxSelect: 1,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['novo', 'em_contato', 'qualificado', 'proposta', 'fechado', 'perdido'],
          maxSelect: 1,
        },
        { name: 'budget', type: 'number', min: 0 },
        { name: 'preferred_neighborhood', type: 'text' },
        {
          name: 'preferred_type',
          type: 'select',
          values: ['casa', 'apartamento', 'terreno', 'comercial', 'predio'],
          maxSelect: 1,
        },
        { name: 'score', type: 'number', min: 0, max: 100 },
        { name: 'notes', type: 'text' },
        {
          name: 'user',
          type: 'relation',
          collectionId: usersCol.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_leads_status ON leads (status)',
        'CREATE INDEX idx_leads_type ON leads (lead_type)',
      ],
    })
    app.save(leads)

    const activities = new Collection({
      name: 'prospecting_activities',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'activity_type',
          type: 'select',
          required: true,
          values: ['ligacao', 'visita', 'reuniao', 'proposta', 'whatsapp', 'analise'],
          maxSelect: 1,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['agendado', 'concluido', 'cancelado'],
          maxSelect: 1,
        },
        { name: 'due_date', type: 'date' },
        { name: 'description', type: 'text' },
        {
          name: 'property',
          type: 'relation',
          collectionId: properties.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        {
          name: 'lead',
          type: 'relation',
          collectionId: leads.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        {
          name: 'user',
          type: 'relation',
          collectionId: usersCol.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(activities)

    const marketComparatives = new Collection({
      name: 'market_comparatives',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'neighborhood', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'avg_m2_price', type: 'number', min: 0 },
        { name: 'avg_days_on_market', type: 'number', min: 0 },
        {
          name: 'demand_level',
          type: 'select',
          required: true,
          values: ['alta', 'media', 'baixa'],
          maxSelect: 1,
        },
        {
          name: 'competitor_density',
          type: 'select',
          values: ['alta', 'moderada', 'baixa'],
          maxSelect: 1,
        },
        { name: 'appreciation_trend', type: 'text' },
        {
          name: 'user',
          type: 'relation',
          collectionId: usersCol.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(marketComparatives)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('market_comparatives'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('prospecting_activities'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('leads'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('properties'))
    } catch (_) {}
  },
)
