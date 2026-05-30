'use client'

import Link from 'next/link'
import {
  CheckCircle2,
  Ticket,
  Home,
} from 'lucide-react'

export default function HasilPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-500/20 p-5">
            <CheckCircle2
              size={64}
              className="text-green-400"
            />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-white">
          Pemesanan Berhasil
        </h1>

        <p className="mb-8 text-slate-400">
          Tiket kereta berhasil dibuat dan
          tersimpan pada akun Anda.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/penumpang/tiket"
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950"
          >
            <Ticket size={20} />
            Lihat Tiket Saya
          </Link>

          <Link
            href="/dashboard/penumpang"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-6 py-4 text-white"
          >
            <Home size={20} />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}