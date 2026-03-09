import Link from 'next/link'
import { BookOpen, Clock, CheckCircle2, ArrowRight, Lock } from 'lucide-react'

interface CourseCardProps {
  id: string
  title: string
  description: string
  thumbnailUrl?: string
  totalLessons: number
  completedLessons: number
  purchased: boolean
}

export function CourseCard({
  id,
  title,
  description,
  thumbnailUrl,
  totalLessons,
  completedLessons,
  purchased,
}: CourseCardProps) {
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  if (!purchased) {
    return (
      <div className="card-static overflow-hidden opacity-70">
        <div className="h-40 sm:h-44 bg-gradient-to-br from-brand-navy-light to-brand-navy-light/60 flex items-center justify-center relative">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover opacity-50" />
          ) : (
            <BookOpen size={40} className="text-brand-navy-light-active/50" />
          )}
          <div className="absolute inset-0 bg-brand-navy/50 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Lock size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-poppins text-[16px] font-semibold text-brand-navy mb-1.5">{title}</h3>
          <p className="text-[13px] text-brand-navy-light-active line-clamp-2">{description}</p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-brand-sage font-semibold">
            <Lock size={13} />
            Curso bloqueado
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link href={`/curso/${id}`} className="card overflow-hidden block group">
      <div className="h-40 sm:h-44 bg-gradient-to-br from-brand-green-light to-brand-green-light-active flex items-center justify-center relative overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <BookOpen size={36} className="text-brand-green-dark/40" />
          </div>
        )}
        {/* Badge */}
        {progress === 100 ? (
          <div className="absolute top-3 right-3 bg-brand-green text-brand-navy text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={12} /> Concluído
          </div>
        ) : progress > 0 ? (
          <div className="absolute top-3 right-3 bg-brand-navy text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            {progress}%
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="font-poppins text-[16px] font-semibold text-brand-navy mb-1.5 group-hover:text-brand-green-dark transition-colors">
          {title}
        </h3>
        <p className="text-[13px] text-brand-navy-light-active line-clamp-2 mb-4">
          {description}
        </p>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-brand-navy-light-active flex items-center gap-1.5">
              <Clock size={12} />
              {completedLessons}/{totalLessons} aulas
            </span>
          </div>
          <div className="h-1.5 bg-brand-navy-light/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-green to-brand-green-dark rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.max(progress, 2)}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-brand-green-dark group-hover:text-brand-green-dark/80">
          {progress === 0 ? 'Começar' : progress === 100 ? 'Revisar' : 'Continuar'}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
