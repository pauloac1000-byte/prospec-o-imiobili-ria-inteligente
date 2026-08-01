import { PropertyItem } from '@/services/properties'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Building2, MapPin, TrendingUp, Sparkles, PhoneCall, ArrowUpRight } from 'lucide-react'

interface PropertyCardProps {
  property: PropertyItem
  onSelect: (p: PropertyItem) => void
}

export function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const statusLabels: Record<string, { label: string; class: string }> = {
    em_prospeccao: {
      label: 'Em Prospeccao',
      class: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    avaliacao: {
      label: 'Avaliação IA',
      class: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    em_negociacao: {
      label: 'Em Negociação',
      class: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    captado: {
      label: 'Captado Exclusivo',
      class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    vendido: { label: 'Vendido', class: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    descartado: { label: 'Descartado', class: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  }

  const status = statusLabels[property.status] || {
    label: property.status,
    class: 'bg-slate-800 text-slate-300',
  }

  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-100 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg group">
      <CardHeader className="p-4 pb-3 space-y-2 relative">
        <div className="flex items-start justify-between gap-2">
          <Badge className={`border text-[11px] font-medium px-2 py-0.5 ${status.class}`}>
            {status.label}
          </Badge>
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-full border border-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">
              {property.opportunity_score || 0}
            </span>
            <span className="text-[10px] text-slate-500">/100</span>
          </div>
        </div>

        <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">
            {property.neighborhood}, {property.city}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Valor Estimado
            </span>
            <span className="text-sm font-bold text-slate-200">
              R$ {(property.estimated_value || 0).toLocaleString('pt-BR')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Avaliação Mercado
            </span>
            <span className="text-sm font-bold text-emerald-400">
              R$ {(property.market_value || 0).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-400 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" /> ROI Estimado:
          </span>
          <span className="font-bold text-amber-400 text-sm">+{property.roi_potential || 0}%</span>
        </div>

        {property.owner_motivation && (
          <div className="text-[11px] text-slate-400 bg-slate-800/40 p-2 rounded border border-slate-800/50">
            <strong className="text-slate-300">Motivação:</strong>{' '}
            {property.owner_motivation.replace('_', ' ')}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect(property)}
          className="w-full bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white font-medium text-xs gap-1.5"
        >
          <span>Análise Completa</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
