import { requireAdmin } from '@/lib/admin'
import { ServiceForm } from '@/components/admin/service-form'
import { DeleteButton } from '@/components/admin/delete-button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
  params: { serviceId: string }
}

export default async function EditServicePage({ params }: Props) {
  const { supabase } = await requireAdmin()

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', params.serviceId)
    .single()

  if (!service) notFound()

  const typeLabel = service.type === 'servico' ? 'Serviço' : 'Consultoria'

  return (
    <div>
      <Link
        href="/admin/servicos"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-navy/60 hover:text-brand-navy transition-colors mb-4"
      >
        <ArrowLeft size={14} />
        Voltar a Serviços
      </Link>

      <div className="mb-8">
        <h1 className="page-title mb-1">Editar {typeLabel}</h1>
        <p className="page-subtitle">{service.title}</p>
      </div>

      <div className="card-static p-5 sm:p-8 mb-6">
        <ServiceForm
          type={service.type}
          service={service}
          nextOrderIndex={service.order_index}
        />
      </div>

      <div className="card-static p-5 border-red-200">
        <h3 className="text-[14px] font-semibold text-red-600 mb-3">Zona de perigo</h3>
        <DeleteButton
          table="services"
          id={service.id}
          redirectTo="/admin/servicos"
          label={`Excluir ${typeLabel.toLowerCase()}`}
        />
      </div>
    </div>
  )
}
