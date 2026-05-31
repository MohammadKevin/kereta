'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  Ticket,
  Train,
  Loader2,
  ChevronRight,
} from 'lucide-react'

import api from '@/lib/api/api'

export default function TiketPage() {
  const [loading, setLoading] =
    useState(true)

  const [tickets, setTickets] =
    useState<any[]>([])

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const res = await api.get('/ticket/mine')
      setTickets(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Tiket Saya
        </h1>

        <p className="mt-2 text-slate-400">
          Semua tiket yang telah dibeli
        </p>
      </div>

      {tickets.length === 0 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
          <Ticket
            size={60}
            className="mx-auto text-slate-600"
          />

          <p className="mt-4 text-slate-400">
            Belum ada tiket
          </p>
        </div>
      )}

      <div className="space-y-4">
        {tickets.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/penumpang/tiket/${item.id}`}
            className="block rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400"
          >
            <div className="flex items-center justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <Train className="text-cyan-400" />

                  <h2 className="font-bold text-white">
                    {item.jadwal.kereta.nama_kereta}
                  </h2>
                </div>

                <p className="mt-2 text-slate-400">
                  {item.jadwal.asal_keberangkatan}
                  {' → '}
                  {item.jadwal.tujuan_keberangkatan}
                </p>

                <p className="mt-2 text-sm text-cyan-400">
                  Booking:
                  {' '}
                  RIK-
                  {String(item.id).padStart(
                    6,
                    '0',
                  )}
                </p>
              </div>

              <ChevronRight className="text-slate-500" />

            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}