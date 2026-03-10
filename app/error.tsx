'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const errorId = useRef(
    error.digest ?? Math.random().toString(36).slice(2, 8).toUpperCase()
  )

  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#f2fcf4] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-black/[0.06] p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} className="text-red-500" />
        </div>

        <h1 className="font-poppins text-[20px] font-bold text-[#081534] mb-2">
          Algo deu errado
        </h1>
        <p className="text-[14px] text-[#598F74] leading-relaxed mb-6">
          Ocorreu um erro inesperado. Tente novamente. Se o problema persistir,
          entre em contato com o suporte informando o código abaixo.
        </p>

        <div className="bg-[#f2fcf4] border border-[#7de08d] rounded-lg px-4 py-3 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#598F74] mb-1">
            Código do erro
          </p>
          <p className="font-mono text-[16px] font-bold text-[#081534] tracking-wider">
            #{errorId.current}
          </p>
        </div>

        <button
          onClick={reset}
          className="w-full bg-[#7de08d] text-[#081534] font-poppins font-bold text-[15px] py-3 rounded-xl hover:bg-[#6bc97a] transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
