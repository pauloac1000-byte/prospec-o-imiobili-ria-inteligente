import { useState, useEffect } from 'react'
import { getLeads, createLead, LeadItem } from '@/services/leads'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { useRealtime } from '@/hooks/use-realtime'
import { Users, Plus, Phone, Mail, Sparkles, MessageCircle, DollarSign } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function Leads() {
  const [leads, setLeads] = useState<LeadItem[]>([])
  const [openNew, setOpenNew] = useState(false)

  const [formData, setFormData] = useState<Partial<LeadItem>>({
    name: '',
    email: '',
    phone: '',
    lead_type: 'investidor',
    status: 'novo',
    budget: 1000000,
    preferred_neighborhood: 'Jardins',
    score: 85,
    notes: '',
  })

  const loadLeads = async () => {
    try {
      const data = await getLeads()
      setLeads(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  useRealtime('leads', () => loadLeads())

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createLead(formData)
      toast({ title: 'Lead/Investidor cadastrado com sucesso!' })
      setOpenNew(false)
      loadLeads()
    } catch (err) {
      toast({ title: 'Erro ao salvar lead.', variant: 'destructive' })
    }
  }

  const openWhatsapp = (phone?: string, name?: string) => {
    if (!phone) return
    const cleanPhone = phone.replace(/\D/g, '')
    const msg = encodeURIComponent(
      `Olá ${name || ''}, tudo bem? Sou da equipe de prospecção imobiliária. Tenho uma oportunidade exclusiva de investimento que se encaixa no seu perfil.`,
    )
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-400" />
            CRM de Leads & Investidores Qualificados
          </h1>
          <p className="text-xs text-slate-400">
            Relacionamento estratégico para casar teses de investimento com imóveis captados.
          </p>
        </div>

        <Dialog open={openNew} onOpenChange={setOpenNew}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 text-white font-semibold hover:bg-purple-500 gap-1.5">
              <Plus className="h-4 w-4" /> Cadastrar Lead
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white">
                Novo Lead / Investidor
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateLead} className="space-y-3 my-2">
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Nome Completo</Label>
                <Input
                  required
                  placeholder="Nome do cliente"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-950 border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Telefone / WhatsApp</Label>
                  <Input
                    placeholder="(11) 99999-8888"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-slate-950 border-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">E-mail</Label>
                  <Input
                    type="email"
                    placeholder="email@cliente.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-950 border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Perfil do Lead</Label>
                  <Select
                    value={formData.lead_type}
                    onValueChange={(val: any) => setFormData({ ...formData, lead_type: val })}
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value="investidor">Investidor (Busca ROI)</SelectItem>
                      <SelectItem value="comprador">Comprador Final</SelectItem>
                      <SelectItem value="vendedor">Vendedor / Proprietário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Orçamento Disponível (R$)</Label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="bg-slate-950 border-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Bairro Preferencial</Label>
                <Input
                  placeholder="Ex: Jardins, Moema..."
                  value={formData.preferred_neighborhood}
                  onChange={(e) =>
                    setFormData({ ...formData, preferred_neighborhood: e.target.value })
                  }
                  className="bg-slate-950 border-slate-800"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 font-bold mt-2"
              >
                Salvar Lead
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map((lead) => (
          <Card
            key={lead.id}
            className="bg-slate-900 border-slate-800 text-slate-100 shadow-md flex flex-col justify-between"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{lead.name}</h3>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px] mt-1 uppercase">
                    {lead.lead_type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400">{lead.score || 80}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded border border-slate-800">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  <span>
                    Budget: <strong>R$ {(lead.budget || 0).toLocaleString('pt-BR')}</strong>
                  </span>
                </div>
                {lead.preferred_neighborhood && (
                  <div className="text-slate-400">
                    Preferência:{' '}
                    <strong className="text-slate-200">{lead.preferred_neighborhood}</strong>
                  </div>
                )}
              </div>

              {lead.phone && (
                <Button
                  size="sm"
                  onClick={() => openWhatsapp(lead.phone, lead.name)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Chamar no WhatsApp
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
