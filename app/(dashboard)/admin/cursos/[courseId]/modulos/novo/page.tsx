import { requireAdmin } from '@/lib/admin'
import { ModuleForm } from '@/components/admin/module-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
  params: { courseId: string }
}

export default async function NewModulePage({ params }: Props) {
  const { supabase } = await requireAdmin()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', params.courseId)
    .single()

  if (!course) notFound()

  const { data: modules } = await supabase
    .from('modules')
    .select('order_index')
    .eq('course_id', params.courseId)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrderIndex = modules && modules.length > 0 ? modules[0].order_index + 1 : 1

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
        <h1 className="page-title mb-1">Novo Módulo</h1>
        <p className="page-subtitle">{course.title}</p>
      </div>

      <div className="card-static p-5 sm:p-8">
        <ModuleForm courseId={course.id} nextOrderIndex={nextOrderIndex} />
      </div>
    </div>
  )
}
