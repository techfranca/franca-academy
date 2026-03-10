'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/cursos')
    router.refresh()
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h2 className="font-poppins font-bold text-[22px] sm:text-[26px] text-brand-navy leading-tight mb-1.5">
          Bem-vindo(a) de volta
        </h2>
        <p className="font-montserrat text-[14px] text-brand-navy-light-active leading-relaxed">
          Acesse sua conta para continuar aprendendo
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">

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

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="font-montserrat text-[13px] font-semibold text-brand-navy">
              Senha
            </label>
            <Link
              href="/esqueci-senha"
              className="font-montserrat text-[12px] text-brand-sage hover:text-brand-green-dark transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>
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
              placeholder="••••••••"
              required
              autoComplete="current-password"
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
                Entrar na plataforma
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-black/[0.06]" />
        <span className="font-montserrat text-[11px] text-brand-navy-light-active uppercase tracking-wider">acesso seguro</span>
        <div className="flex-1 h-px bg-black/[0.06]" />
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-1.5 text-brand-navy-light-active/60">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span className="font-montserrat text-[11px]">Sua conexão é protegida com criptografia SSL</span>
      </div>
    </div>
  )
}
