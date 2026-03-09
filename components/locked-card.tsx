'use client'

import { Lock, ArrowRight, MessageCircle } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/utils'
import { DynamicIcon } from '@/components/dynamic-icon'

interface LockedCardProps {
  title: string
  description: string
  serviceName: string
  icon?: React.ReactNode
  iconName?: string
  whatsappMessage?: string | null
}

export function LockedCard({ title, description, serviceName, icon, iconName, whatsappMessage }: LockedCardProps) {
  const whatsappUrl = whatsappMessage
    ? `https://wa.me/5521991097451?text=${encodeURIComponent(whatsappMessage)}`
    : getWhatsAppLink(serviceName)

  const iconElement = icon || (iconName ? <DynamicIcon name={iconName} size={32} className="text-brand-green-dark" /> : null)

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card p-6 sm:p-8 flex flex-col items-center text-center group cursor-pointer"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-green-light rounded-2xl flex items-center justify-center mb-5 group-hover:bg-brand-green-light-active transition-colors duration-300">
        {iconElement}
      </div>

      <div className="w-8 h-8 bg-brand-navy-light/50 rounded-full flex items-center justify-center mb-3">
        <Lock size={14} className="text-brand-navy-light-active" />
      </div>

      <h3 className="font-poppins text-[18px] font-semibold text-brand-navy mb-2">{title}</h3>
      <p className="text-[14px] text-brand-navy-light-active mb-6 max-w-sm leading-relaxed">{description}</p>

      <span className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green-dark text-[14px] font-semibold px-5 py-2.5 rounded-xl group-hover:bg-brand-green group-hover:text-brand-navy transition-all duration-300">
        <MessageCircle size={16} />
        Falar com consultor
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </span>
    </a>
  )
}
