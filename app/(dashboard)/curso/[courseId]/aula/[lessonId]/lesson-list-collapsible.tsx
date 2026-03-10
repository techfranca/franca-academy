'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  children: React.ReactNode
  subtitle: string
}

export function LessonListCollapsible({ children, subtitle }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full xl:w-[340px] bg-white xl:border-l border-t xl:border-t-0 border-black/[0.06]">
      {/* Header - always visible */}
      <button
        className="w-full p-4 border-b border-black/[0.06] flex items-center justify-between xl:cursor-default xl:pointer-events-none text-left"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Fechar lista de aulas' : 'Ver lista de aulas'}
      >
        <div>
          <h3 className="font-poppins text-[15px] font-semibold text-brand-navy">
            Conteúdo do Curso
          </h3>
          <p className="text-[12px] text-brand-navy-light-active mt-0.5">{subtitle}</p>
        </div>
        <ChevronDown
          size={20}
          className={`xl:hidden text-brand-sage flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Lesson list - collapsible on mobile, always visible on xl */}
      <div className={`xl:block ${isOpen ? 'block' : 'hidden'}`}>{children}</div>
    </div>
  )
}
