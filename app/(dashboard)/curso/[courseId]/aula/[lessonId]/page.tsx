import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getBunnyEmbedUrl } from '@/lib/bunny'
import { VideoPlayer } from '@/components/video-player'
import { LessonSidebar } from './lesson-sidebar'
import { LessonListCollapsible } from './lesson-list-collapsible'
import Link from 'next/link'
import { ArrowLeft, FileText, Download } from 'lucide-react'

interface Props {
  params: { courseId: string; lessonId: string }
}

export default async function LessonPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: purchase } = await supabase
    .from('user_purchases')
    .select('id')
    .eq('user_id', user!.id)
    .eq('course_id', params.courseId)
    .single()

  if (!purchase) redirect('/cursos')

  const { data: lesson } = await supabase
    .from('lessons')
    .select(`
      id, title, description, video_url, video_id, duration_seconds, order_index, module_id, pdf_url, pdf_name,
      modules!inner ( id, title, order_index, course_id )
    `)
    .eq('id', params.lessonId)
    .single()

  if (!lesson || (lesson.modules as any).course_id !== params.courseId) notFound()

  const { data: course } = await supabase
    .from('courses')
    .select(`
      id, title,
      modules ( id, title, order_index, lessons ( id, title, duration_seconds, order_index ) )
    `)
    .eq('id', params.courseId)
    .single()

  const sortedModules = (course?.modules || [])
    .sort((a, b) => a.order_index - b.order_index)
    .map(mod => ({
      ...mod,
      lessons: (mod.lessons || []).sort((a, b) => a.order_index - b.order_index),
    }))

  const allLessonIds = sortedModules.flatMap(m => m.lessons.map(l => l.id))
  const { data: progressData } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', user!.id)
    .in('lesson_id', allLessonIds.length > 0 ? allLessonIds : ['none'])

  const completedSet = new Set(
    (progressData || []).filter(p => p.completed).map(p => p.lesson_id)
  )

  const { data: favorite } = await supabase
    .from('lesson_favorites')
    .select('id')
    .eq('user_id', user!.id)
    .eq('lesson_id', params.lessonId)
    .maybeSingle()

  const flatLessons = sortedModules.flatMap(m => m.lessons)
  const currentIndex = flatLessons.findIndex(l => l.id === params.lessonId)
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null

  const embedUrl = lesson.video_id
    ? getBunnyEmbedUrl({ videoId: lesson.video_id })
    : lesson.video_url || ''

  return (
    <div className="flex flex-col xl:flex-row gap-0 -m-4 sm:-m-6 lg:-m-8 xl:-m-10">
      {/* Main content */}
      <div className="flex-1 xl:max-w-[calc(100%-340px)]">
        <div className="p-4 sm:p-6 lg:p-8">
          <Link
            href={`/curso/${params.courseId}`}
            className="inline-flex items-center gap-1.5 text-[13px] text-brand-navy-light-active hover:text-brand-navy transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Voltar ao curso
          </Link>

          {embedUrl ? (
            <VideoPlayer embedUrl={embedUrl} title={lesson.title} />
          ) : (
            <div className="relative w-full rounded-2xl bg-gradient-to-br from-brand-navy to-brand-navy-dark flex items-center justify-center overflow-hidden" style={{ paddingTop: '56.25%' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <p className="text-[14px] text-white/60">Vídeo em breve</p>
              </div>
            </div>
          )}

          <div className="mt-5">
            <p className="text-[12px] font-semibold text-brand-sage uppercase tracking-wider mb-1">
              {(lesson.modules as any).title}
            </p>
            <h1 className="font-poppins text-[22px] sm:text-[26px] font-bold text-brand-navy mb-3">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-[14px] text-brand-navy-light-active leading-relaxed">{lesson.description}</p>
            )}
          </div>

          {(lesson as any).pdf_url && (
            <div className="mt-5">
              <h2 className="text-[13px] font-semibold text-brand-navy uppercase tracking-wider mb-3">Material de apoio</h2>
              <a
                href={(lesson as any).pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-3 p-4 rounded-xl border border-brand-navy/10 bg-brand-green-light/60 hover:bg-brand-green-light transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <FileText size={18} className="text-brand-green-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-brand-navy truncate">
                    {(lesson as any).pdf_name || 'Material da aula'}
                  </p>
                  <p className="text-[12px] text-brand-navy/50">Clique para baixar o PDF</p>
                </div>
                <Download size={16} className="text-brand-sage group-hover:text-brand-green-dark transition-colors flex-shrink-0" />
              </a>
            </div>
          )}

          <LessonSidebar
            lessonId={params.lessonId}
            courseId={params.courseId}
            isCompleted={completedSet.has(params.lessonId)}
            isFavorited={!!favorite}
            nextLessonId={nextLesson?.id}
            prevLessonId={prevLesson?.id}
          />
        </div>
      </div>

      {/* Sidebar - lesson list */}
      <LessonListCollapsible subtitle={`${completedSet.size}/${flatLessons.length} aulas concluídas`}>
        <div>
          {sortedModules.map((mod, modIndex) => (
            <div key={mod.id}>
              <div className="px-4 py-2.5 bg-[#f7faf8] border-b border-black/[0.04]">
                <p className="text-[12px] font-semibold text-brand-navy">
                  <span className="text-brand-sage">M{modIndex + 1}</span> {mod.title}
                </p>
              </div>
              {mod.lessons.map((l) => {
                const isActive = l.id === params.lessonId
                const isCompleted = completedSet.has(l.id)
                return (
                  <a
                    key={l.id}
                    href={`/curso/${params.courseId}/aula/${l.id}`}
                    className={`flex items-center gap-3 px-4 py-3 min-h-[48px] text-[13px] border-b border-black/[0.03] transition-colors ${
                      isActive ? 'bg-brand-green-light border-l-[3px] border-l-brand-green' : 'hover:bg-[#f7faf8]'
                    }`}
                  >
                    {isCompleted ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5ea86a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#7de08d' : '#b2b6c0'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
                      </svg>
                    )}
                    <span className={`flex-1 truncate ${isActive ? 'font-semibold text-brand-navy' : isCompleted ? 'text-brand-navy-light-active' : 'text-brand-navy'}`}>
                      {l.title}
                    </span>
                  </a>
                )
              })}
            </div>
          ))}
        </div>
      </LessonListCollapsible>
    </div>
  )
}
