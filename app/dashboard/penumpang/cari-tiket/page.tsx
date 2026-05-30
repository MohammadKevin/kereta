'use client'

import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

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

export default function CariTiketPage() {
  const [jadwal, setJadwal] = useState<Jadwal[]>([])
  const [loading, setLoading] = useState(true)

  const [asal, setAsal] = useState('')
  const [tujuan, setTujuan] =
    useState('')

  const [tanggal, setTanggal] =
    useState('')

  useEffect(() => {
    fetchJadwal()
  }, [])

  const fetchJadwal = async () => {
    try {
      const response =
        await api.get('/jadwal')

      setJadwal(
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

  const filteredJadwal =
    useMemo(() => {
      return jadwal.filter(
        (item) => {
          const cocokAsal =
            asal === '' ||
            item.asal_keberangkatan
              .toLowerCase()
              .includes(
                asal.toLowerCase(),
              )

          const cocokTujuan =
            tujuan === '' ||
            item.tujuan_keberangkatan
              .toLowerCase()
              .includes(
                tujuan.toLowerCase(),
              )

          const cocokTanggal =
            tanggal === '' ||
            item.tanggal_berangkat.startsWith(
              tanggal,
            )

          return (
            cocokAsal &&
            cocokTujuan &&
            cocokTanggal
          )
        },
      )
    }, [
      jadwal,
      asal,
      tujuan,
      tanggal,
    ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Cari Tiket Kereta
        </h1>

        <p className="mt-2 text-slate-400">
          Temukan perjalanan terbaik
          untuk Anda.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Kota Asal"
            value={asal}
            onChange={(e) =>
              setAsal(e.target.value)
            }
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
          />

          <input
            type="text"
            placeholder="Kota Tujuan"
            value={tujuan}
            onChange={(e) =>
              setTujuan(
                e.target.value,
              )
            }
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
          />

          <input
            type="date"
            value={tanggal}
            onChange={(e) =>
              setTanggal(
                e.target.value,
              )
            }
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
          />

          <button className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">
            <Search size={18} />
            Cari
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJadwal.map(
            (item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Train className="text-cyan-400" />

                      <h3 className="text-lg font-bold text-white">
                        {
                          item
                            .kereta
                            .nama_kereta
                        }
                      </h3>

                      <span className="rounded-lg bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                        {
                          item
                            .kereta
                            .kelas
                        }
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-slate-300">
                      <MapPin size={16} />

                      {
                        item.asal_keberangkatan
                      }

                      →

                      {
                        item.tujuan_keberangkatan
                      }
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                      <CalendarDays size={16} />

                      {new Date(
                        item.tanggal_berangkat,
                      ).toLocaleString(
                        'id-ID',
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-400">
                      Harga
                    </p>

                    <p className="mb-4 text-2xl font-bold text-green-400">
                      Rp
                      {' '}
                      {item.harga.toLocaleString(
                        'id-ID',
                      )}
                    </p>

                    <Link
                      href={`/dashboard/penumpang/pesan/${item.id}`}
                      className="inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
                    >
                      Pesan Tiket
                    </Link>
                  </div>
                </div>
              </div>
            ),
          )}

          {!filteredJadwal.length && (
            <div className="rounded-2xl border border-dashed border-slate-700 py-12 text-center text-slate-400">
              Tidak ada jadwal yang
              ditemukan.
            </div>
          )}
        </div>
      )}
    </div>
  )
}