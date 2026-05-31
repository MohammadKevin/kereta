'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  CalendarDays,
  Search,
  Ticket,
  Train,
  User,
  Loader2,
} from 'lucide-react'

import api from '@/lib/api/api'

interface TicketData {
  id: number
  tanggal_pembelian: string
  total_penumpang: number
  total_harga: number
  jadwal: {
    asal_keberangkatan: string
    tujuan_keberangkatan: string
    tanggal_berangkat: string
    harga: number
    kereta: {
      nama_kereta: string
      kelas: string
    }
  }
}

export default function PenumpangDashboardPage() {
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
  checkProfile()

  const storedUser =
    localStorage.getItem('user')

  if (storedUser) {
    setUser(JSON.parse(storedUser))
  }
}, [])

const checkProfile = async () => {
  try {
    const res =
      await api.get('/pelanggan/me')

    setProfil(res.data)

    fetchTickets()
  } catch (error: any) {
    if (
      error?.response?.status === 404
    ) {
      router.replace(
        '/dashboard/penumpang/lengkapi-profil',
      )
    }
  }
}

  const fetchTickets = async () => {
    try {
      const response =
        await api.get<TicketData[]>(
          '/ticket/mine',
        )

      setTickets(
        Array.isArray(response.data)
          ? response.data
          : [],
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const router = useRouter()
  const [profil, setProfil] =
  useState<any>(null)

  const latestTicket =
    tickets.length > 0
      ? tickets[0]
      : null

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-white">
          Halo, {profil?.nama_penumpang || 'Penumpang'} 👋
        </h1>

        <p className="mt-2 text-slate-400">
          Selamat datang kembali di
          RailTicket.
        </p>

        <Link
          href="/dashboard/penumpang/cari-tiket"
          className="mt-6 inline-flex items-center gap-2 rounded-xl   bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-500"
        >
          <Search size={18} />
          Cari Tiket
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Total Tiket
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {tickets.length}
              </h2>
            </div>

            <Ticket className="text-cyan-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Role
              </p>

              <h2 className="mt-2 text-xl font-bold text-cyan-400">
                PENUMPANG
              </h2>
            </div>

            <User className="text-cyan-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Status
              </p>

              <h2 className="mt-2 text-xl font-bold text-green-400">
                Aktif
              </h2>
            </div>

            <Train className="text-green-400" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Tiket Terakhir
          </h2>

          <Link
            href="/dashboard/penumpang/tiket"
            className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          </div>
        ) : latestTicket ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {
                    latestTicket
                      .jadwal
                      .kereta
                      .nama_kereta
                  }
                </h3>

                <p className="mt-1 text-slate-400">
                  {
                    latestTicket
                      .jadwal
                      .asal_keberangkatan
                  }
                  {' → '}
                  {
                    latestTicket
                      .jadwal
                      .tujuan_keberangkatan
                  }
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays size={16} />

                  {new Date(
                    latestTicket.jadwal.tanggal_berangkat,
                  ).toLocaleDateString(
                    'id-ID',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    },
                  )}
                </div>
              </div>

              <Link
                href={`/dashboard/penumpang/tiket/${latestTicket.id}`}
                className="rounded-xl bg-cyan-400 px-5 py-3 text-center font-semibold text-slate-950 hover:bg-cyan-500"
              >
                Detail Tiket
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 py-12 text-center">
            <Ticket className="mx-auto mb-4 h-12 w-12 text-slate-600" />

            <h3 className="font-semibold text-white">
              Belum Ada Tiket
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Mulai cari jadwal dan pesan
              tiket kereta sekarang.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/dashboard/penumpang/cari-tiket"
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500"
        >
          <Search className="mb-4 text-cyan-400" />

          <h3 className="font-bold text-white">
            Cari Tiket
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Cari jadwal kereta dan
            lakukan pemesanan.
          </p>
        </Link>

        <Link
          href="/dashboard/penumpang/tiket"
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500"
        >
          <Ticket className="mb-4 text-cyan-400" />

          <h3 className="font-bold text-white">
            Tiket Saya
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Lihat seluruh tiket yang
            pernah dipesan.
          </p>
        </Link>

        <Link
          href="/dashboard/penumpang/profil"
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500"
        >
          <User className="mb-4 text-cyan-400" />

          <h3 className="font-bold text-white">
            Profil
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Kelola informasi akun
            Anda.
          </p>
        </Link>
      </div>
    </div>
  )
}