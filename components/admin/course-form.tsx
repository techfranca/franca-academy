'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, Upload, X, ImageIcon } from 'lucide-react'

interface CourseFormProps {
  course?: {
    id: string
    title: string
    description: string | null
    slug: string
    thumbnail_url: string | null
    kiwify_product_id: string | null
    is_active: boolean
    price: number | null
    checkout_url: string | null
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
  const [price, setPrice] = useState<string>(course?.price?.toString() || '')
  const [checkoutUrl, setCheckoutUrl] = useState(course?.checkout_url || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      setMessage('Erro: Selecione um arquivo de imagem.')
      return
    }
    setUploadingImage(true)
    const ext = file.name.split('.').pop()
    const path = `${course?.id || 'new'}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('course-covers')
      .upload(path, file, { upsert: true })
    if (uploadError) {
      setMessage(`Erro no upload: ${uploadError.message}`)
      setUploadingImage(false)
      return
    }
    const { data } = supabase.storage.from('course-covers').getPublicUrl(path)
    setThumbnailUrl(data.publicUrl)
    // If editing, save immediately
    if (isEditing) {
      await supabase.from('courses').update({ thumbnail_url: data.publicUrl }).eq('id', course.id)
      router.refresh()
    }
    setUploadingImage(false)
  }

  async function handleRemoveImage() {
    if (!thumbnailUrl) return
    // Extract path from URL to delete from storage
    const url = new URL(thumbnailUrl)
    const pathParts = url.pathname.split('/course-covers/')
    if (pathParts.length > 1) {
      await supabase.storage.from('course-covers').remove([pathParts[1]])
    }
    setThumbnailUrl('')
    if (isEditing) {
      await supabase.from('courses').update({ thumbnail_url: null }).eq('id', course.id)
      router.refresh()
    }
  }

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
      price: price ? parseFloat(price) : null,
      checkout_url: checkoutUrl || null,
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

      {/* Thumbnail upload */}
      <div>
        <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Capa do curso</label>
        {thumbnailUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-brand-navy/10">
            <img src={thumbnailUrl} alt="Capa" className="w-full h-40 object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
              title="Remover imagem"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="w-full h-32 rounded-xl border-2 border-dashed border-brand-navy/20 hover:border-brand-green hover:bg-brand-green-light/40 flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {uploadingImage ? (
              <div className="w-5 h-5 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-brand-navy-light/20 flex items-center justify-center">
                  <ImageIcon size={16} className="text-brand-navy/50" />
                </div>
                <span className="text-[12px] text-brand-navy/50 font-medium">Clique para enviar imagem</span>
                <span className="text-[11px] text-brand-navy/30">PNG, JPG, WEBP</span>
              </>
            )}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleImageUpload(file)
            e.target.value = ''
          }}
        />
        {thumbnailUrl && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="mt-2 flex items-center gap-1.5 text-[12px] text-brand-navy/50 hover:text-brand-navy transition-colors disabled:opacity-50"
          >
            <Upload size={12} />
            {uploadingImage ? 'Enviando...' : 'Trocar imagem'}
          </button>
        )}
      </div>

      {/* Price + checkout */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Preço (R$)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-field"
            placeholder="197,00"
            min={0}
            step={0.01}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">URL do Checkout</label>
          <input
            type="text"
            value={checkoutUrl}
            onChange={(e) => setCheckoutUrl(e.target.value)}
            className="input-field"
            placeholder="https://kiwify.app/..."
          />
        </div>
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
