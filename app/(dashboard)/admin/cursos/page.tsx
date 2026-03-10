import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

export default async function AdminCoursesPage() {
  const { supabase } = await requireAdmin()

  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id, title, slug, is_active, thumbnail_url, created_at,
      modules ( id, lessons ( id ) )
    `)
    .order('created_at', { ascending: false })

  const items = (courses || []).map((c) => {
    const modulesCount = c.modules?.length || 0
    const lessonsCount = c.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0
    return { ...c, modulesCount, lessonsCount }
  })

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title mb-1">Gerenciar Cursos</h1>
          <p className="page-subtitle">{items.length} curso{items.length !== 1 ? 's' : ''} cadastrado{items.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/cursos/novo" className="btn-primary flex items-center gap-2 text-[14px]">
          <Plus size={16} />
          Novo Curso
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card-static p-12 text-center">
          <p className="text-[15px] text-brand-navy/65">Nenhum curso cadastrado ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((course) => (
            <Link
              key={course.id}
              href={`/admin/cursos/${course.id}`}
              className="card group hover:shadow-md transition-all duration-200 block"
            >
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold text-brand-navy truncate group-hover:text-brand-green-dark transition-colors">
                      {course.title}
                    </h3>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      course.is_active
                        ? 'bg-brand-green-light text-brand-green-dark'
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {course.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-[12px] text-brand-navy/65 font-medium">
                    {course.modulesCount} módulo{course.modulesCount !== 1 ? 's' : ''} · {course.lessonsCount} aula{course.lessonsCount !== 1 ? 's' : ''}
                    <span className="mx-2">·</span>
                    <span className="text-brand-navy/50">/{course.slug}</span>
                  </p>
                </div>
                <Pencil size={16} className="text-brand-navy/50 group-hover:text-brand-green-dark transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
