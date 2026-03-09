'use client'

import { useState } from 'react'
import { ServiceForm } from '@/components/admin/service-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewServicePage() {
  const [type, setType] = useState<'servico' | 'consultoria'>('servico')

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
        <h1 className="page-title mb-1">Novo Serviço / Consultoria</h1>
        <p className="page-subtitle">Escolha o tipo e preencha as informações.</p>
      </div>

      <div className="card-static p-5 sm:p-8">
        <div className="mb-6">
          <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">Tipo *</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType('servico')}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                type === 'servico'
                  ? 'bg-brand-green-light text-brand-green-dark border-2 border-brand-green'
                  : 'bg-brand-navy/[0.06] text-brand-navy/65 border-2 border-transparent hover:bg-brand-navy/10'
              }`}
            >
              Serviço
            </button>
            <button
              type="button"
              onClick={() => setType('consultoria')}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                type === 'consultoria'
                  ? 'bg-brand-green-light text-brand-green-dark border-2 border-brand-green'
                  : 'bg-brand-navy/[0.06] text-brand-navy/65 border-2 border-transparent hover:bg-brand-navy/10'
              }`}
            >
              Consultoria
            </button>
          </div>
        </div>

        <ServiceForm type={type} nextOrderIndex={1} />
      </div>
    </div>
  )
}
