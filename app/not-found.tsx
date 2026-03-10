import Link from 'next/link'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f2fcf4] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-black/[0.06] p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[#f2fcf4] flex items-center justify-center mx-auto mb-4">
          <SearchX size={26} className="text-[#598F74]" />
        </div>

        <h1 className="font-poppins text-[20px] font-bold text-[#081534] mb-2">
          Página não encontrada
        </h1>
        <p className="text-[14px] text-[#598F74] leading-relaxed mb-6">
          A página que você está procurando não existe ou foi removida.
        </p>

        <Link
          href="/cursos"
          className="inline-block w-full bg-[#7de08d] text-[#081534] font-poppins font-bold text-[15px] py-3 rounded-xl hover:bg-[#6bc97a] transition-colors"
        >
          Ir para meus cursos
        </Link>
      </div>
    </div>
  )
}
