import { createClient } from '@/lib/supabase/server'
import { Heart, Play } from 'lucide-react'
import Link from 'next/link'

export default async function FavoritesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: favorites } = await supabase
    .from('lesson_favorites')
    .select(`
      id, created_at,
      lessons!inner (
        id, title, duration_seconds,
        modules!inner (
          id, title, order_index,
          courses!inner ( id, title )
        )
      )
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const items = (favorites || []).map((fav: any) => ({
    favoriteId: fav.id,
    lessonId: fav.lessons.id,
    lessonTitle: fav.lessons.title,
    durationSeconds: fav.lessons.duration_seconds,
    moduleTitle: fav.lessons.modules.title,
    courseId: fav.lessons.modules.courses.id,
    courseTitle: fav.lessons.modules.courses.title,
  }))

  function formatDuration(seconds: number | null) {
    if (!seconds) return null
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title mb-1">Aulas Favoritas</h1>
        <p className="page-subtitle">Suas aulas salvas para acesso rápido.</p>
      </div>

      {items.length === 0 ? (
        <div className="card-static p-12 sm:p-16 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-red-400" />
          </div>
          <p className="text-[15px] text-brand-navy-light-active">
            Nenhuma aula favoritada ainda.
          </p>
          <p className="text-[13px] text-brand-navy-light-active/60 mt-1">
            Favorite aulas nos seus cursos para encontrá-las aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item) => (
            <Link
              key={item.favoriteId}
              href={`/curso/${item.courseId}/aula/${item.lessonId}`}
              className="card group hover:shadow-md transition-all duration-200"
            >
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-green-light flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green/20 transition-colors">
                    <Play size={18} className="text-brand-green-dark ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-brand-navy truncate group-hover:text-brand-green-dark transition-colors">
                      {item.lessonTitle}
                    </h3>
                    <p className="text-[12px] text-brand-sage mt-0.5 truncate">
                      {item.moduleTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] text-brand-navy-light-active/60 bg-brand-navy-light/30 px-2 py-0.5 rounded-full truncate">
                        {item.courseTitle}
                      </span>
                      {item.durationSeconds && (
                        <span className="text-[11px] text-brand-navy-light-active/60">
                          {formatDuration(item.durationSeconds)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Heart size={16} className="text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
