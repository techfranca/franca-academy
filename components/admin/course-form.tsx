'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'

interface CourseFormProps {
  course?: {
    id: string
    title: string
    description: string | null
    slug: string
    thumbnail_url: string | null
    kiwify_product_id: string | null
    is_active: boolean
  }
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function CourseForm({ course }: CourseFormProps) {
  const isEditing = !!course
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(course?.title || '')
  const [slug, setSlug] = useState(course?.slug || '')
  const [description, setDescription] = useState(course?.description || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnail_url || '')
  const [kiwifyProductId, setKiwifyProductId] = useState(course?.kiwify_product_id || '')
  const [isActive, setIsActive] = useState(course?.is_active ?? true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      title,
      slug,
      description: description || null,
      thumbnail_url: thumbnailUrl || null,
      kiwify_product_id: kiwifyProductId || null,
      is_active: isActive,
    }

    if (isEditing) {
      const { error } = await supabase
        .from('courses')
        .update(payload)
        .eq('id', course.id)

      if (error) {
        setMessage(`Erro: ${error.message}`)
      } else {
        setMessage('Curso atualizado com sucesso!')
        router.refresh()
      }
    } else {
      const { data, error } = await supabase
        .from('courses')
        .insert(payload)
        .select('id')
        .single()

      if (error) {
        setMessage(`Erro: ${error.message}`)
      } else {
        router.push(`/admin/cursos/${data.id}`)
      }
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Título *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          placeholder="Nome do curso"
          required
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Slug *</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="input-field flex-1 font-mono text-[12px]"
            placeholder="curso-exemplo"
            required
          />
          <button
            type="button"
            onClick={() => setSlug(generateSlug(title))}
            className="px-3 py-2 rounded-lg bg-brand-navy-light/30 text-brand-navy text-[12px] font-semibold hover:bg-brand-navy-light/50 transition-colors whitespace-nowrap"
          >
            Gerar
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field resize-none"
          rows={3}
          placeholder="Descrição do curso"
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">URL da Thumbnail</label>
        <input
          type="text"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="input-field"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Kiwify Product ID</label>
        <input
          type="text"
          value={kiwifyProductId}
          onChange={(e) => setKiwifyProductId(e.target.value)}
          className="input-field font-mono text-[12px]"
          placeholder="ID do produto na Kiwify"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer pt-0.5">
        <div className="relative inline-flex">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-brand-navy-light/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green" />
        </div>
        <span className="text-[13px] font-semibold text-brand-navy">Curso ativo</span>
      </label>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-[13px] ${message.includes('sucesso') ? 'bg-brand-green-light text-brand-green-dark' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <button type="submit" disabled={saving} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 text-[14px] w-full">
        {saving ? (
          <div className="w-4 h-4 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
        ) : (
          <>
            <Save size={16} />
            {isEditing ? 'Salvar alterações' : 'Criar curso'}
          </>
        )}
      </button>
    </form>
  )
}
