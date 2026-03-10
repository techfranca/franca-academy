import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-[#f4f7f5] flex flex-col items-center justify-center p-4">

      {/* Brand */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-navy flex items-center justify-center mb-4 shadow-md">
          <Image src="/logo.png" alt="Franca Academy" width={32} height={32} />
        </div>
        <p className="font-poppins font-bold text-brand-navy text-[18px] leading-none mb-0.5">
          Franca Academy
        </p>
        <p className="font-montserrat text-[11px] text-brand-sage tracking-[0.14em] uppercase">
          Plataforma exclusiva
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_2px_24px_rgba(8,21,52,0.07)] border border-black/[0.05] p-8">
        {children}
      </div>

      {/* Footer */}
      <p className="font-montserrat text-[11px] text-brand-navy-light-active/50 mt-6">
        © {new Date().getFullYear()} Franca Assessoria
      </p>

    </div>
  )
}
