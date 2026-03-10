'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, CheckCircle2, ArrowRight } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function initSession() {
      const hash = window.location.hash
      const search = window.location.search

      if (hash.includes('error=')) {
        const params = new URLSearchParams(hash.slice(1))
        const desc = params.get('error_description')?.replace(/\+/g, ' ') ?? 'O link é inválido ou expirou.'
        setError(desc)
        setReady(true)
        return
      }

      if (hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.slice(1))
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) setError('O link é inválido ou expirou.')
          setReady(true)
          return
        }
      }

      const code = new URLSearchParams(search).get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) setError('O link é inválido ou expirou.')
        setReady(true)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
        return
      }

      setError('Link inválido. Solicite um novo link de acesso.')
      setReady(true)
    }

    initSession()
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Erro ao redefinir senha. O link pode ter expirado.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/cursos')
      router.refresh()
    }, 2000)
  }

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="w-8 h-8 border-2 border-brand-navy/20 border-t-brand-navy rounded-full animate-spin" />
        <p className="font-montserrat text-[13px] text-brand-navy-light-active">Verificando link...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-2">
        <div className="w-16 h-16 bg-brand-green-light rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={30} className="text-brand-green-dark" />
        </div>
        <h2 className="font-poppins font-bold text-[22px] sm:text-[26px] text-brand-navy mb-2 leading-tight">
          Senha redefinida!
        </h2>
        <p className="font-montserrat text-[14px] text-brand-navy-light-active">
          Redirecionando para a plataforma...
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h2 className="font-poppins font-bold text-[22px] sm:text-[26px] text-brand-navy leading-tight mb-1.5">
          Redefinir senha
        </h2>
        <p className="font-montserrat text-[14px] text-brand-navy-light-active leading-relaxed">
          Escolha uma senha segura para sua conta.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">

        {/* New password */}
        <div>
          <label htmlFor="password" className="block font-montserrat text-[13px] font-semibold text-brand-navy mb-1.5">
            Nova senha
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy-light-active pointer-events-none">
              <Lock size={16} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10 pr-12"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-brand-navy-light-active hover:text-brand-navy transition-colors"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirm" className="block font-montserrat text-[13px] font-semibold text-brand-navy mb-1.5">
            Confirmar nova senha
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy-light-active pointer-events-none">
              <Lock size={16} />
            </div>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field pl-10"
              placeholder="Repita a nova senha"
              required
              autoComplete="new-password"
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
                Salvar nova senha
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
