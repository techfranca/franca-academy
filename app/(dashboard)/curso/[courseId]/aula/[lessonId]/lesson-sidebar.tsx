'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { toast } from 'sonner'

interface LessonSidebarProps {
  lessonId: string
  courseId: string
  isCompleted: boolean
  isFavorited: boolean
  nextLessonId?: string
  prevLessonId?: string
}

export function LessonSidebar({
  lessonId,
  courseId,
  isCompleted,
  isFavorited,
  nextLessonId,
  prevLessonId,
}: LessonSidebarProps) {
  const [completed, setCompleted] = useState(isCompleted)
  const [favorited, setFavorited] = useState(isFavorited)
  const [loading, setLoading] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function toggleComplete() {
    setLoading(true)

    if (completed) {
      const { error } = await supabase
        .from('lesson_progress')
        .update({ completed: false, completed_at: null })
        .eq('lesson_id', lessonId)

      if (error) {
        toast.error('Erro ao atualizar progresso. Tente novamente.')
      } else {
        setCompleted(false)
        router.refresh()
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user!.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,lesson_id',
        })

      if (error) {
        toast.error('Erro ao marcar aula como concluída. Tente novamente.')
      } else {
        setCompleted(true)
        router.refresh()
      }
    }

    setLoading(false)
  }

  async function toggleFavorite() {
    setFavLoading(true)

    if (favorited) {
      const { error } = await supabase
        .from('lesson_favorites')
        .delete()
        .eq('lesson_id', lessonId)

      if (error) {
        toast.error('Erro ao remover dos favoritos. Tente novamente.')
      } else {
        setFavorited(false)
        router.refresh()
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('lesson_favorites')
        .insert({
          user_id: user!.id,
          lesson_id: lessonId,
        })

      if (error) {
        toast.error('Erro ao adicionar aos favoritos. Tente novamente.')
      } else {
        setFavorited(true)
        router.refresh()
      }
    }

    setFavLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-brand-navy-light/30">
      {/* Mark complete + Favorite */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={toggleComplete}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg font-montserrat text-body-small font-semibold transition-all duration-200 ${
            completed
              ? 'bg-brand-green-light text-brand-green-dark border-2 border-brand-green'
              : 'bg-brand-navy-light/50 text-brand-navy hover:bg-brand-green-light hover:text-brand-green-dark border-2 border-transparent'
          }`}
        >
          <CheckCircle2 size={18} />
          {completed ? 'Aula concluída' : 'Marcar como concluída'}
        </button>
        <button
          onClick={toggleFavorite}
          disabled={favLoading}
          className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-200 border-2 ${
            favorited
              ? 'bg-red-50 text-red-500 border-red-300 hover:bg-red-100'
              : 'bg-brand-navy-light/50 text-brand-navy-light-active border-transparent hover:bg-red-50 hover:text-red-400 hover:border-red-200'
          }`}
          aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        {prevLessonId && (
          <a
            href={`/curso/${courseId}/aula/${prevLessonId}`}
            className="flex items-center gap-1 px-4 min-h-[44px] rounded-lg text-body-small font-semibold text-brand-navy-light-active hover:text-brand-navy hover:bg-brand-navy-light/30 transition-colors"
          >
            <ChevronLeft size={16} />
            Anterior
          </a>
        )}
        {nextLessonId && (
          <a
            href={`/curso/${courseId}/aula/${nextLessonId}`}
            className="btn-primary flex items-center gap-1 !py-2.5 text-body-small"
          >
            Próxima
            <ChevronRight size={16} />
          </a>
        )}
      </div>
    </div>
  )
}
