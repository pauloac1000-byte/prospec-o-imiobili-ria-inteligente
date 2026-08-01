import { useEffect, useState } from 'react'
import { getProperties, PropertyItem } from '@/services/properties'
import { getLeads, LeadItem } from '@/services/leads'
import { PropertyCard } from '@/components/PropertyCard'
import { PropertyModal } from '@/components/PropertyModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  Sparkles,
  Plus,
  ShieldCheck,
  ArrowRight,
  Award,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [leads, setLeads] = useState<LeadItem[]>([])
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null)
  const [modalOpen, setOpenModal] = useState(false)

  const loadData = async () => {
    try {
      const [propsData, leadsData] = await Promise.all([getProperties(), getLeads()])
      setProperties(propsData)
      setLeads(leadsData)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('properties', () => loadData())
  useRealtime('leads', () => loadData())

  const totalPotentialValue = properties.reduce(
    (acc, p) => acc + (p.market_value - p.estimated_value),
    0,
  )
  const avgOpportunityScore = properties.length
    ? Math.round(
        properties.reduce((acc, p) => acc + (p.opportunity_score || 0), 0) / properties.length,
      )
    : 0

  const hotProperties = properties.filter((p) => p.opportunity_score >= 80)

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Painel Executivo de Prospecção
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Identifique oportunidades com alto ROI, capte leads qualificados e supere a
            concorrência.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/properties">
            <Button className="bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 gap-1.5 shadow-md">
              <Plus className="h-4 w-4" /> Nova Prospecção
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Potencial de Margem
              </p>
              <h3 className="text-xl font-bold text-emerald-400 mt-0.5">
                R$ {totalPotentialValue.toLocaleString('pt-BR')}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Lucro potencial mapeado</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Média Score IA
              </p>
              <h3 className="text-xl font-bold text-amber-400 mt-0.5">
                {avgOpportunityScore}{' '}
                <span className="text-xs text-slate-500 font-normal">/100</span>
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Qualidade das oportunidades</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Imóveis em Mapeamento
              </p>
              <h3 className="text-xl font-bold text-white mt-0.5">{properties.length}</h3>
              <p className="text-[10px] text-amber-400 mt-1">
                {hotProperties.length} em nível prioritário
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Leads Qualificados
              </p>
              <h3 className="text-xl font-bold text-purple-400 mt-0.5">{leads.length}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Investidores e Compradores</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Oportunidades Prioritárias (Alta Rentabilidade)
            </h2>
            <Link
              to="/properties"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              Ver todas ({properties.length}) <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotProperties.slice(0, 4).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(p) => {
                  setSelectedProperty(p)
                  setOpenModal(true)
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            Autoridade & Concorrência
          </h2>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 text-slate-100 shadow-md">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm text-slate-200 font-semibold flex items-center justify-between">
                <span>Índice de Influência Regional</span>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Top 5%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Você possui exclusividade em <strong>3 das melhores oportunidades</strong> dos
                bairros Jardins e Barra.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="text-amber-400 font-bold">Diferencial Inovador Ativo:</div>
                <div className="text-slate-300">
                  Matching instantâneo com IA entre teses de investidores e motivações de vendedores
                  urgentes.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-slate-100">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200">
                Últimos Leads Captados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              {leads.slice(0, 3).map((lead) => (
                <div
                  key={lead.id}
                  className="p-2.5 bg-slate-950 rounded border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{lead.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {lead.lead_type.toUpperCase()} • Orçamento: R${' '}
                      {(lead.budget || 0).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
                    {lead.status}
                  </Badge>
                </div>
              ))}
              <Link to="/leads">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-slate-400 hover:text-white mt-2"
                >
                  Ver CRM Completo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <PropertyModal property={selectedProperty} open={modalOpen} onOpenChange={setOpenModal} />
    </div>
  )
}
