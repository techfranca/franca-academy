'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      setError('Erro ao enviar email. Tente novamente.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={32} className="text-brand-green-dark" />
        </div>
        <h2 className="font-poppins text-heading-2 text-brand-navy mb-3">
          Email enviado!
        </h2>
        <p className="font-montserrat text-body text-brand-navy-light-active mb-8">
          Verifique sua caixa de entrada e clique no link para redefinir sua senha.
        </p>
        <Link href="/login" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={20} />
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-body-small text-brand-navy-light-active hover:text-brand-navy transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Voltar ao login
      </Link>

      <div className="mb-8">
        <h2 className="font-poppins text-heading-2 text-brand-navy mb-2">
          Esqueceu sua senha?
        </h2>
        <p className="font-montserrat text-body text-brand-navy-light-active">
          Informe seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-5">
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
              <Mail size={20} />
              Enviar link de redefinição
            </>
          )}
        </button>
      </form>
    </div>
  )
}
