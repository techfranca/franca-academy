import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'
import { BookOpen, Layers, PlayCircle, Users, Plus } from 'lucide-react'

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin()

  const [
    { count: coursesCount },
    { count: modulesCount },
    { count: lessonsCount },
    { count: usersCount },
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('modules').select('*', { count: 'exact', head: true }),
    supabase.from('lessons').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Cursos', count: coursesCount || 0, icon: BookOpen, color: 'text-brand-green-dark', bg: 'bg-brand-green-light' },
    { label: 'Módulos', count: modulesCount || 0, icon: Layers, color: 'text-brand-sage', bg: 'bg-brand-green-light' },
    { label: 'Aulas', count: lessonsCount || 0, icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Alunos', count: usersCount || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="page-title mb-1">Painel Admin</h1>
          <p className="page-subtitle">Gerencie cursos, módulos e aulas.</p>
        </div>
        <Link href="/admin/cursos/novo" className="btn-primary flex items-center gap-2 text-[14px]">
          <Plus size={16} />
          Novo Curso
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card-static p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <p className="text-[26px] font-poppins font-bold text-brand-navy">{stat.count}</p>
            <p className="text-[13px] text-brand-navy/60 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card-static p-5">
        <h2 className="font-poppins text-[17px] font-semibold text-brand-navy mb-3">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/cursos" className="btn-secondary text-[13px] flex items-center gap-2">
            <BookOpen size={15} />
            Ver todos os cursos
          </Link>
          <Link href="/admin/cursos/novo" className="btn-secondary text-[13px] flex items-center gap-2">
            <Plus size={15} />
            Criar novo curso
          </Link>
        </div>
      </div>
    </div>
  )
}
