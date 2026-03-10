'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteButtonProps {
  table: 'courses' | 'modules' | 'lessons' | 'services'
  id: string
  redirectTo: string
  label?: string
}

export function DeleteButton({ table, id, redirectTo, label = 'Excluir' }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      toast.error('Erro ao excluir. Tente novamente.')
      setDeleting(false)
      setConfirming(false)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-red-600 font-semibold">Tem certeza?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Excluindo...' : 'Sim, excluir'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 rounded-lg bg-brand-navy-light/30 text-brand-navy text-[13px] font-semibold hover:bg-brand-navy-light/50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
    >
      <Trash2 size={15} />
      {label}
    </button>
  )
}
