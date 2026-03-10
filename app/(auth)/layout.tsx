import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-dvh bg-gradient-to-b from-[#e2f5e9] via-[#eef8f2] to-[#e8f2ec] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">

      {/* Decorativos nos cantos */}
      <div className="absolute top-0 right-0 w-[360px] h-[360px] rounded-full bg-brand-green/20 blur-[90px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-brand-sage/25 blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-[420px] flex flex-col items-center">

        {/* Logo solta com drop-shadow */}
        <div
          className="mb-[-28px] z-10"
          style={{ filter: 'drop-shadow(0 6px 18px rgba(8,21,52,0.22))' }}
        >
          <Image src="/logo.png" alt="Franca Academy" width={56} height={56} />
        </div>

        {/* Card com borda gradiente sutil */}
        <div className="w-full p-[1px] rounded-2xl bg-gradient-to-br from-brand-green/50 via-brand-sage/20 to-transparent shadow-[0_12px_48px_rgba(8,21,52,0.10)]">
          <div className="w-full bg-white rounded-[calc(1rem-1px)] pt-12 pb-8 px-8">
            {children}
          </div>
        </div>

      </div>

      {/* Footer */}
      <p className="font-montserrat text-[11px] text-brand-navy/35 mt-6">
        © {new Date().getFullYear()} Franca Assessoria
      </p>

    </div>
  )
}
