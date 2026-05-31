'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Loader2, MapPin, Search, Train, ArrowRight } from 'lucide-react'
import api from '@/lib/api/api'

interface Jadwal {
  id: number
  asal_keberangkatan: string
  tujuan_keberangkatan: string
  tanggal_berangkat: string
  tanggal_kedatangan: string
  harga: number
  kereta: {
    id: number
    nama_kereta: string
    kelas: string
  }
}

export default function CariTiketPage() {
  const [jadwal, setJadwal] = useState<Jadwal[]>([])
  const [loading, setLoading] = useState(true)
  const [asal, setAsal] = useState('')
  const [tujuan, setTujuan] = useState('')
  const [tanggal, setTanggal] = useState('')

  useEffect(() => {
    fetchJadwal()
  }, [])

  const fetchJadwal = async () => {
    try {
      const response = await api.get('/jadwal')
      setJadwal(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJadwal = useMemo(() => {
    return jadwal.filter((item) => {
      const cocokAsal =
        asal === '' ||
        item.asal_keberangkatan.toLowerCase().includes(asal.toLowerCase())
      const cocokTujuan =
        tujuan === '' ||
        item.tujuan_keberangkatan.toLowerCase().includes(tujuan.toLowerCase())
      const cocokTanggal =
        tanggal === '' || item.tanggal_berangkat.startsWith(tanggal)
      return cocokAsal && cocokTujuan && cocokTanggal
    })
  }, [jadwal, asal, tujuan, tanggal])

  const groupedJadwal = useMemo(() => {
    const map = new Map()
    filteredJadwal.forEach((item) => {
      const tanggalObj = new Date(item.tanggal_berangkat)
      const jamBerangkat = `${String(tanggalObj.getHours()).padStart(2, '0')}:${String(tanggalObj.getMinutes()).padStart(2, '0')}`
      const key = `${item.asal_keberangkatan}-${item.tujuan_keberangkatan}-${item.kereta.id}-${jamBerangkat}`
      if (!map.has(key)) {
        map.set(key, { ...item, total_jadwal: 0 })
      }
      map.get(key).total_jadwal++
    })
    return Array.from(map.values())
  }, [filteredJadwal])

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Cari Tiket Kereta
        </h1>
        <p className="mt-1 text-sm text-slate-400 sm:mt-2 sm:text-base">
          Temukan perjalanan terbaik untuk Anda.
        </p>
      </div>

      {/* Search Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {/* Kota Asal */}
          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Kota Asal"
              value={asal}
              onChange={(e) => setAsal(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none sm:text-base"
            />
          </div>

          {/* Kota Tujuan */}
          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Kota Tujuan"
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none sm:text-base"
            />
          </div>

          {/* Tanggal */}
          <div className="relative">
            <CalendarDays
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-9 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none sm:text-base [color-scheme:dark]"
            />
          </div>

          {/* Tombol Cari */}
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-95 sm:text-base">
            <Search size={18} />
            Cari Tiket
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {/* Result count */}
          {groupedJadwal.length > 0 && (
            <p className="text-sm text-slate-400">
              Menampilkan{' '}
              <span className="font-semibold text-white">{groupedJadwal.length}</span>{' '}
              jadwal tersedia
            </p>
          )}

          {groupedJadwal.map((item: any) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-cyan-500 sm:rounded-3xl sm:p-6"
            >
              {/* Mobile & Tablet: stacked layout; Desktop: row layout */}
              <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Left: Info kereta */}
                <div className="min-w-0 flex-1">
                  {/* Nama kereta + kelas */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Train className="shrink-0 text-cyan-400" size={20} />
                    <h3 className="text-base font-bold text-white sm:text-lg">
                      {item.kereta.nama_kereta}
                    </h3>
                    <span className="rounded-lg bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400">
                      {item.kereta.kelas}
                    </span>
                  </div>

                  {/* Rute */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-white sm:text-base">
                    <span className="truncate">{item.asal_keberangkatan}</span>
                    <ArrowRight size={16} className="shrink-0 text-cyan-400" />
                    <span className="truncate">{item.tujuan_keberangkatan}</span>
                  </div>

                  {/* Jam berangkat */}
                  <div className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                    Berangkat:{' '}
                    <span className="font-medium text-slate-300">
                      {new Date(item.tanggal_berangkat).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Badge tersedia */}
                  <div className="mt-2.5 inline-block rounded-lg bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 sm:text-sm">
                    Tersedia {item.total_jadwal} Hari
                  </div>
                </div>

                {/* Divider — horizontal on mobile, vertical on desktop */}
                <div className="h-px w-full bg-slate-800 lg:h-16 lg:w-px" />

                {/* Right: Harga + tombol */}
                {/* Mobile: row layout (harga kiri, tombol kanan); Desktop: column text-right */}
                <div className="flex items-center justify-between lg:flex-col lg:items-end lg:gap-3">
                  <div>
                    <p className="text-xs text-slate-400 lg:text-right lg:text-sm">
                      Mulai dari
                    </p>
                    <p className="text-xl font-bold text-green-400 sm:text-2xl lg:text-3xl">
                      Rp {item.harga.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/penumpang/pesan/${item.id}`}
                    className="shrink-0 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-95 sm:px-5 sm:py-3 sm:text-base"
                  >
                    Pesan Tiket
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {groupedJadwal.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-700 py-12 text-center sm:py-16">
              <Train className="mx-auto mb-3 text-slate-600" size={40} />
              <p className="text-sm text-slate-400 sm:text-base">
                Tidak ada jadwal yang ditemukan.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Coba ubah filter pencarian Anda.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}