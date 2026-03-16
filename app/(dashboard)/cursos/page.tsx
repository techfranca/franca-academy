import { createClient } from '@/lib/supabase/server'
import { CourseCard } from '@/components/course-card'
import { BookOpen } from 'lucide-react'

export default async function CoursesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id, title, description, thumbnail_url, slug, price, checkout_url,
      modules ( id, lessons ( id ) )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const { data: purchases } = await supabase
    .from('user_purchases')
    .select('course_id')
    .eq('user_id', user!.id)

  const purchasedCourseIds = new Set(purchases?.map(p => p.course_id) || [])

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', user!.id)
    .eq('completed', true)

  const completedLessonIds = new Set(progress?.map(p => p.lesson_id) || [])

  const coursesWithProgress = (courses || []).map(course => {
    const allLessons = course.modules?.flatMap(m => m.lessons || []) || []
    const totalLessons = allLessons.length
    const completedLessons = allLessons.filter(l => completedLessonIds.has(l.id)).length
    return {
      id: course.id,
      title: course.title,
      description: course.description || '',
      thumbnailUrl: course.thumbnail_url,
      totalLessons,
      completedLessons,
      purchased: purchasedCourseIds.has(course.id),
      price: (course as any).price ?? null,
      checkoutUrl: (course as any).checkout_url ?? null,
    }
  })

  coursesWithProgress.sort((a, b) => {
    if (a.purchased && !b.purchased) return -1
    if (!a.purchased && b.purchased) return 1
    return 0
  })

  // Get user name for greeting
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] || ''

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-[13px] text-brand-sage font-semibold uppercase tracking-wider mb-1">
          {firstName ? `Olá, ${firstName}` : 'Bem-vindo(a)'}
        </p>
        <h1 className="page-title mb-1">Meus Cursos</h1>
        <p className="page-subtitle">Continue de onde parou ou explore novos conteúdos.</p>
      </div>

      {coursesWithProgress.length === 0 ? (
        <div className="card-static p-12 sm:p-16 text-center">
          <div className="w-16 h-16 bg-brand-green-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={28} className="text-brand-green-dark" />
          </div>
          <p className="text-[15px] text-brand-navy-light-active">
            Nenhum curso disponível no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {coursesWithProgress.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      )}
    </div>
  )
}
