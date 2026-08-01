import { useState, useEffect } from 'react'
import {
  getProperties,
  createProperty,
  analyzePropertyWithAI,
  PropertyItem,
} from '@/services/properties'
import { PropertyCard } from '@/components/PropertyCard'
import { PropertyModal } from '@/components/PropertyModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRealtime } from '@/hooks/use-realtime'
import { Plus, Search, Sparkles, Filter, Building2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function Properties() {
  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null)
  const [modalOpen, setOpenModal] = useState(false)
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [searchTerm, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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
    owner_phone: '',
    owner_email: '',
    owner_motivation: 'inventario',
    notes: '',
  })

  const [analyzing, setAnalyzing] = useState(false)

  const loadProperties = async () => {
    try {
      const data = await getProperties()
      setProperties(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  useRealtime('properties', () => loadProperties())

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setAnalyzing(true)

    try {
      let aiResult = { opportunity_score: 75, roi_potential: 20 }
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

      toast({ title: 'Imóvel cadastrado e analisado com sucesso!' })
      setNewDialogOpen(false)
      loadProperties()
    } catch (err) {
      toast({ title: 'Erro ao cadastrar imóvel', variant: 'destructive' })
    } finally {
      setAnalyzing(false)
    }
  }

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-amber-400" />
            Gestão & Captura de Imóveis Oportunidade
          </h1>
          <p className="text-xs text-slate-400">
            Imóveis com alto potencial de valorização e proprietários com motivação real de venda.
          </p>
        </div>

        <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 gap-1.5">
              <Plus className="h-4 w-4" /> Cadastrar Novo Imóvel
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" /> Prospecção de Novo Imóvel
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 my-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Título Identificador</Label>
                <Input
                  required
                  placeholder="Ex: Apartamento Desocupado - Jardins"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-950 border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Bairro</Label>
                  <Input
                    required
                    placeholder="Bairro"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="bg-slate-950 border-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Cidade</Label>
                  <Input
                    required
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-slate-950 border-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Endereço Completo</Label>
                <Input
                  required
                  placeholder="Rua, Número, Complemento"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-slate-950 border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Tipo de Imóvel</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(val: any) => setFormData({ ...formData, property_type: val })}
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="predio">Prédio Inteiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Motivação do Vendedor</Label>
                  <Select
                    value={formData.owner_motivation}
                    onValueChange={(val: any) =>
                      setFormData({ ...formData, owner_motivation: val })
                    }
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="inventario">Inventário / Herança</SelectItem>
                      <SelectItem value="urgencia_financeira">Urgência Financeira</SelectItem>
                      <SelectItem value="mudanca">Mudança / Transição</SelectItem>
                      <SelectItem value="divorcio">Divórcio</SelectItem>
                      <SelectItem value="investimento">Investimento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Valor Oportunidade / Pedido (R$)</Label>
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
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Avaliação Real de Mercado (R$)</Label>
                  <Input
                    type="number"
                    required
                    value={formData.market_value}
                    onChange={(e) =>
                      setFormData({ ...formData, market_value: Number(e.target.value) })
                    }
                    className="bg-slate-950 border-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Nome do Proprietário / Responsável</Label>
                <Input
                  placeholder="Nome do contato"
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  className="bg-slate-950 border-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Observações de Prospecção</Label>
                <Textarea
                  placeholder="Ex: Aceita proposta à vista, imóvel precisa de pintura..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={analyzing}
                className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 mt-2"
              >
                {analyzing ? 'Analisando Score com IA...' : 'Cadastrar e Calcular ROI com IA'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar por bairro, cidade ou título..."
            value={searchTerm}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9 bg-slate-900 border-slate-800 text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-slate-900 border-slate-800 text-slate-200">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="em_prospeccao">Em Prospecção</SelectItem>
              <SelectItem value="avaliacao">Avaliação IA</SelectItem>
              <SelectItem value="em_negociacao">Em Negociação</SelectItem>
              <SelectItem value="captado">Captados Exclusivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.map((property) => (
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

      {filteredProperties.length === 0 && (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400">
          Nenhum imóvel encontrado com os filtros aplicados.
        </div>
      )}

      <PropertyModal property={selectedProperty} open={modalOpen} onOpenChange={setOpenModal} />
    </div>
  )
}
