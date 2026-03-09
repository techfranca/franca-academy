import { LockedCard } from '@/components/locked-card'
import { createClient } from '@/lib/supabase/server'

const FALLBACK_CONSULTORIAS = [
  {
    title: 'Consultoria Individual',
    description: 'Sessão individual com um especialista para resolver suas dúvidas e traçar um plano de ação personalizado.',
    icon_name: 'Users',
  },
  {
    title: 'Mentoria de Negócios',
    description: 'Acompanhamento contínuo com mentoria focada no crescimento e desenvolvimento do seu negócio.',
    icon_name: 'Target',
  },
  {
    title: 'Análise de Performance',
    description: 'Análise completa dos indicadores da sua empresa com recomendações práticas para melhoria.',
    icon_name: 'TrendingUp',
  },
]

export default async function ConsultoriaPage() {
  const supabase = createClient()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('type', 'consultoria')
    .eq('is_active', true)
    .order('order_index')

  const items = services && services.length > 0 ? services : null

  return (
    <div>
      <div className="mb-8">
        <p className="text-[13px] text-brand-sage font-semibold uppercase tracking-wider mb-1">
          Exclusivo
        </p>
        <h1 className="page-title mb-1">Consultoria Individual</h1>
        <p className="page-subtitle">
          Atendimento personalizado para suas necessidades específicas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
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
          FALLBACK_CONSULTORIAS.map((service) => (
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
