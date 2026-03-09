'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Heart,
  Briefcase,
  Users,
  UserCircle,
  LogOut,
  Menu,
  X,
  Lock,
  LifeBuoy,
  LayoutDashboard,
  GraduationCap,
} from 'lucide-react'
import { useState, useEffect } from 'react'

const menuItems = [
  {
    label: 'Meus Cursos',
    href: '/cursos',
    icon: BookOpen,
  },
  {
    label: 'Aulas Favoritas',
    href: '/favoritos',
    icon: Heart,
  },
  {
    label: 'Serviços',
    href: '/servicos',
    icon: Briefcase,
    locked: true,
  },
  {
    label: 'Consultoria',
    href: '/consultoria',
    icon: Users,
    locked: true,
  },
]

const adminItems = [
  {
    label: 'Painel Admin',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Gerenciar Cursos',
    href: '/admin/cursos',
    icon: GraduationCap,
  },
  {
    label: 'Gerenciar Serviços',
    href: '/admin/servicos',
    icon: Briefcase,
  },
]

const settingsItems = [
  {
    label: 'Meu Perfil',
    href: '/perfil',
    icon: UserCircle,
  },
  {
    label: 'Suporte',
    href: '/suporte',
    icon: LifeBuoy,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single()
        setUserName(data?.full_name || user.email?.split('@')[0] || '')
        setUserRole(data?.role || 'user')
      }
    }
    getUser()
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const firstName = userName.split(' ')[0]

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6">
        <Link href="/cursos" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Franca Academy" width={36} height={36} className="flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-poppins font-bold text-white text-[15px] leading-tight">Franca</span>
            <span className="font-poppins font-medium text-brand-green text-[11px] leading-tight tracking-wider uppercase">Academy</span>
          </div>
        </Link>
      </div>

      <div className="mx-5 h-px bg-white/10" />

      {/* User greeting */}
      {firstName && (
        <div className="px-5 py-4">
          <p className="text-[12px] text-brand-navy-light-active/60 font-montserrat">Bem-vindo(a)</p>
          <p className="text-[14px] text-white font-montserrat font-semibold truncate">{firstName}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-2 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold text-brand-navy-light-active/40 uppercase tracking-wider font-montserrat">
          Menu
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const isCourseActive = item.href === '/cursos' && pathname.startsWith('/curso')
          const active = isActive || isCourseActive

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-montserrat transition-all duration-200 relative',
                active
                  ? 'bg-brand-green/15 text-brand-green font-semibold'
                  : 'text-brand-navy-light-active hover:bg-white/[0.06] hover:text-white'
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-green rounded-r-full" />
              )}
              <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
              <span className="flex-1">{item.label}</span>
              {item.locked && <Lock size={13} className="opacity-40" />}
            </Link>
          )
        })}
      </nav>

      {/* Admin section - only visible to admins */}
      {userRole === 'admin' && (
        <div className="px-3 pt-2 pb-1">
          <div className="mx-2 h-px bg-white/10 mb-3" />
          <p className="px-3 pb-2 text-[11px] font-semibold text-brand-navy-light-active/40 uppercase tracking-wider font-montserrat">
            Admin
          </p>
          {adminItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-montserrat transition-all duration-200 relative',
                  active
                    ? 'bg-brand-green/15 text-brand-green font-semibold'
                    : 'text-brand-navy-light-active hover:bg-white/[0.06] hover:text-white'
                )}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-green rounded-r-full" />
                )}
                <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Logout - always at bottom */}
      <div className="mt-auto">
        <div className="mx-5 h-px bg-white/10" />
        <div className="p-3 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold text-brand-navy-light-active/40 uppercase tracking-wider font-montserrat">
            Configurações
          </p>
          {settingsItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-montserrat transition-all duration-200 relative',
                  active
                    ? 'bg-brand-green/15 text-brand-green font-semibold'
                    : 'text-brand-navy-light-active hover:bg-white/[0.06] hover:text-white'
                )}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-green rounded-r-full" />
                )}
                <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-montserrat text-brand-navy-light-active/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-brand-navy/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="p-1.5 text-white rounded-md hover:bg-white/10 transition-colors" aria-label="Abrir menu">
          <Menu size={22} />
        </button>
        <Image src="/logo.png" alt="Franca" width={28} height={28} />
        <span className="font-poppins font-bold text-white text-[14px]">Franca Academy</span>
      </div>

      {/* Mobile overlay */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar - mobile */}
      <aside className={cn(
        'lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-brand-navy z-50 transform transition-transform duration-300 ease-out shadow-2xl',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 p-1 text-brand-navy-light-active/60 hover:text-white transition-colors" aria-label="Fechar menu">
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>

      {/* Sidebar - desktop */}
      <aside className="hidden lg:block w-[260px] bg-brand-navy fixed left-0 top-0 bottom-0 border-r border-white/[0.06]">
        {sidebarContent}
      </aside>
    </>
  )
}
