import { requireAdmin } from '@/lib/admin'
import { CourseForm } from '@/components/admin/course-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewCoursePage() {
  await requireAdmin()

  return (
    <div>
      <Link
        href="/admin/cursos"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-navy/60 hover:text-brand-navy transition-colors mb-4"
      >
        <ArrowLeft size={14} />
        Voltar aos cursos
      </Link>

      <div className="mb-8">
        <h1 className="page-title mb-1">Novo Curso</h1>
        <p className="page-subtitle">Preencha as informações do curso.</p>
      </div>

      <div className="card-static p-5 sm:p-8">
        <CourseForm />
      </div>
    </div>
  )
}
