import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Home,
  Users,
  Radar,
  Sparkles,
  CalendarCheck,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const location = useLocation()

  const navItems = [
    { label: 'Visão Geral', path: '/', icon: LayoutDashboard },
    { label: 'Prospecção Imóveis', path: '/properties', icon: Home, badge: 'Oportunidades' },
    { label: 'Leads & Clientes', path: '/leads', icon: Users },
    { label: 'Radar de Mercado', path: '/market-radar', icon: Radar },
    { label: 'Copiloto IA', path: '/ai-assistant', icon: Sparkles, highlight: true },
    { label: 'Atividades e Agendas', path: '/activities', icon: CalendarCheck },
  ]

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 hidden md:flex shrink-0">
      <div className="space-y-6">
        <div className="px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <TrendingUp className="h-3.5 w-3.5" /> Meta de Faturamento
          </div>
          <p className="text-xl font-bold text-white">R$ 185.000,00</p>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full w-[68%]"></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">68% atingido este mês</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900',
                  item.highlight && !isActive && 'text-amber-300 hover:text-amber-200',
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('h-4 w-4', isActive ? 'text-amber-400' : 'text-slate-400')} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-slate-800 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-slate-200 font-medium text-xs mb-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Confiança e Segurança
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Dados criptografados, histórico verificado de imóveis e conformidade total LGPD.
          </p>
        </div>
      </div>
    </aside>
  )
}
