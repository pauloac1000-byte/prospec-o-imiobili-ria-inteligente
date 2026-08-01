import { useState, useEffect } from 'react'
import { getMarketComparatives, MarketComparativeItem } from '@/services/market'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Radar, TrendingUp, ShieldCheck, Zap, Award } from 'lucide-react'

export default function MarketRadar() {
  const [comparatives, setComparatives] = useState<MarketComparativeItem[]>([])

  useEffect(() => {
    getMarketComparatives().then(setComparatives).catch(console.error)
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Radar className="h-6 w-6 text-amber-400" />
          Radar de Mercado & Análise da Concorrência
        </h1>
        <p className="text-xs text-slate-400">
          Dados de preço médio por m², tempo médio de venda e nível de liquidez por bairro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparatives.map((comp) => (
          <Card key={comp.id} className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-white">
                  {comp.neighborhood}
                </CardTitle>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                  Demanda {comp.demand_level.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">{comp.city}</p>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Preço Médio m²
                  </span>
                  <span className="font-bold text-amber-400">
                    R$ {(comp.avg_m2_price || 0).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Dias em Mercado
                  </span>
                  <span className="font-bold text-slate-200">{comp.avg_days_on_market} dias</span>
                </div>
              </div>

              {comp.appreciation_trend && (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/20 p-2 rounded border border-emerald-800/30">
                  <TrendingUp className="h-4 w-4" />
                  <span>Valorização: {comp.appreciation_trend}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-slate-900 to-slate-950 border-slate-800 text-slate-100 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
              Estratégia de Superação
            </Badge>
            <h3 className="text-lg font-bold text-white">
              Como Dominar a Região sem Disputar Comissão Baixa
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Enquanto a concorrência foca apenas em colocar placas, nosso sistema identifica a
              motivação real do proprietário para garantir **exclusividade com desconto para
              investidores qualificados**.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
            <ShieldCheck className="h-8 w-8 text-amber-400" />
            <div>
              <div className="text-xs font-bold text-white">Garantia de Autoridade</div>
              <div className="text-[11px] text-slate-400">Modelos de laudos com avaliação IA</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
