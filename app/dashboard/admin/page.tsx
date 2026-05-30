'use client'

import { useEffect, useState } from 'react'

import {
  CalendarDays,
  Ticket,
  Train,
  Users,
} from 'lucide-react'

import api from '@/lib/api/api'

export default function AdminDashboardPage() {
  const [loading, setLoading] =
    useState(true)

  const [stats, setStats] =
    useState({
      kereta: 0,
      jadwal: 0,
      pelanggan: 0,
      pemasukan: 0,
    })

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)

      const [
        keretaRes,
        jadwalRes,
      ] = await Promise.all([
        api.get('/kereta'),
        api.get('/jadwal'),
      ])

      setStats({
        kereta:
          keretaRes.data?.length || 0,
        jadwal:
          jadwalRes.data?.length || 0,
        pelanggan: 0,
        pemasukan: 0,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      title: 'Total Kereta',
      value: stats.kereta,
      icon: Train,
    },
    {
      title: 'Total Jadwal',
      value: stats.jadwal,
      icon: CalendarDays,
    },
    {
      title: 'Total Pelanggan',
      value: stats.pelanggan,
      icon: Users,
    },
    {
      title: 'Total Pemasukan',
      value: `Rp ${stats.pemasukan.toLocaleString(
        'id-ID',
      )}`,
      icon: Ticket,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard Admin
        </h1>

        <p className="text-slate-400 mt-2">
          Selamat datang di sistem
          pemesanan tiket kereta.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-white">
                    {loading
                      ? '...'
                      : item.value}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}