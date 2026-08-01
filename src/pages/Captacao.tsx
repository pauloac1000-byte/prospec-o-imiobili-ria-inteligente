import { Link } from 'react-router-dom'
import { Building2, ShieldCheck, TrendingUp, Sparkles, MapPin } from 'lucide-react'
import { PublicLeadForm } from '@/components/PublicLeadForm'

export default function Captacao() {
  return (
    <div className="min-h-screen bg-slate-950">
      <section className="relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 pt-16 pb-8 text-center relative z-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 mb-4">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Encontre as Melhores Oportunidades Imobiliárias
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-6">
            Receba análises exclusivas, oportunidades de alto ROI e atendimento personalizado para
            seus objetivos de compra, venda ou investimento.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>100% Seguro e Criptografado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span>Análise de Mercado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Oportunidades Exclusivas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>Atendimento Personalizado</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 pb-16">
        <PublicLeadForm />
      </section>

      <footer className="border-t border-slate-800 py-6 text-center">
        <Link to="/login" className="text-xs text-slate-500 hover:text-amber-400 transition-colors">
          Acessar painel do corretor
        </Link>
      </footer>
    </div>
  )
}
