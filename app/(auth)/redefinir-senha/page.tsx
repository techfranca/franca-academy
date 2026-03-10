'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'

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

      // 1. Erro no hash (link inválido ou expirado)
      if (hash.includes('error=')) {
        const params = new URLSearchParams(hash.slice(1))
        const desc = params.get('error_description')?.replace(/\+/g, ' ') ?? 'O link é inválido ou expirou.'
        setError(desc)
        setReady(true)
        return
      }

      // 2. Implicit flow: tokens direto no hash — lê e seta a sessão manualmente
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

      // 3. PKCE flow: troca o code por sessão
      const code = new URLSearchParams(search).get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) setError('O link é inválido ou expirou.')
        setReady(true)
        return
      }

      // 4. Sessão já ativa (usuário logado acessando direto)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
        return
      }

      // 5. Nenhum token encontrado
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
      <div className="flex items-center justify-center py-12">
        <div className="w-7 h-7 border-2 border-brand-navy/20 border-t-brand-navy rounded-full animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} className="text-brand-green-dark" />
        </div>
        <h2 className="font-poppins text-heading-2 text-brand-navy mb-3">
          Senha redefinida!
        </h2>
        <p className="font-montserrat text-body text-brand-navy-light-active">
          Redirecionando para a plataforma...
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-poppins text-heading-2 text-brand-navy mb-2">
          Redefinir senha
        </h2>
        <p className="font-montserrat text-body text-brand-navy-light-active">
          Escolha uma nova senha para sua conta.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-body-small-bold text-brand-navy mb-2">
            Nova senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-12"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
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

        <div>
          <label htmlFor="confirm" className="block text-body-small-bold text-brand-navy mb-2">
            Confirmar nova senha
          </label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="Repita a nova senha"
            required
          />
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
              <Lock size={20} />
              Redefinir senha
            </>
          )}
        </button>
      </form>
    </div>
  )
}
