import { useState, useEffect } from 'react'
import { getActivities, createActivity, ActivityItem } from '@/services/activities'
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
import { CalendarCheck, Plus, CheckCircle2, PhoneCall, Building } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function Activities() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [openNew, setOpenNew] = useState(false)
  const [formData, setFormData] = useState<Partial<ActivityItem>>({
    title: '',
    activity_type: 'ligacao',
    status: 'agendado',
    description: '',
  })

  const loadActivities = async () => {
    try {
      const data = await getActivities()
      setActivities(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createActivity(formData)
      toast({ title: 'Atividade agendada com sucesso!' })
      setOpenNew(false)
      loadActivities()
    } catch (err) {
      toast({ title: 'Erro ao agendar atividade.', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-amber-400" />
            Agenda & Acompanhamento de Captação
          </h1>
          <p className="text-xs text-slate-400">
            Controle de reuniões, visitas técnicas e follow-ups com proprietários.
          </p>
        </div>

        <Dialog open={openNew} onOpenChange={setOpenNew}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 gap-1.5">
              <Plus className="h-4 w-4" /> Nova Atividade
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white">Agendar Atividade</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-3 my-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Título</label>
                <Input
                  required
                  placeholder="Ex: Ligação para herdeiro do imóvel Jardins"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-950 border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Descrição</label>
                <Input
                  placeholder="Detalhes adicionais"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-950 border-slate-800"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 mt-2"
              >
                Agendar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {activities.map((act) => (
          <Card key={act.id} className="bg-slate-900 border-slate-800 text-slate-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{act.title}</h4>
                  <p className="text-xs text-slate-400">{act.description || 'Sem observações'}</p>
                </div>
              </div>

              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {act.status.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            Nenhuma atividade pendente.
          </div>
        )}
      </div>
    </div>
  )
}
