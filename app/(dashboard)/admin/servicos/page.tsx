import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

export default async function AdminServicesPage() {
  const { supabase } = await requireAdmin()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('type')
    .order('order_index')

  const servicos = (services || []).filter((s) => s.type === 'servico')
  const consultorias = (services || []).filter((s) => s.type === 'consultoria')

  function renderList(items: typeof servicos, type: 'servico' | 'consultoria') {
    if (items.length === 0) {
      return (
        <div className="card-static p-8 text-center">
          <p className="text-[14px] text-brand-navy/65">Nenhum item cadastrado.</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/admin/servicos/${item.id}`}
            className="card group hover:shadow-md transition-all duration-200 block"
          >
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[15px] font-semibold text-brand-navy truncate group-hover:text-brand-green-dark transition-colors">
                    {item.title}
                  </h3>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    item.is_active
                      ? 'bg-brand-green-light text-brand-green-dark'
                      : 'bg-red-50 text-red-500'
                  }`}>
                    {item.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-[12px] text-brand-navy/65 font-medium truncate">
                  {item.icon_name} · Ordem: {item.order_index}
                  {item.description && <span className="mx-2">·</span>}
                  {item.description && <span className="text-brand-navy/50">{item.description.slice(0, 60)}{item.description.length > 60 ? '...' : ''}</span>}
                </p>
              </div>
              <Pencil size={16} className="text-brand-navy/50 group-hover:text-brand-green-dark transition-colors flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="page-title mb-1">Gerenciar Serviços</h1>
          <p className="page-subtitle">
            {servicos.length} serviço{servicos.length !== 1 ? 's' : ''} · {consultorias.length} consultoria{consultorias.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/servicos/novo" className="btn-primary flex items-center gap-2 text-[14px]">
          <Plus size={16} />
          Novo
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-[16px] font-semibold text-brand-navy mb-3">Serviços</h2>
          {renderList(servicos, 'servico')}
        </div>

        <div>
          <h2 className="text-[16px] font-semibold text-brand-navy mb-3">Consultorias</h2>
          {renderList(consultorias, 'consultoria')}
        </div>
      </div>
    </div>
  )
}
