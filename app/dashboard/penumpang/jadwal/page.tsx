'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  CalendarDays,
  Loader2,
  MapPin,
  Search,
  Train,
} from 'lucide-react'

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

export default function JadwalPage() {
  const [jadwal, setJadwal] = useState<
    Jadwal[]
  >([])

  const [loading, setLoading] =
    useState(true)

  const [search, setSearch] =
    useState('')

  const [error, setError] =
    useState('')

  const fetchJadwal = async () => {
    try {
      setLoading(true)

      const response =
        await api.get<Jadwal[]>(
          '/jadwal',
        )

      setJadwal(response.data)
    } catch (err: any) {
      setError(
        err?.response?.data
          ?.message ||
          'Gagal mengambil data jadwal',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJadwal()
  }, [])

  const filteredJadwal =
    useMemo(() => {
      return jadwal.filter(
        (item) =>
          item.asal_keberangkatan
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ) ||
          item.tujuan_keberangkatan
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ) ||
          item.kereta.nama_kereta
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ),
      )
    }, [jadwal, search])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Cari Jadwal Kereta
        </h1>

        <p className="mt-2 text-slate-400">
          Temukan jadwal perjalanan
          sesuai kebutuhan Anda.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

        <input
          type="text"
          placeholder="Cari asal, tujuan atau nama kereta..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value,
            )
          }
          className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-12 pr-4 text-white outline-none focus:border-cyan-500"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {!loading &&
        filteredJadwal.length ===
          0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <Train className="mx-auto h-12 w-12 text-slate-600" />

            <p className="mt-4 text-slate-400">
              Jadwal tidak ditemukan
            </p>
          </div>
        )}

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredJadwal.map(
          (item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {
                      item.kereta
                        .nama_kereta
                    }
                  </h2>

                  <p className="text-sm text-cyan-400">
                    {
                      item.kereta
                        .kelas
                    }
                  </p>
                </div>

                <div className="rounded-lg bg-cyan-500/10 p-3">
                  <Train className="h-5 w-5 text-cyan-400" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-4 w-4 text-green-400" />
                  <span>
                    {
                      item.asal_keberangkatan
                    }
                  </span>
                  <span>
                    →
                  </span>
                  <span>
                    {
                      item.tujuan_keberangkatan
                    }
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <CalendarDays className="h-4 w-4 text-blue-400" />
                  <span>
                    {new Date(
                      item.tanggal_berangkat,
                    ).toLocaleString(
                      'id-ID',
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                <div>
                  <p className="text-sm text-slate-400">
                    Harga
                  </p>

                  <p className="text-2xl font-bold text-green-400">
                    Rp{' '}
                    {item.harga.toLocaleString(
                      'id-ID',
                    )}
                  </p>
                </div>

                <button
                  className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-500"
                >
                  Pesan Tiket
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}