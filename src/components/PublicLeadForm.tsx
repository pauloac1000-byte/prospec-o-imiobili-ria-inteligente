import { useState } from 'react'
import { createPublicLead } from '@/services/leads'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, Send } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface FormData {
  name: string
  email: string
  phone: string
  lead_type: string
  budget: string
  preferred_neighborhood: string
  preferred_type: string
  notes: string
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  lead_type: 'comprador',
  budget: '',
  preferred_neighborhood: '',
  preferred_type: '',
  notes: '',
}

export function PublicLeadForm() {
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = (): boolean => {
    const e: FieldErrors = {}
    if (!formData.name.trim()) e.name = 'Nome é obrigatório'
    if (!formData.email.trim()) e.email = 'E-mail é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'E-mail inválido'
    if (!formData.phone.trim()) e.phone = 'Telefone é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await createPublicLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        lead_type: formData.lead_type as FormData['lead_type'] extends string ? any : never,
        budget: formData.budget ? Number(formData.budget) : undefined,
        preferred_neighborhood: formData.preferred_neighborhood || undefined,
        preferred_type: (formData.preferred_type || undefined) as any,
        notes: formData.notes || undefined,
      })
      setSuccess(true)
    } catch (err) {
      const fieldErrs = extractFieldErrors(err)
      if (Object.keys(fieldErrs).length > 0) {
        setErrors(fieldErrs)
      } else {
        toast({ title: 'Erro ao enviar. Tente novamente.', variant: 'destructive' })
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(initialForm)
    setErrors({})
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4 animate-fade-in-up">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Recebemos seu contato!</h2>
        <p className="text-sm text-slate-400">
          Em breve retornaremos com oportunidades exclusivas para você.
        </p>
        <Button
          onClick={resetForm}
          variant="outline"
          className="border-slate-700 text-slate-200 hover:bg-slate-800"
        >
          Enviar outro cadastro
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Cadastre-se e receba oportunidades</h2>
        <p className="text-xs text-slate-400 mt-1">
          Preencha o formulário e entraremos em contato com as melhores oportunidades para você.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs text-slate-300">Nome Completo *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Seu nome completo"
            className="bg-slate-950 border-slate-800"
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">E-mail *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              className="bg-slate-950 border-slate-800"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Telefone/WhatsApp *</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-8888"
              className="bg-slate-950 border-slate-800"
            />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Perfil *</Label>
            <Select
              value={formData.lead_type}
              onValueChange={(v) => setFormData({ ...formData, lead_type: v })}
            >
              <SelectTrigger className="bg-slate-950 border-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                <SelectItem value="comprador">Comprador</SelectItem>
                <SelectItem value="vendedor">Vendedor</SelectItem>
                <SelectItem value="investidor">Investidor</SelectItem>
                <SelectItem value="proprietario">Proprietário</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Orçamento (R$)</Label>
            <Input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="Ex: 500000"
              className="bg-slate-950 border-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Bairro Preferencial</Label>
            <Input
              value={formData.preferred_neighborhood}
              onChange={(e) => setFormData({ ...formData, preferred_neighborhood: e.target.value })}
              placeholder="Ex: Jardins, Moema"
              className="bg-slate-950 border-slate-800"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Tipo de Imóvel Preferido</Label>
            <Select
              value={formData.preferred_type}
              onValueChange={(v) => setFormData({ ...formData, preferred_type: v })}
            >
              <SelectTrigger className="bg-slate-950 border-slate-800">
                <SelectValue placeholder="Selecione" />
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
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-slate-300">Mensagem</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Conte-nos sobre seus objetivos..."
            className="bg-slate-950 border-slate-800 min-h-[80px]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 gap-1.5"
        >
          {loading ? (
            'Enviando...'
          ) : (
            <>
              Quero Receber Oportunidades <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
