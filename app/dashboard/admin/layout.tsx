'use client'

import { ReactNode, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

import {
  LayoutDashboard,
  Train,
  CalendarDays,
  Users,
  Ticket,
  LogOut,
  Menu,
  X,
  TrainFront,
  ScanLine,
} from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

const menus = [
  {
    title: 'Dashboard',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Kereta',
    href: '/dashboard/admin/kereta',
    icon: Train,
  },
  {
    title: 'Gerbong & Kursi',
    href: '/dashboard/admin/gerbong',
    icon: TrainFront,
  },
  {
    title: 'Jadwal',
    href: '/dashboard/admin/jadwal',
    icon: CalendarDays,
  },
  {
    title: 'Penumpang',
    href: '/dashboard/admin/penumpang',
    icon: Users,
  },
  {
    title: 'Pemesanan',
    href: '/dashboard/admin/pemesanan',
    icon: Ticket,
  },
  {
    title: 'Scan Tiket',
    href: '/dashboard/admin/scan',
    icon: ScanLine,
  },
]

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')

    router.push('/')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen w-72 shrink-0
          border-r border-slate-800
          bg-slate-900
          transition-transform duration-300
          lg:relative lg:translate-x-0
          ${
            open
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <Train className="text-cyan-400" />

            <div>
              <h1 className="text-xl font-bold">
                RailTicket
              </h1>

              <p className="text-xs text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[calc(100vh-80px)] flex-col justify-between">
          <nav className="space-y-2 p-4">
            {menus.map((menu) => {
              const Icon = menu.icon

              const active =
                pathname === menu.href

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() =>
                    setOpen(false)
                  }
                  className={`
                    flex items-center gap-3
                    rounded-xl px-4 py-3
                    transition-all
                    ${
                      active
                        ? 'bg-cyan-500 font-semibold text-black'
                        : 'text-slate-300 hover:bg-slate-800'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>
                    {menu.title}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-red-400 transition hover:bg-red-500/20"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>

            <div>
              <h2 className="text-lg font-semibold">
                Dashboard Admin
              </h2>

              <p className="text-xs text-slate-400">
                Railway Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold text-black">
              A
            </div>

            <div className="hidden sm:block">
              <p className="font-medium">
                Administrator
              </p>

              <p className="text-xs text-slate-400">
                ADMIN
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}