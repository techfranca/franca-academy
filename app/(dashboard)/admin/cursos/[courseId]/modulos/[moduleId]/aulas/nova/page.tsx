import { requireAdmin } from '@/lib/admin'
import { LessonForm } from '@/components/admin/lesson-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
  params: { courseId: string; moduleId: string }
}

export default async function NewLessonPage({ params }: Props) {
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

  const { data: lessons } = await supabase
    .from('lessons')
    .select('order_index')
    .eq('module_id', params.moduleId)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrderIndex = lessons && lessons.length > 0 ? lessons[0].order_index + 1 : 1

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
        <h1 className="page-title mb-1">Nova Aula</h1>
        <p className="page-subtitle">{module.title}</p>
      </div>

      <div className="card-static p-5 sm:p-8">
        <LessonForm
          moduleId={module.id}
          courseId={course.id}
          nextOrderIndex={nextOrderIndex}
        />
      </div>
    </div>
  )
}
