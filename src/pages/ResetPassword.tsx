import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
import {
  Building2,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token') || ''

  const [token, setToken] = useState(tokenFromUrl)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { confirmPasswordReset } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
  }, [tokenFromUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!token.trim()) {
      setErrorMsg('O token de redefinição não foi informado ou é inválido.')
      return
    }

    if (password.length < 8) {
      setErrorMsg('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (password !== passwordConfirm) {
      setErrorMsg('As senhas digitadas não coincidem.')
      return
    }

    setLoading(true)

    try {
      const { error } = await confirmPasswordReset(token.trim(), password)
      if (error) {
        throw error
      }

      setSuccess(true)
      toast({
        title: 'Senha redefinida com sucesso!',
        description: 'Você já pode acessar o sistema com sua nova senha.',
      })
    } catch (err: any) {
      const msg =
        err?.response?.message ||
        err?.message ||
        'Não foi possível redefinir a senha. O link pode ter expirado ou o token é inválido.'
      setErrorMsg(msg)
      toast({
        title: 'Falha na redefinição',
        description: msg,
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Nova Senha de Acesso</h1>
          <p className="text-xs text-slate-400">Defina sua nova credencial de segurança</p>
        </div>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-400" />
              Redefinir Senha
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Crie uma senha forte com no mínimo 8 caracteres.
            </CardDescription>
          </CardHeader>

          {success ? (
            <CardContent className="space-y-4 text-center py-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-white text-base">Tudo pronto!</h3>
                <p className="text-xs text-slate-300">
                  Sua senha foi atualizada com sucesso. Agora você já pode entrar na sua conta.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 flex items-center justify-center gap-2"
                >
                  <span>Ir para o Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-xs text-rose-300">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {!tokenFromUrl && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Token de Redefinição</Label>
                    <Input
                      placeholder="Cole aqui o token recebido no e-mail"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600"
                      required
                    />
                    <p className="text-[11px] text-slate-500">
                      Normalmente preenchido de forma automática ao clicar no link do e-mail.
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo de 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 bg-slate-950 border-slate-800 text-slate-100"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Confirmar Nova Senha</Label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repita a nova senha"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-100"
                    required
                    minLength={8}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500"
                >
                  {loading ? 'Salvando nova senha...' : 'Confirmar e Salvar Nova Senha'}
                </Button>

                <Link
                  to="/login"
                  className="text-xs text-slate-400 hover:text-amber-400 text-center transition-colors"
                >
                  Cancelar e voltar ao login
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
