import { useState } from 'react'
import { PropertyItem, generateNegotiationPitch } from '@/services/properties'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  User,
  Copy,
  Check,
  MessageSquare,
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface PropertyModalProps {
  property: PropertyItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PropertyModal({ property, open, onOpenChange }: PropertyModalProps) {
  const [pitch, setPitch] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!property) return null

  const handleGeneratePitch = async (target: 'owner' | 'investor') => {
    setGenerating(true)
    try {
      const res = await generateNegotiationPitch({
        propertyTitle: property.title,
        ownerName: property.owner_name,
        motivation: property.owner_motivation,
        estimatedValue: property.estimated_value,
        marketValue: property.market_value,
        targetAudience: target,
      })
      setPitch(res.pitch || '')
      toast({ title: 'Script IA gerado com sucesso!' })
    } catch (err) {
      toast({ title: 'Erro ao gerar abordagem.', variant: 'destructive' })
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(pitch)
    setCopied(true)
    toast({ title: 'Script copiado para a área de transferência!' })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-semibold">
              Score Oportunidade: {property.opportunity_score}/100
            </Badge>
            <Badge variant="outline" className="text-slate-400 border-slate-700">
              {property.property_type.toUpperCase()}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-white">{property.title}</DialogTitle>
          <DialogDescription className="text-slate-400 flex items-center gap-1.5 text-xs">
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            {property.address} - {property.neighborhood}, {property.city}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-2">
          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-500 uppercase block font-semibold">
                Valor Proposto
              </span>
              <span className="text-base font-bold text-slate-200">
                R$ {(property.estimated_value || 0).toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase block font-semibold">
                Avaliação Real
              </span>
              <span className="text-base font-bold text-emerald-400">
                R$ {(property.market_value || 0).toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase block font-semibold">
                ROI Estimado
              </span>
              <span className="text-base font-bold text-amber-400">
                +{property.roi_potential || 0}%
              </span>
            </div>
          </div>

          <Tabs defaultValue="detalhes" className="w-full">
            <TabsList className="bg-slate-950 border border-slate-800 w-full justify-start">
              <TabsTrigger
                value="detalhes"
                className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400"
              >
                Detalhes & Proprietário
              </TabsTrigger>
              <TabsTrigger
                value="pitch"
                className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Gerador de Script IA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="detalhes" className="space-y-4 pt-3">
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-2">
                <h4 className="text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <User className="h-4 w-4" /> Dados do Proprietário
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                  <div>
                    <strong>Nome:</strong> {property.owner_name || 'Não informado'}
                  </div>
                  <div>
                    <strong>Telefone:</strong> {property.owner_phone || 'Não informado'}
                  </div>
                  <div>
                    <strong>E-mail:</strong> {property.owner_email || 'Não informado'}
                  </div>
                  <div>
                    <strong>Motivação:</strong>{' '}
                    {property.owner_motivation?.replace('_', ' ') || 'Não especificada'}
                  </div>
                </div>
              </div>

              {property.notes && (
                <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-1">
                  <h4 className="text-xs uppercase font-bold text-slate-400">
                    Observações de Campo
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{property.notes}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pitch" className="space-y-4 pt-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleGeneratePitch('owner')}
                  disabled={generating}
                  className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold gap-1.5 text-xs"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Abordagem ao Proprietário
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGeneratePitch('investor')}
                  disabled={generating}
                  className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs gap-1.5"
                >
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Tese para Investidor
                </Button>
              </div>

              {generating && (
                <div className="text-center py-6 text-slate-400 text-sm animate-pulse">
                  Criando script personalizado com IA...
                </div>
              )}

              {pitch && (
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">
                      Script Prontos para Uso
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopy}
                      className="text-xs text-slate-300 hover:text-white gap-1"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-900/80 p-3 rounded border border-slate-800">
                    {pitch}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
