'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import QRCode from 'react-qr-code'

import {
  CheckCircle2,
  Ticket,
  Home,
} from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()

  const [bookingCode, setBookingCode] =
    useState('')

  useEffect(() => {
    const code =
      localStorage.getItem(
        'booking-code',
      ) || '-'

    setBookingCode(code)
  }, [])

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">

      <div className="w-full rounded-3xl border border-green-500/20 bg-slate-900 p-10 text-center shadow-xl">

        <CheckCircle2
          size={90}
          className="mx-auto text-green-400"
        />

        <h1 className="mt-6 text-4xl font-bold text-white">
          Pembayaran Berhasil
        </h1>

        <p className="mt-3 text-slate-400">
          Tiket berhasil diterbitkan
        </p>

        <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <p className="text-sm text-slate-400">
            Kode Booking
          </p>

          <p className="mt-2 text-3xl font-bold tracking-widest text-cyan-400">
            {bookingCode}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl bg-white p-4">
            <QRCode
              value={bookingCode}
              size={220}
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Tunjukkan QR Code ini saat
          boarding kereta
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-500">
            Status Pembayaran
          </p>

          <p className="mt-2 text-xl font-bold text-green-400">
            BERHASIL
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">

          <button
            onClick={() =>
              router.push(
                '/dashboard/penumpang/tiket',
              )
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
          >
            <Ticket size={18} />
            Lihat Tiket Saya
          </button>

          <button
            onClick={() =>
              router.push(
                '/dashboard/penumpang',
              )
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-bold text-white"
          >
            <Home size={18} />
            Dashboard
          </button>

        </div>

      </div>

    </div>
  )
}