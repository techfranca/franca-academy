'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'

interface LessonFormProps {
  moduleId: string
  courseId: string
  lesson?: {
    id: string
    title: string
    description: string | null
    video_id: string | null
    video_url: string | null
    duration_seconds: number | null
    order_index: number
    is_free: boolean
  }
  nextOrderIndex: number
}

function formatDuration(seconds: number | null) {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function LessonForm({ moduleId, courseId, lesson, nextOrderIndex }: LessonFormProps) {
  const isEditing = !!lesson
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(lesson?.title || '')
  const [description, setDescription] = useState(lesson?.description || '')
  const [videoId, setVideoId] = useState(lesson?.video_id || '')
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url || '')
  const [durationSeconds, setDurationSeconds] = useState<number | ''>(lesson?.duration_seconds ?? '')
  const [orderIndex, setOrderIndex] = useState(lesson?.order_index ?? nextOrderIndex)
  const [isFree, setIsFree] = useState(lesson?.is_free ?? false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      title,
      description: description || null,
      video_id: videoId || null,
      video_url: videoUrl || null,
      duration_seconds: durationSeconds || null,
      order_index: orderIndex,
      is_free: isFree,
      module_id: moduleId,
    }

    if (isEditing) {
      const { module_id, ...updatePayload } = payload
      const { error } = await supabase
        .from('lessons')
        .update(updatePayload)
        .eq('id', lesson.id)

      if (error) {
        setMessage(`Erro: ${error.message}`)
      } else {
        setMessage('Aula atualizada com sucesso!')
        router.refresh()
      }
    } else {
      const { error } = await supabase
        .from('lessons')
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
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-start">

        {/* ── Left: content fields ── */}
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Nome da aula"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="Descrição da aula (opcional)"
            />
          </div>
        </div>

        {/* ── Right: video & metadata ── */}
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Bunny Video ID</label>
            <input
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              className="input-field font-mono text-[12px]"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
            <p className="text-[11px] text-brand-navy/55 mt-1">
              Copie do dashboard do Bunny Stream.
            </p>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">
              URL alternativa
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="input-field"
              placeholder="https://..."
            />
            <p className="text-[11px] text-brand-navy/55 mt-1">
              Só se não usar Bunny Video ID.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Duração (s)</label>
              <input
                type="number"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(e.target.value ? parseInt(e.target.value) : '')}
                className="input-field"
                placeholder="300"
                min={0}
              />
              {durationSeconds && (
                <p className="text-[11px] text-brand-sage mt-1 font-semibold">
                  {formatDuration(durationSeconds as number)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Ordem</label>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                className="input-field"
                min={0}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative inline-flex">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-brand-navy-light/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green" />
            </div>
            <span className="text-[13px] font-semibold text-brand-navy">Aula gratuita</span>
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
                {isEditing ? 'Salvar alterações' : 'Criar aula'}
              </>
            )}
          </button>
        </div>

      </div>
    </form>
  )
}
