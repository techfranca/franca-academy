'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Save, Eye, EyeOff, Lock } from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        setName(profile?.full_name || '')
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    setMessage(error ? 'Erro ao salvar. Tente novamente.' : 'Perfil atualizado com sucesso!')
    setSaving(false)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMessage('')
    if (newPassword.length < 6) { setPasswordMessage('A nova senha deve ter pelo menos 6 caracteres.'); return }
    if (newPassword !== confirmPassword) { setPasswordMessage('As senhas não coincidem.'); return }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordMessage('Erro ao alterar senha. Tente novamente.')
    } else {
      setPasswordMessage('Senha alterada com sucesso!')
      setNewPassword('')
      setConfirmPassword('')
    }
    setSavingPassword(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="page-title mb-1">Meu Perfil</h1>
        <p className="page-subtitle">Gerencie suas informações pessoais e senha.</p>
      </div>

      {/* Profile info */}
      <div className="card-static p-5 sm:p-8 mb-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-green-light rounded-xl flex items-center justify-center">
            <User size={20} className="text-brand-green-dark" />
          </div>
          <h2 className="font-poppins text-[17px] font-semibold text-brand-navy">Informações Pessoais</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[13px] font-semibold text-brand-navy mb-1.5">Nome completo</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Seu nome" />
          </div>
          <div>
            <label htmlFor="email" className="block text-[13px] font-semibold text-brand-navy mb-1.5">Email</label>
            <input id="email" type="email" value={email} disabled className="input-field bg-black/[0.02] cursor-not-allowed opacity-60" />
            <p className="text-[12px] text-brand-navy-light-active mt-1">O email não pode ser alterado.</p>
          </div>
          {message && (
            <div className={`px-4 py-3 rounded-xl text-[13px] ${message.includes('sucesso') ? 'bg-brand-green-light text-brand-green-dark' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50 text-[14px]">
            {saving ? <div className="w-4 h-4 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" /> : <><Save size={16} /> Salvar</>}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card-static p-5 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-green-light rounded-xl flex items-center justify-center">
            <Lock size={20} className="text-brand-green-dark" />
          </div>
          <h2 className="font-poppins text-[17px] font-semibold text-brand-navy">Alterar Senha</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-[13px] font-semibold text-brand-navy mb-1.5">Nova senha</label>
            <div className="relative">
              <input id="new-password" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field pr-12" placeholder="Mínimo 6 caracteres" required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy-light-active hover:text-brand-navy">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-[13px] font-semibold text-brand-navy mb-1.5">Confirmar nova senha</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="Repita a nova senha" required />
          </div>
          {passwordMessage && (
            <div className={`px-4 py-3 rounded-xl text-[13px] ${passwordMessage.includes('sucesso') ? 'bg-brand-green-light text-brand-green-dark' : 'bg-red-50 text-red-600'}`}>
              {passwordMessage}
            </div>
          )}
          <button type="submit" disabled={savingPassword} className="btn-secondary flex items-center gap-2 disabled:opacity-50 text-[14px]">
            {savingPassword ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock size={16} /> Alterar senha</>}
          </button>
        </form>
      </div>
    </div>
  )
}
