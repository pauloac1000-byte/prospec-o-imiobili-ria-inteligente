import { useState } from 'react'
import { createPublicProperty } from '@/services/publicProperties'
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

const initialForm = {
  owner_name: '',
  owner_phone: '',
  owner_email: '',
  owner_motivation: '',
  title: '',
  address: '',
  neighborhood: '',
  city: '',
  property_type: '',
  estimated_value: '',
  notes: '',
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-slate-300">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function PublicPropertyForm() {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = (): boolean => {
    const e: FieldErrors = {}
    if (!formData.owner_name.trim()) e.owner_name = 'Nome é obrigatório'
    if (!formData.owner_phone.trim()) e.owner_phone = 'Telefone é obrigatório'
    if (!formData.owner_email.trim()) e.owner_email = 'E-mail é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner_email))
      e.owner_email = 'E-mail inválido'
    if (!formData.owner_motivation) e.owner_motivation = 'Selecione a motivação'
    if (!formData.title.trim()) e.title = 'Título é obrigatório'
    if (!formData.address.trim()) e.address = 'Endereço é obrigatório'
    if (!formData.neighborhood.trim()) e.neighborhood = 'Bairro é obrigatório'
    if (!formData.city.trim()) e.city = 'Cidade é obrigatória'
    if (!formData.property_type) e.property_type = 'Selecione o tipo'
    if (!formData.estimated_value || Number(formData.estimated_value) <= 0)
      e.estimated_value = 'Valor é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await createPublicProperty({
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
        owner_email: formData.owner_email,
        owner_motivation: formData.owner_motivation,
        title: formData.title,
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        property_type: formData.property_type,
        estimated_value: Number(formData.estimated_value),
        notes: formData.notes || undefined,
      })
      setSuccess(true)
    } catch (err) {
      const fe = extractFieldErrors(err)
      if (Object.keys(fe).length > 0) setErrors(fe)
      else toast({ title: 'Erro ao enviar. Tente novamente.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4 animate-fade-in-up">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Imóvel cadastrado com sucesso!</h2>
        <p className="text-sm text-slate-400">
          Sua propriedade foi analisada por IA. Em breve entraremos em contato.
        </p>
        <Button
          onClick={() => {
            setFormData(initialForm)
            setErrors({})
            setSuccess(false)
          }}
          variant="outline"
          className="border-slate-700 text-slate-200 hover:bg-slate-800"
        >
          Cadastrar outro imóvel
        </Button>
      </div>
    )
  }

  const set = (key: string, val: string) => setFormData({ ...formData, [key]: val })

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Cadastre seu imóvel</h2>
        <p className="text-xs text-slate-400 mt-1">Receba uma avaliação gratuita com IA.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field label="Nome do Proprietário *" error={errors.owner_name}>
          <Input
            value={formData.owner_name}
            onChange={(e) => set('owner_name', e.target.value)}
            placeholder="Seu nome"
            className="bg-slate-950 border-slate-800"
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Telefone/WhatsApp *" error={errors.owner_phone}>
            <Input
              value={formData.owner_phone}
              onChange={(e) => set('owner_phone', e.target.value)}
              placeholder="(11) 99999-8888"
              className="bg-slate-950 border-slate-800"
            />
          </Field>
          <Field label="E-mail *" error={errors.owner_email}>
            <Input
              type="email"
              value={formData.owner_email}
              onChange={(e) => set('owner_email', e.target.value)}
              placeholder="seu@email.com"
              className="bg-slate-950 border-slate-800"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Motivação para Vender *" error={errors.owner_motivation}>
            <Select
              value={formData.owner_motivation}
              onValueChange={(v) => set('owner_motivation', v)}
            >
              <SelectTrigger className="bg-slate-950 border-slate-800">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                <SelectItem value="inventario">Inventário / Herança</SelectItem>
                <SelectItem value="divorcio">Divórcio</SelectItem>
                <SelectItem value="urgencia_financeira">Urgência Financeira</SelectItem>
                <SelectItem value="mudanca">Mudança</SelectItem>
                <SelectItem value="investimento">Investimento</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tipo de Imóvel *" error={errors.property_type}>
            <Select value={formData.property_type} onValueChange={(v) => set('property_type', v)}>
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
          </Field>
        </div>
        <Field label="Título do Imóvel *" error={errors.title}>
          <Input
            value={formData.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Ex: Apartamento 2 quartos - Jardins"
            className="bg-slate-950 border-slate-800"
          />
        </Field>
        <Field label="Endereço Completo *" error={errors.address}>
          <Input
            value={formData.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Rua, número, complemento"
            className="bg-slate-950 border-slate-800"
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Bairro *" error={errors.neighborhood}>
            <Input
              value={formData.neighborhood}
              onChange={(e) => set('neighborhood', e.target.value)}
              placeholder="Bairro"
              className="bg-slate-950 border-slate-800"
            />
          </Field>
          <Field label="Cidade *" error={errors.city}>
            <Input
              value={formData.city}
              onChange={(e) => set('city', e.target.value)}
              placeholder="Cidade"
              className="bg-slate-950 border-slate-800"
            />
          </Field>
        </div>
        <Field label="Valor Estimado (R$) *" error={errors.estimated_value}>
          <Input
            type="number"
            value={formData.estimated_value}
            onChange={(e) => set('estimated_value', e.target.value)}
            placeholder="Ex: 500000"
            className="bg-slate-950 border-slate-800"
          />
        </Field>
        <Field label="Observações">
          <Textarea
            value={formData.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Conte detalhes sobre o imóvel..."
            className="bg-slate-950 border-slate-800 min-h-[80px]"
          />
        </Field>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 gap-1.5"
        >
          {loading ? (
            'Enviando...'
          ) : (
            <>
              Quero Vender Meu Imóvel <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
