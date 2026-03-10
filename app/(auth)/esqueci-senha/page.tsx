'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Mail, Send } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/redefinir-senha`,
    })

    if (error) {
      setError('Erro ao enviar email. Tente novamente.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center py-2">
        <div className="w-16 h-16 bg-brand-green-light rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Mail size={30} className="text-brand-green-dark" />
        </div>
        <h2 className="font-poppins font-bold text-[22px] sm:text-[26px] text-brand-navy mb-2 leading-tight">
          Email enviado!
        </h2>
        <p className="font-montserrat text-[14px] text-brand-navy-light-active leading-relaxed mb-7">
          Verifique sua caixa de entrada e clique no link para redefinir sua senha.
        </p>
        <Link href="/login" className="btn-secondary inline-flex items-center gap-2 text-[14px]">
          <ArrowLeft size={16} />
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 font-montserrat text-[13px] text-brand-navy-light-active hover:text-brand-navy transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Voltar ao login
      </Link>

      {/* Header */}
      <div className="mb-7">
        <h2 className="font-poppins font-bold text-[22px] sm:text-[26px] text-brand-navy leading-tight mb-1.5">
          Esqueceu sua senha?
        </h2>
        <p className="font-montserrat text-[14px] text-brand-navy-light-active leading-relaxed">
          Informe seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-montserrat text-[13px] font-semibold text-brand-navy mb-1.5">
            Email
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy-light-active pointer-events-none">
              <Mail size={16} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200/80 text-red-700 px-4 py-3 rounded-xl text-[13px] font-montserrat">
            <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white font-poppins font-bold text-[14px] px-6 py-3.5 rounded-xl hover:bg-brand-navy-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-navy/40 focus:ring-offset-2 min-h-[48px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={15} />
                Enviar link de redefinição
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
