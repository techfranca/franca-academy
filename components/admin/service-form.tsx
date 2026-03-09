'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'
import { DynamicIcon } from '@/components/dynamic-icon'

const AVAILABLE_ICONS = [
  'Briefcase', 'FileText', 'BarChart3', 'PenTool', 'Users', 'Target',
  'TrendingUp', 'Shield', 'Award', 'BookOpen', 'Calculator', 'ClipboardList',
  'DollarSign', 'Globe', 'Heart', 'Lightbulb', 'MessageCircle', 'Phone',
  'PieChart', 'Search', 'Settings', 'Star', 'Zap', 'Building2',
]

function formatIconName(name: string): string {
  return name
    .replace(/\d+$/, '')
    .replace(/([A-Z])/g, (m, _, i) => (i === 0 ? m : ' ' + m))
    .trim()
}

interface ServiceFormProps {
  type: 'servico' | 'consultoria'
  service?: {
    id: string
    title: string
    description: string | null
    icon_name: string
    whatsapp_message: string | null
    order_index: number
    is_active: boolean
  }
  nextOrderIndex: number
}

export function ServiceForm({ type, service, nextOrderIndex }: ServiceFormProps) {
  const isEditing = !!service
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(service?.title || '')
  const [description, setDescription] = useState(service?.description || '')
  const [iconName, setIconName] = useState(service?.icon_name || 'Briefcase')
  const [whatsappMessage, setWhatsappMessage] = useState(service?.whatsapp_message || '')
  const [orderIndex, setOrderIndex] = useState(service?.order_index ?? nextOrderIndex)
  const [isActive, setIsActive] = useState(service?.is_active ?? true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const typeLabel = type === 'servico' ? 'serviço' : 'consultoria'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      type,
      title,
      description: description || null,
      icon_name: iconName,
      whatsapp_message: whatsappMessage || null,
      order_index: orderIndex,
      is_active: isActive,
    }

    if (isEditing) {
      const { error } = await supabase.from('services').update(payload).eq('id', service.id)
      if (error) {
        setMessage(`Erro: ${error.message}`)
      } else {
        setMessage('Salvo com sucesso!')
        router.refresh()
      }
    } else {
      const { error } = await supabase.from('services').insert(payload)
      if (error) {
        setMessage(`Erro: ${error.message}`)
      } else {
        router.push('/admin/servicos')
      }
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-6 xl:gap-8 items-start">

        {/* ── Left: form fields ── */}
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder={`Nome do ${typeLabel}`}
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder={`Descrição breve do ${typeLabel}`}
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">
              Mensagem do WhatsApp
            </label>
            <input
              type="text"
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              className="input-field"
              placeholder="Ex: Olá! Gostaria de saber mais sobre..."
            />
            <p className="text-[11px] text-brand-navy/55 mt-1">
              Se vazio, usa a mensagem padrão com o título do {typeLabel}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">
                Ordem
              </label>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                className="input-field"
                min={0}
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative inline-flex">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-brand-navy-light/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green" />
                </div>
                <span className="text-[13px] font-semibold text-brand-navy">Ativo</span>
              </label>
            </div>
          </div>

          {message && (
            <div className={`px-4 py-3 rounded-xl text-[13px] ${
              message.includes('sucesso') || message.includes('Salvo')
                ? 'bg-brand-green-light text-brand-green-dark'
                : 'bg-red-50 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 text-[14px]"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                {isEditing ? 'Salvar alterações' : `Criar ${typeLabel}`}
              </>
            )}
          </button>
        </div>

        {/* ── Right: icon picker ── */}
        <div className="xl:sticky xl:top-4">
          <label className="block text-[13px] font-semibold text-brand-navy mb-2">
            Ícone
          </label>

          <div className="grid grid-cols-4 gap-1.5 p-3 bg-brand-navy/[0.04] border border-brand-navy/10 rounded-2xl">
            {AVAILABLE_ICONS.map((name) => {
              const selected = iconName === name
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setIconName(name)}
                  title={name}
                  aria-label={name}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl transition-all duration-150 ${
                    selected
                      ? 'bg-brand-green-light border border-brand-green shadow-sm'
                      : 'border border-transparent hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <DynamicIcon
                    name={name}
                    size={20}
                    className={selected ? 'text-brand-green-dark' : 'text-brand-navy-light-active'}
                  />
                  <span className={`text-[9px] leading-tight text-center w-full truncate ${
                    selected ? 'text-brand-green-dark font-semibold' : 'text-brand-navy-light-active/50'
                  }`}>
                    {formatIconName(name)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Preview do ícone selecionado */}
          <div className="mt-2.5 flex items-center gap-3 px-3 py-2.5 bg-brand-green-light/50 border border-brand-green/30 rounded-xl">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <DynamicIcon name={iconName} size={20} className="text-brand-green-dark" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-brand-navy/55 leading-none mb-0.5">
                Selecionado
              </p>
              <p className="text-[13px] font-semibold text-brand-navy truncate">{iconName}</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
