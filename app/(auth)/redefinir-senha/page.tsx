'use client'

import { useState } from 'react'
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
  const router = useRouter()
  const supabase = createClient()

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
