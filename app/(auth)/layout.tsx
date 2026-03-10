import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh flex">

      {/* ── Left: Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[54%] xl:w-[56%] bg-brand-navy relative overflow-hidden flex-col">

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(125,224,141,0.07) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-24 w-[480px] h-[480px] bg-brand-green/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-brand-green/5 rounded-full blur-2xl pointer-events-none" />

        {/* Noise overlay for depth */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
              <Image src="/logo.png" alt="Franca Academy" width={28} height={28} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-poppins font-bold text-white text-[16px]">Franca</span>
              <span className="font-poppins font-semibold text-brand-green text-[10px] tracking-[0.18em] uppercase">Academy</span>
            </div>
          </div>

          {/* Main copy - vertically centered */}
          <div className="flex-1 flex flex-col justify-center max-w-[480px]">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 rounded-full px-4 py-1.5 mb-8 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-brand-green text-[11px] font-semibold font-montserrat tracking-[0.08em] uppercase">
                Plataforma exclusiva
              </span>
            </div>

            <h1 className="font-poppins font-bold text-white text-[38px] xl:text-[46px] leading-[1.1] mb-5">
              Transformando<br />
              <span className="text-brand-green">conhecimento</span><br />
              em resultados
            </h1>

            <p className="font-montserrat text-brand-navy-light-active/75 text-[15px] xl:text-[16px] leading-relaxed max-w-[380px]">
              Acesse cursos premium desenvolvidos para impulsionar sua carreira e seus negócios com quem entende do mercado.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-7 mt-10">
              <div>
                <p className="font-poppins font-bold text-white text-[26px] leading-none">500+</p>
                <p className="font-montserrat text-brand-navy-light-active/50 text-[12px] mt-1">Alunos</p>
              </div>
              <div className="w-px h-9 bg-white/10" />
              <div>
                <p className="font-poppins font-bold text-white text-[26px] leading-none">10+</p>
                <p className="font-montserrat text-brand-navy-light-active/50 text-[12px] mt-1">Cursos</p>
              </div>
              <div className="w-px h-9 bg-white/10" />
              <div>
                <p className="font-poppins font-bold text-white text-[26px] leading-none">98%</p>
                <p className="font-montserrat text-brand-navy-light-active/50 text-[12px] mt-1">Satisfação</p>
              </div>
            </div>
          </div>

          {/* Testimonial card */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm">
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#7de08d" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p className="font-montserrat text-[13px] text-white/75 leading-relaxed mb-4">
              "Os cursos da Franca Academy transformaram completamente minha forma de atender clientes. O conteúdo é direto e aplicável ao dia a dia."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center flex-shrink-0">
                <span className="font-poppins font-bold text-brand-green text-[12px]">A</span>
              </div>
              <div>
                <p className="font-montserrat font-semibold text-white text-[12px] leading-none mb-0.5">Ana Silva</p>
                <p className="font-montserrat text-brand-navy-light-active/45 text-[11px]">Aluna desde 2023</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-navy-dark/40 to-transparent pointer-events-none" />
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 lg:p-10 bg-[#f4f8f5]">

        {/* Subtle bg pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(8,21,52,0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 w-full max-w-[400px]">

          {/* Mobile branding */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-navy flex items-center justify-center mb-3 shadow-lg">
              <Image src="/logo.png" alt="Franca Academy" width={36} height={36} />
            </div>
            <p className="font-poppins font-bold text-brand-navy text-[20px] leading-none mb-1">Franca Academy</p>
            <p className="font-montserrat text-brand-sage text-[11px] tracking-[0.12em] uppercase">Plataforma exclusiva</p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-[0_2px_40px_rgba(8,21,52,0.08)] border border-black/[0.05] p-7 sm:p-8">
            {children}
          </div>

          {/* Footer */}
          <p className="text-center font-montserrat text-[12px] text-brand-navy-light-active/50 mt-6">
            © {new Date().getFullYear()} Franca Assessoria. Todos os direitos reservados.
          </p>
        </div>
      </div>

    </div>
  )
}
