import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlayCircle, Clock, CheckCircle2 } from 'lucide-react'
import { ProgressBar } from '@/components/progress-bar'
import { formatDuration } from '@/lib/utils'

interface Props {
  params: { courseId: string }
}

export default async function CourseDetailPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check purchase
  const { data: purchase } = await supabase
    .from('user_purchases')
    .select('id')
    .eq('user_id', user!.id)
    .eq('course_id', params.courseId)
    .single()

  if (!purchase) {
    redirect('/cursos')
  }

  // Fetch course with modules and lessons
  const { data: course } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      modules (
        id,
        title,
        description,
        order_index,
        lessons (
          id,
          title,
          description,
          duration_seconds,
          order_index,
          is_free
        )
      )
    `)
    .eq('id', params.courseId)
    .single()

  if (!course) notFound()

  // Sort modules and lessons
  const sortedModules = (course.modules || [])
    .sort((a, b) => a.order_index - b.order_index)
    .map(mod => ({
      ...mod,
      lessons: (mod.lessons || []).sort((a, b) => a.order_index - b.order_index),
    }))

  // Fetch progress
  const allLessonIds = sortedModules.flatMap(m => m.lessons.map(l => l.id))
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', user!.id)
    .in('lesson_id', allLessonIds.length > 0 ? allLessonIds : ['none'])

  const completedSet = new Set(
    (progress || []).filter(p => p.completed).map(p => p.lesson_id)
  )

  const totalLessons = allLessonIds.length
  const completedLessons = allLessonIds.filter(id => completedSet.has(id)).length
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Find first incomplete lesson for "Continue" button
  let continueLesson: { id: string; moduleIndex: number } | null = null
  for (const mod of sortedModules) {
    for (const lesson of mod.lessons) {
      if (!completedSet.has(lesson.id)) {
        continueLesson = { id: lesson.id, moduleIndex: mod.order_index }
        break
      }
    }
    if (continueLesson) break
  }

  // If all completed, go to first lesson
  if (!continueLesson && sortedModules.length > 0 && sortedModules[0].lessons.length > 0) {
    continueLesson = {
      id: sortedModules[0].lessons[0].id,
      moduleIndex: sortedModules[0].order_index,
    }
  }

  return (
    <div>
      {/* Back */}
      <Link
        href="/cursos"
        className="inline-flex items-center gap-2 text-body-small text-brand-navy-light-active hover:text-brand-navy transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Voltar aos cursos
      </Link>

      {/* Course Header */}
      <div className="card p-6 lg:p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Thumbnail */}
          {course.thumbnail_url && (
            <div className="w-full lg:w-80 h-44 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <h1 className="font-poppins text-[22px] sm:text-[28px] lg:text-heading-2 text-brand-navy mb-3">
              {course.title}
            </h1>
            {course.description && (
              <p className="text-body text-brand-navy-light-active mb-6">
                {course.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6 text-body-small text-brand-navy-light-active">
              <span className="flex items-center gap-1.5">
                <PlayCircle size={16} />
                {totalLessons} aulas
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-brand-green-dark" />
                {completedLessons} concluídas
              </span>
            </div>

            <div className="max-w-md">
              <ProgressBar progress={overallProgress} />
            </div>

            {continueLesson && (
              <Link
                href={`/curso/${params.courseId}/aula/${continueLesson.id}`}
                className="btn-primary inline-flex items-center gap-2 mt-6"
              >
                <PlayCircle size={20} />
                {completedLessons === 0 ? 'Começar Curso' : 'Continuar'}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {sortedModules.map((mod, modIndex) => {
          const modCompleted = mod.lessons.filter(l => completedSet.has(l.id)).length
          const modTotal = mod.lessons.length

          return (
            <div key={mod.id} className="card overflow-hidden">
              {/* Module header */}
              <div className="px-6 py-4 bg-brand-navy-light/30 border-b border-brand-navy-light/50">
                <div className="flex items-center justify-between">
                  <h2 className="font-poppins text-callout text-brand-navy">
                    <span className="text-brand-green-dark mr-2">
                      Módulo {modIndex + 1}
                    </span>
                    {mod.title}
                  </h2>
                  <span className="text-body-small text-brand-navy-light-active">
                    {modCompleted}/{modTotal}
                  </span>
                </div>
                {mod.description && (
                  <p className="text-body-small text-brand-navy-light-active mt-1">
                    {mod.description}
                  </p>
                )}
              </div>

              {/* Lessons */}
              <div className="divide-y divide-brand-navy-light/30">
                {mod.lessons.map((lesson, lessonIndex) => {
                  const isCompleted = completedSet.has(lesson.id)
                  return (
                    <Link
                      key={lesson.id}
                      href={`/curso/${params.courseId}/aula/${lesson.id}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-brand-green-light/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 size={20} className="text-brand-green-dark" />
                        ) : (
                          <PlayCircle size={20} className="text-brand-navy-light-active" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-body-small ${isCompleted ? 'text-brand-navy-light-active' : 'text-brand-navy'}`}>
                          <span className="text-brand-navy-light-active mr-2">
                            {modIndex + 1}.{lessonIndex + 1}
                          </span>
                          {lesson.title}
                        </p>
                      </div>
                      {lesson.duration_seconds && (
                        <span className="text-body-small text-brand-navy-light-active flex items-center gap-1 flex-shrink-0">
                          <Clock size={14} />
                          {formatDuration(lesson.duration_seconds)}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
