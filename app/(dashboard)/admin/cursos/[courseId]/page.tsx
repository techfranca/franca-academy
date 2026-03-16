import { requireAdmin } from '@/lib/admin'
import { CourseForm } from '@/components/admin/course-form'
import { DeleteButton } from '@/components/admin/delete-button'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, PlayCircle } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
  params: { courseId: string }
}

export default async function EditCoursePage({ params }: Props) {
  const { supabase } = await requireAdmin()

  const { data: course } = await supabase
    .from('courses')
    .select(`
      id, title, description, slug, thumbnail_url, kiwify_product_id, is_active, price, checkout_url,
      modules (
        id, title, description, order_index,
        lessons ( id, title, video_id, duration_seconds, order_index, is_free )
      )
    `)
    .eq('id', params.courseId)
    .single()

  if (!course) notFound()

  const sortedModules = (course.modules || [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((mod) => ({
      ...mod,
      lessons: (mod.lessons || []).sort((a, b) => a.order_index - b.order_index),
    }))

  function formatDuration(seconds: number | null) {
    if (!seconds) return ''
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const totalLessons = sortedModules.reduce((s, m) => s + m.lessons.length, 0)

  return (
    <div>
      <Link
        href="/admin/cursos"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-navy/60 hover:text-brand-navy transition-colors mb-4"
      >
        <ArrowLeft size={14} />
        Voltar aos cursos
      </Link>

      <div className="mb-6">
        <h1 className="page-title mb-1">Editar Curso</h1>
        <p className="page-subtitle">{course.title}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 xl:gap-8 items-start">

        {/* ── Left: Modules & Lessons ── */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-poppins text-[17px] font-semibold text-brand-navy">Módulos e Aulas</h2>
              <p className="text-[12px] text-brand-navy/60 font-medium mt-0.5">
                {sortedModules.length} módulo{sortedModules.length !== 1 ? 's' : ''} · {totalLessons} aula{totalLessons !== 1 ? 's' : ''}
              </p>
            </div>
            <Link
              href={`/admin/cursos/${course.id}/modulos/novo`}
              className="btn-primary flex items-center gap-2 text-[13px]"
            >
              <Plus size={14} />
              Novo Módulo
            </Link>
          </div>

          {sortedModules.length === 0 ? (
            <div className="card-static p-10 text-center">
              <p className="text-[14px] text-brand-navy/60 mb-3">Nenhum módulo ainda.</p>
              <Link
                href={`/admin/cursos/${course.id}/modulos/novo`}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-green-dark hover:underline"
              >
                <Plus size={14} />
                Criar primeiro módulo
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedModules.map((mod, modIndex) => (
                <div key={mod.id} className="card-static overflow-hidden">
                  {/* Module header */}
                  <div className="px-4 py-3 bg-[#f4f8f5] border-b border-black/[0.05] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-sage/20 flex items-center justify-center text-[11px] font-bold text-brand-sage">
                        {modIndex + 1}
                      </span>
                      <h3 className="text-[14px] font-semibold text-brand-navy truncate">{mod.title}</h3>
                      <span className="flex-shrink-0 text-[11px] font-medium text-brand-navy/55">
                        {mod.lessons.length} aula{mod.lessons.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <Link
                      href={`/admin/cursos/${course.id}/modulos/${mod.id}`}
                      className="flex-shrink-0 flex items-center gap-1 min-h-[44px] px-2 text-[12px] font-medium text-brand-navy/60 hover:text-brand-navy transition-colors"
                    >
                      <Pencil size={12} />
                      Editar
                    </Link>
                  </div>

                  {/* Lessons */}
                  {mod.lessons.length > 0 && (
                    <div>
                      {mod.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/admin/cursos/${course.id}/modulos/${mod.id}/aulas/${lesson.id}`}
                          className="flex items-center gap-3 px-4 py-3 min-h-[48px] border-b border-black/[0.03] hover:bg-[#f7faf8] transition-colors group"
                        >
                          <PlayCircle size={14} className="text-brand-navy/40 flex-shrink-0" />
                          <span className="flex-1 text-[13px] text-brand-navy truncate group-hover:text-brand-green-dark transition-colors">
                            {lesson.title}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {lesson.is_free && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600">
                                Grátis
                              </span>
                            )}
                            {lesson.video_id && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-green-light text-brand-green-dark">
                                ▶
                              </span>
                            )}
                            {lesson.duration_seconds && (
                              <span className="text-[11px] font-medium text-brand-navy/55 tabular-nums">
                                {formatDuration(lesson.duration_seconds)}
                              </span>
                            )}
                            <Pencil size={11} className="text-brand-navy/35 group-hover:text-brand-navy/70 transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Add lesson */}
                  <div className="px-3 py-2">
                    <Link
                      href={`/admin/cursos/${course.id}/modulos/${mod.id}/aulas/nova`}
                      className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-lg text-[12px] font-medium text-brand-navy/65 hover:text-brand-navy hover:bg-brand-navy-light/15 transition-colors"
                    >
                      <Plus size={13} />
                      Nova Aula
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Course form + Danger zone (sticky) ── */}
        <div className="xl:sticky xl:top-6 xl:max-h-[calc(100vh-4rem)] xl:overflow-y-auto space-y-4">
          <div className="card-static p-6">
            <h2 className="font-poppins text-[15px] font-semibold text-brand-navy mb-5">
              Informações do Curso
            </h2>
            <CourseForm course={course} />
          </div>

          <div className="card-static p-6 border-red-100">
            <h3 className="text-[13px] font-semibold text-red-500 mb-2">Zona de perigo</h3>
            <p className="text-[12px] text-brand-navy/60 mb-4">
              Excluir o curso remove também todos os módulos e aulas associados.
            </p>
            <DeleteButton
              table="courses"
              id={course.id}
              redirectTo="/admin/cursos"
              label="Excluir curso"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
