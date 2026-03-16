'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, Upload, X, FileText } from 'lucide-react'

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
    pdf_url: string | null
    pdf_name: string | null
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
  const [pdfUrl, setPdfUrl] = useState(lesson?.pdf_url || '')
  const [pdfName, setPdfName] = useState(lesson?.pdf_name || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  async function handlePdfUpload(file: File) {
    if (file.type !== 'application/pdf') {
      setMessage('Erro: Selecione um arquivo PDF.')
      return
    }
    setUploadingPdf(true)
    const path = `${lesson?.id || 'new'}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('lesson-materials')
      .upload(path, file, { upsert: true })
    if (uploadError) {
      setMessage(`Erro no upload: ${uploadError.message}`)
      setUploadingPdf(false)
      return
    }
    const { data } = supabase.storage.from('lesson-materials').getPublicUrl(path)
    setPdfUrl(data.publicUrl)
    setPdfName(file.name)
    if (isEditing) {
      await supabase.from('lessons').update({ pdf_url: data.publicUrl, pdf_name: file.name }).eq('id', lesson!.id)
      router.refresh()
    }
    setUploadingPdf(false)
  }

  async function handleRemovePdf() {
    if (!pdfUrl) return
    const url = new URL(pdfUrl)
    const pathParts = url.pathname.split('/lesson-materials/')
    if (pathParts.length > 1) {
      await supabase.storage.from('lesson-materials').remove([pathParts[1]])
    }
    setPdfUrl('')
    setPdfName('')
    if (isEditing) {
      await supabase.from('lessons').update({ pdf_url: null, pdf_name: null }).eq('id', lesson!.id)
      router.refresh()
    }
  }

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
      pdf_url: pdfUrl || null,
      pdf_name: pdfName || null,
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

          {/* PDF Material */}
          <div>
            <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Material PDF</label>
            {pdfUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-navy/10 bg-brand-green-light/40">
                <div className="w-9 h-9 rounded-lg bg-brand-green-light flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-brand-green-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-brand-navy truncate">{pdfName || 'Material.pdf'}</p>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-brand-sage hover:underline">
                    Ver arquivo
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={uploadingPdf}
                    className="p-1.5 rounded-lg hover:bg-brand-navy/5 text-brand-navy/50 hover:text-brand-navy transition-colors"
                    title="Trocar PDF"
                  >
                    <Upload size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePdf}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-brand-navy/50 hover:text-red-500 transition-colors"
                    title="Remover PDF"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                disabled={uploadingPdf}
                className="w-full h-20 rounded-xl border-2 border-dashed border-brand-navy/20 hover:border-brand-green hover:bg-brand-green-light/40 flex items-center justify-center gap-3 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {uploadingPdf ? (
                  <div className="w-5 h-5 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
                ) : (
                  <>
                    <FileText size={18} className="text-brand-navy/40" />
                    <span className="text-[13px] text-brand-navy/50 font-medium">Clique para enviar PDF</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handlePdfUpload(file)
                e.target.value = ''
              }}
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
