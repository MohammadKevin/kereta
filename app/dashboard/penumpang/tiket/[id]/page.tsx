'use client'

import QRCode from 'react-qr-code'

import {
  Loader2,
  Train,
  Calendar,
  MapPin,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import { useParams } from 'next/navigation'

import api from '@/lib/api/api'

export default function DetailTiketPage() {
  const params = useParams()

  const [loading, setLoading] =
    useState(true)

  const [ticket, setTicket] =
    useState<any>(null)

  useEffect(() => {
    fetchTicket()
  }, [])

  const fetchTicket = async () => {
    try {
      const res =
        await api.get(
          `/ticket/mine/${params.id}`,
        )

      setTicket(res.data)
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

  if (!ticket) {
    return (
      <div className="text-center text-red-400">
        Tiket tidak ditemukan
      </div>
    )
  }

  const bookingCode =
    `RIK-${String(ticket.id).padStart(6, '0')}`

  return (
    <div className="mx-auto max-w-4xl">

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="mb-8 flex items-center gap-3">
          <Train className="text-cyan-400" />

          <div>
            <h1 className="text-3xl font-bold text-white">
              {ticket.jadwal.kereta.nama_kereta}
            </h1>

            <p className="text-slate-400">
              {ticket.jadwal.kereta.kelas}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div className="space-y-5">

            <div>
              <p className="text-slate-400">
                Kode Booking
              </p>

              <p className="text-2xl font-bold text-cyan-400">
                {bookingCode}
              </p>
            </div>

            <div>
              <p className="text-slate-400">
                Rute
              </p>

              <p className="font-bold text-white">
                {ticket.jadwal.asal_keberangkatan}
              </p>

              <p className="font-bold text-white">
                ↓
              </p>

              <p className="font-bold text-white">
                {ticket.jadwal.tujuan_keberangkatan}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={18} />

              <span className="text-white">
                {new Date(
                  ticket.jadwal.tanggal_berangkat,
                ).toLocaleString(
                  'id-ID',
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} />

              <span className="text-white">
                {ticket.detailPembelian.length}
                {' '}
                Penumpang
              </span>
            </div>

          </div>

          <div className="flex justify-center">
            <div className="rounded-2xl bg-white p-4">
              <QRCode
                value={bookingCode}
                size={220}
              />
            </div>
          </div>

        </div>

      </div>

      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="mb-5 text-xl font-bold text-white">
          Detail Penumpang
        </h2>

        <div className="space-y-3">
          {ticket.detailPembelian.map(
            (item: any) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-bold text-white">
                  {item.nama_penumpang}
                </p>

                <p className="text-slate-400">
                  NIK:
                  {' '}
                  {item.NIK}
                </p>

                <p className="text-cyan-400">
                  Kursi:
                  {' '}
                  {item.kursi.no_kursi}
                </p>
              </div>
            ),
          )}
        </div>

      </div>

    </div>
  )
}