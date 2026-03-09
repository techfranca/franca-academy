'use client'

import { cn, formatDuration } from '@/lib/utils'
import { PlayCircle, CheckCircle2, Lock } from 'lucide-react'

interface LessonItemProps {
  id: string
  title: string
  duration?: number
  completed: boolean
  active: boolean
  locked: boolean
  onClick: () => void
}

export function LessonItem({ title, duration, completed, active, locked, onClick }: LessonItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
        active
          ? 'bg-brand-green/15 border border-brand-green/30'
          : 'hover:bg-brand-navy-light/50',
        locked && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {locked ? (
          <Lock size={20} className="text-brand-navy-light-active" />
        ) : completed ? (
          <CheckCircle2 size={20} className="text-brand-green-dark" />
        ) : (
          <PlayCircle
            size={20}
            className={cn(
              active ? 'text-brand-green' : 'text-brand-navy-light-active'
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-body-small truncate',
            active ? 'text-brand-navy font-semibold' : 'text-brand-navy',
            completed && !active && 'text-brand-navy-light-active'
          )}
        >
          {title}
        </p>
      </div>

      {/* Duration */}
      {duration && (
        <span className="text-body-small text-brand-navy-light-active flex-shrink-0">
          {formatDuration(duration)}
        </span>
      )}
    </button>
  )
}
