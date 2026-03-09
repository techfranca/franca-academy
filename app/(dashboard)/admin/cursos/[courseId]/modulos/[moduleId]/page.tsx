import { requireAdmin } from '@/lib/admin'
import { ModuleForm } from '@/components/admin/module-form'
import { DeleteButton } from '@/components/admin/delete-button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
  params: { courseId: string; moduleId: string }
}

export default async function EditModulePage({ params }: Props) {
  const { supabase } = await requireAdmin()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', params.courseId)
    .single()

  if (!course) notFound()

  const { data: module } = await supabase
    .from('modules')
    .select('id, title, description, order_index')
    .eq('id', params.moduleId)
    .single()

  if (!module) notFound()

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
        <h1 className="page-title mb-1">Editar Módulo</h1>
        <p className="page-subtitle">{module.title}</p>
      </div>

      <div className="card-static p-5 sm:p-8 mb-6">
        <ModuleForm courseId={course.id} module={module} nextOrderIndex={module.order_index} />
      </div>

      <div className="card-static p-5 border-red-200">
        <h3 className="text-[14px] font-semibold text-red-600 mb-3">Zona de perigo</h3>
        <p className="text-[12px] text-brand-navy/60 mb-3">
          Excluir o módulo remove também todas as aulas associadas.
        </p>
        <DeleteButton
          table="modules"
          id={module.id}
          redirectTo={`/admin/cursos/${course.id}`}
          label="Excluir módulo"
        />
      </div>
    </div>
  )
}
