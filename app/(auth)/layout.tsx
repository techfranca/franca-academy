import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#e2f5e9] via-[#eef8f2] to-[#e8f2ec] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">

      <div className="w-full max-w-[420px] flex flex-col items-center">

        {/* Logo flutuando acima do card */}
        <div className="w-[60px] h-[60px] rounded-[18px] bg-brand-navy flex items-center justify-center shadow-[0_8px_24px_rgba(8,21,52,0.22)] mb-[-30px] z-10 border-4 border-white/80">
          <Image src="/logo.png" alt="Franca Academy" width={34} height={34} />
        </div>

        {/* Card com borda gradiente sutil */}
        <div className="w-full p-[1px] rounded-2xl bg-gradient-to-br from-brand-green/50 via-brand-sage/20 to-transparent shadow-[0_12px_48px_rgba(8,21,52,0.10)]">
          <div className="w-full bg-white rounded-[calc(1rem-1px)] pt-12 pb-8 px-8">
            {children}
          </div>
        </div>

      </div>

      {/* Footer */}
      <p className="font-montserrat text-[11px] text-brand-navy-light-active/50 mt-6">
        © {new Date().getFullYear()} Franca Assessoria
      </p>

    </div>
  )
}
