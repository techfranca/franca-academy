export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-brand-green-light flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-navy relative overflow-hidden items-center justify-center">
        <div className="relative z-10 text-center px-12">
          <h1 className="font-poppins text-heading-1 text-brand-green mb-4">
            Franca Academy
          </h1>
          <p className="font-montserrat text-body-big text-brand-navy-light-active">
            Transformando conhecimento em resultados
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="font-poppins text-heading-2 text-brand-navy">
              Franca Academy
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
