import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import { Building2, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { requestPasswordReset } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await requestPasswordReset(email.trim())
      if (error) {
        // PocketBase typically returns 200 or generic message to avoid email enumeration,
        // but if an error occurs we handle it gracefully
        console.error('Password reset error:', error)
      }
      // Sempre indicamos sucesso para segurança e confirmação visual
      setSubmitted(true)
      toast({
        title: 'Solicitação enviada!',
        description: 'Se o e-mail estiver cadastrado, as instruções foram enviadas.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao solicitar redefinição',
        description: err.message || 'Ocorreu um erro ao processar seu pedido.',
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Recuperação de Acesso</h1>
          <p className="text-xs text-slate-400">
            Defina uma nova senha para voltar a acessar a plataforma
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white font-bold">Esqueceu sua senha?</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Informe seu e-mail cadastrado. Enviaremos um link exclusivo para redefinir sua
              credencial.
            </CardDescription>
          </CardHeader>

          {submitted ? (
            <CardContent className="space-y-4 text-center py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-base">
                  E-mail de recuperação enviado
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enviamos o link de redefinição para{' '}
                  <strong className="text-amber-400">{email}</strong>. Verifique sua caixa de
                  entrada e também a pasta de spam.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-left space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-amber-400 font-medium text-xs">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Atenção sobre entrega de e-mails:</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  A entrega na sua caixa de entrada depende da configuração do servidor de e-mail
                  (SMTP) no painel administrativo do PocketBase. Caso não receba, contate um
                  administrador do sistema.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Tentar outro e-mail
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-slate-300">
                    Seu e-mail cadastrado
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemplo@imobiliaria.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200/90 leading-relaxed">
                  💡 Você receberá um e-mail contendo o link para criar sua nova senha com
                  segurança.
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500"
                >
                  {loading ? 'Enviando link...' : 'Enviar Link de Redefinição'}
                </Button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar para o login
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
