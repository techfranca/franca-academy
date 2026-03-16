import { requireAdmin } from '@/lib/admin'
import { LessonForm } from '@/components/admin/lesson-form'
import { DeleteButton } from '@/components/admin/delete-button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
  params: { courseId: string; moduleId: string; lessonId: string }
}

export default async function EditLessonPage({ params }: Props) {
  const { supabase } = await requireAdmin()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', params.courseId)
    .single()

  if (!course) notFound()

  const { data: module } = await supabase
    .from('modules')
    .select('id, title')
    .eq('id', params.moduleId)
    .single()

  if (!module) notFound()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, description, video_id, video_url, duration_seconds, order_index, is_free, pdf_url, pdf_name')
    .eq('id', params.lessonId)
    .single()

  if (!lesson) notFound()

  return (
    <div>
      <Link
        href={`/admin/cursos/${course.id}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-navy/60 hover:text-brand-navy transition-colors mb-4"
      >
        <ArrowLeft size={14} />
        Voltar a {course.title}
      </Link>

      <div className="mb-8">
        <h1 className="page-title mb-1">Editar Aula</h1>
        <p className="page-subtitle">{module.title} — {lesson.title}</p>
      </div>

      <div className="card-static p-5 sm:p-8 mb-6">
        <LessonForm
          moduleId={module.id}
          courseId={course.id}
          lesson={lesson}
          nextOrderIndex={lesson.order_index}
        />
      </div>

      <div className="card-static p-5 border-red-200">
        <h3 className="text-[14px] font-semibold text-red-600 mb-3">Zona de perigo</h3>
        <DeleteButton
          table="lessons"
          id={lesson.id}
          redirectTo={`/admin/cursos/${course.id}`}
          label="Excluir aula"
        />
      </div>
    </div>
  )
}
