'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

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
      <div className="mb-6 text-center">
        <p className="font-montserrat text-[10px] font-semibold text-brand-sage tracking-[0.2em] uppercase mb-2">
          Franca Academy
        </p>
        <h1 className="font-poppins font-bold text-[20px] text-brand-navy mb-1">
          Entrar na conta
        </h1>
        <p className="font-montserrat text-[13px] text-brand-navy/55">
          Bem-vindo(a) de volta
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-3">

        {/* Email */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy-light-active pointer-events-none">
            <Mail size={15} />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field pl-10 text-[14px] bg-[#f5f7f6] border-transparent focus:bg-white"
            placeholder="Email"
            required
            autoComplete="email"
          />
        </div>

        {/* Senha */}
        <div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy-light-active pointer-events-none">
              <Lock size={15} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10 pr-12 text-[14px] bg-[#f5f7f6] border-transparent focus:bg-white"
              placeholder="Senha"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-brand-navy-light-active hover:text-brand-navy transition-colors"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Esqueceu a senha - abaixo do campo, alinhado à direita */}
          <div className="flex justify-end mt-1.5">
            <Link
              href="/esqueci-senha"
              className="font-montserrat text-[12px] text-brand-sage hover:text-brand-green-dark transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        {error && (
          <p className="text-[13px] text-red-600 font-montserrat bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
            : 'Entrar'
          }
        </button>

      </form>
    </div>
  )
}
