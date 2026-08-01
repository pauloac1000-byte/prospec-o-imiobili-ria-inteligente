import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Building2, Sparkles, User, LogOut, ShieldCheck, Bell } from 'lucide-react'

export function NavbarHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-slate-950/90 text-slate-100 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                PROSPECT<span className="text-amber-400">IMÓVEIS</span>
              </span>
              <Badge
                variant="outline"
                className="border-amber-500/40 bg-amber-500/10 text-amber-300 text-[10px] uppercase font-semibold tracking-wider"
              >
                Inteligência IA
              </Badge>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Prospecção de Alta Performance & Maximização de Receita
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/ai-assistant">
            <Button
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 font-semibold gap-1.5 shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Copiloto IA</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:text-white hover:bg-slate-800 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
          </Button>

          <div className="h-6 w-px bg-slate-800"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-semibold text-xs">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'CO'}
                </div>
                <span className="font-medium text-sm hidden md:inline">
                  {user?.name || user?.email || 'Corretor'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-slate-900 border-slate-800 text-slate-100"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">
                    {user?.name || 'Corretor Pro'}
                  </p>
                  <p className="text-xs leading-none text-slate-400">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="gap-2 text-slate-300 hover:text-white focus:bg-slate-800 focus:text-white cursor-pointer">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>
                  Influência de Mercado: <strong className="text-amber-400">Nível Top 5%</strong>
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                onClick={signOut}
                className="gap-2 text-rose-400 focus:bg-rose-950/40 focus:text-rose-300 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair da Conta</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
