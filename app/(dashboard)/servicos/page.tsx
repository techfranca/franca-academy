import { LockedCard } from '@/components/locked-card'
import { createClient } from '@/lib/supabase/server'
import { Briefcase, FileText, BarChart3, PenTool } from 'lucide-react'

const FALLBACK_SERVICES = [
  {
    title: 'Assessoria Contábil',
    description: 'Gestão contábil completa com foco em resultados e conformidade fiscal para sua empresa.',
    icon_name: 'FileText',
  },
  {
    title: 'Planejamento Tributário',
    description: 'Estratégias para redução legal de impostos e otimização da carga tributária do seu negócio.',
    icon_name: 'BarChart3',
  },
  {
    title: 'Abertura de Empresa',
    description: 'Abertura e legalização de empresas com orientação em todas as etapas do processo.',
    icon_name: 'Briefcase',
  },
  {
    title: 'Regularização Fiscal',
    description: 'Regularize sua situação fiscal com o acompanhamento de especialistas.',
    icon_name: 'PenTool',
  },
]

export default async function ServicosPage() {
  const supabase = createClient()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('type', 'servico')
    .eq('is_active', true)
    .order('order_index')

  const items = services && services.length > 0 ? services : null

  return (
    <div>
      <div className="mb-8">
        <p className="text-[13px] text-brand-sage font-semibold uppercase tracking-wider mb-1">
          Exclusivo
        </p>
        <h1 className="page-title mb-1">Serviços</h1>
        <p className="page-subtitle">
          Conheça nossos serviços especializados para impulsionar seus resultados.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {items ? (
          items.map((service) => (
            <LockedCard
              key={service.id}
              title={service.title}
              description={service.description || ''}
              serviceName={service.title}
              iconName={service.icon_name}
              whatsappMessage={service.whatsapp_message}
            />
          ))
        ) : (
          FALLBACK_SERVICES.map((service) => (
            <LockedCard
              key={service.title}
              title={service.title}
              description={service.description}
              serviceName={service.title}
              iconName={service.icon_name}
            />
          ))
        )}
      </div>
    </div>
  )
}
