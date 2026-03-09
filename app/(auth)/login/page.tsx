'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn } from 'lucide-react'

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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

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
      <div className="mb-8">
        <h2 className="font-poppins text-heading-2 text-brand-navy mb-2">
          Bem-vindo(a) de volta
        </h2>
        <p className="font-montserrat text-body text-brand-navy-light-active">
          Acesse sua conta para continuar aprendendo
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-body-small-bold text-brand-navy mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-body-small-bold text-brand-navy mb-2">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-12"
              placeholder="Sua senha"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy-light-active hover:text-brand-navy transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-body-small">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
          ) : (
            <>
              <LogIn size={20} />
              Entrar
            </>
          )}
        </button>

        <div className="text-center">
          <Link
            href="/esqueci-senha"
            className="text-body-small text-brand-sage hover:text-brand-green-dark transition-colors"
          >
            Esqueceu sua senha?
          </Link>
        </div>
      </form>
    </div>
  )
}
