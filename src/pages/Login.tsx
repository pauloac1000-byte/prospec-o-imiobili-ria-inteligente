import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Building2, ShieldCheck, ArrowRight } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Link } from 'react-router-dom'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name)
        if (error) throw error
        toast({ title: 'Conta criada com sucesso!' })
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        toast({ title: 'Bem-vindo de volta!' })
      }
      navigate('/')
    } catch (err: any) {
      toast({
        title: 'Erro de autenticação',
        description: err.message || 'Verifique suas credenciais.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 mb-2">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Prospecção Imobiliária Inteligente
          </h1>
          <p className="text-xs text-slate-400">
            Captura de leads, valuation com IA e aceleração de receita
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white font-bold">
              {isSignUp ? 'Criar Conta de Corretor' : 'Acessar Painel'}
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Sua plataforma segura para prospeção de imóveis com alto potencial.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} autoComplete="off">
            <CardContent className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="login-name" className="text-xs text-slate-300">
                    Seu Nome / Nome da Imobiliária
                  </Label>
                  <Input
                    id="login-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Ex: Corretora Elite"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-100"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs text-slate-300">
                  E-mail Corporativo
                </Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  placeholder="exemplo@imobiliaria.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-100"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-xs text-slate-300">
                    Senha
                  </Label>
                  {!isSignUp && (
                    <Link
                      to="/forgot-password"
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Esqueci minha senha
                    </Link>
                  )}
                </div>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-100"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500"
              >
                {loading
                  ? 'Processando...'
                  : isSignUp
                    ? 'Cadastrar e Acessar'
                    : 'Entrar na Plataforma'}
              </Button>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                {isSignUp
                  ? 'Já tem uma conta? Faça login'
                  : 'Não tem conta? Cadastre-se em 1 minuto'}
              </button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Plataforma 100% segura e criptografada</span>
          </div>

          <Link
            to="/captacao"
            className="flex items-center justify-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
          >
            Quero receber oportunidades
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
