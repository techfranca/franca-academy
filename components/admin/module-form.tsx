'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'

interface ModuleFormProps {
  courseId: string
  module?: {
    id: string
    title: string
    description: string | null
    order_index: number
  }
  nextOrderIndex: number
}

export function ModuleForm({ courseId, module, nextOrderIndex }: ModuleFormProps) {
  const isEditing = !!module
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(module?.title || '')
  const [description, setDescription] = useState(module?.description || '')
  const [orderIndex, setOrderIndex] = useState(module?.order_index ?? nextOrderIndex)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      title,
      description: description || null,
      order_index: orderIndex,
      course_id: courseId,
    }

    if (isEditing) {
      const { error } = await supabase
        .from('modules')
        .update({ title, description: description || null, order_index: orderIndex })
        .eq('id', module.id)

      if (error) {
        setMessage(`Erro: ${error.message}`)
      } else {
        setMessage('Módulo atualizado com sucesso!')
        router.refresh()
      }
    } else {
      const { error } = await supabase
        .from('modules')
        .insert(payload)

      if (error) {
        setMessage(`Erro: ${error.message}`)
      } else {
        router.push(`/admin/cursos/${courseId}`)
      }
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Título *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          placeholder="Nome do módulo"
          required
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field min-h-[80px] resize-y"
          placeholder="Descrição do módulo"
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Ordem</label>
        <input
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
          className="input-field w-24"
          min={0}
        />
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-[13px] ${message.includes('sucesso') ? 'bg-brand-green-light text-brand-green-dark' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50 text-[14px]">
        {saving ? (
          <div className="w-4 h-4 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
        ) : (
          <>
            <Save size={16} />
            {isEditing ? 'Salvar alterações' : 'Criar módulo'}
          </>
        )}
      </button>
    </form>
  )
}
