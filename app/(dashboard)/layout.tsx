import { Sidebar } from '@/components/sidebar'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-[#f7faf8] overflow-x-hidden">
      <Sidebar />
      <main className="lg:ml-[260px] min-h-dvh">
        <div className="lg:hidden h-[56px]" />
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
