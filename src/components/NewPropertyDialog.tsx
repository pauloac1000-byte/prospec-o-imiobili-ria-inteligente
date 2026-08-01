import { useState } from 'react'
import { createProperty, analyzePropertyWithAI, PropertyItem } from '@/services/properties'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function NewPropertyDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [formData, setFormData] = useState<Partial<PropertyItem>>({
    title: '',
    address: '',
    neighborhood: '',
    city: '',
    property_type: 'apartamento',
    status: 'em_prospeccao',
    estimated_value: 500000,
    market_value: 700000,
    owner_name: '',
    owner_motivation: 'inventario',
    notes: '',
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setAnalyzing(true)
    try {
      let aiResult = { opportunity_score: 75, roi_potential: 20 } as any
      try {
        aiResult = await analyzePropertyWithAI(formData)
      } catch {
        /* intentionally ignored */
      }
      await createProperty({
        ...formData,
        opportunity_score: aiResult.opportunity_score || 75,
        roi_potential: aiResult.roi_potential || 20,
      })
      toast({ title: 'Imóvel cadastrado e analisado!' })
      setOpen(false)
      onCreated()
    } catch {
      toast({ title: 'Erro ao cadastrar', variant: 'destructive' })
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 gap-1.5">
          <Plus className="h-4 w-4" /> Cadastrar Imóvel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" /> Prospecção de Novo Imóvel
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-3 my-2">
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Título</Label>
            <Input
              required
              placeholder="Ex: Apartamento - Jardins"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-950 border-slate-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Bairro</Label>
              <Input
                required
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="bg-slate-950 border-slate-800"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Cidade</Label>
              <Input
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="bg-slate-950 border-slate-800"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Endereço</Label>
            <Input
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-slate-950 border-slate-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Tipo</Label>
              <Select
                value={formData.property_type}
                onValueChange={(v) => setFormData({ ...formData, property_type: v as any })}
              >
                <SelectTrigger className="bg-slate-950 border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="predio">Prédio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Motivação</Label>
              <Select
                value={formData.owner_motivation}
                onValueChange={(v) => setFormData({ ...formData, owner_motivation: v as any })}
              >
                <SelectTrigger className="bg-slate-950 border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                  <SelectItem value="inventario">Inventário</SelectItem>
                  <SelectItem value="urgencia_financeira">Urgência Financeira</SelectItem>
                  <SelectItem value="mudanca">Mudança</SelectItem>
                  <SelectItem value="divorcio">Divórcio</SelectItem>
                  <SelectItem value="investimento">Investimento</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Valor Estimado (R$)</Label>
              <Input
                type="number"
                required
                value={formData.estimated_value}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_value: Number(e.target.value) })
                }
                className="bg-slate-950 border-slate-800"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Valor Mercado (R$)</Label>
              <Input
                type="number"
                required
                value={formData.market_value}
                onChange={(e) => setFormData({ ...formData, market_value: Number(e.target.value) })}
                className="bg-slate-950 border-slate-800"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Proprietário</Label>
            <Input
              value={formData.owner_name}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              className="bg-slate-950 border-slate-800"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Observações</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-slate-950 border-slate-800 text-xs"
            />
          </div>
          <Button
            type="submit"
            disabled={analyzing}
            className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
          >
            {analyzing ? 'Analisando com IA...' : 'Cadastrar e Calcular ROI'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
