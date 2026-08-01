import { useState } from 'react'
import { sendAgentChatMessage } from '@/services/ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Send, Bot, User, ShieldCheck } from 'lucide-react'

interface ChatMsg {
  sender: 'user' | 'agent'
  text: string
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: 'agent',
      text: 'Olá! Sou seu Copiloto Especialista em Prospecção Imobiliária. Como posso ajudar a identificar boas oportunidades, calcular ROI ou elaborar argumentos de negociação hoje?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>(undefined)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = input
    setInput('')
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await sendAgentChatMessage(userMsg, conversationId)
      if (res.conversation_id) setConversationId(res.conversation_id)
      setMessages((prev) => [...prev, { sender: 'agent', text: res.content }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'Desculpe, ocorreu uma instabilidade temporária. Tente novamente em instantes.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const presetQuestions = [
    'Como convencer proprietário em inventário a vender com 25% de desconto?',
    'Script WhatsApp para apresentação de oportunidade para investidor',
    'Como calcular margem de reforma para revenda rápida (Flip)?',
  ]

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-400" />
          Copiloto IA de Prospecção
        </h1>
        <p className="text-xs text-slate-400">
          Inteligência Artificial treinada com estratégias de negociação imobiliária de alto
          impacto.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setInput(q)}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs text-left rounded-lg border border-slate-800 transition-colors"
          >
            "{q}"
          </button>
        ))}
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 flex flex-col h-[520px]">
        <CardHeader className="p-4 border-b border-slate-800/80 bg-slate-950/50">
          <CardTitle className="text-sm font-semibold flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-amber-400" /> Agente Prospector Imobiliário
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Conexão Segura
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'agent' && (
                <div className="h-7 w-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
              <Bot className="h-4 w-4 text-amber-400" /> Copiloto pensando...
            </div>
          )}
        </CardContent>

        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex gap-2">
          <Input
            placeholder="Digite sua dúvida ou estratégia de prospecção..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="bg-slate-900 border-slate-800 text-slate-100 text-xs"
          />
          <Button
            onClick={handleSend}
            disabled={loading}
            className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
