'use client'

import { useEffect, useState } from 'react'

import {
  Plus,
  Train,
  Armchair,
  Trash2,
  Loader2,
} from 'lucide-react'

import api from '@/lib/api/api'

interface Kursi {
  id: number
  no_kursi: string
}

interface Gerbong {
  id: number
  nama_gerbong: string
  kuota: number
  keretaId: number
  kursi?: Kursi[]
}

interface Kereta {
  id: number
  nama_kereta: string
  kelas: string
}

export default function AdminGerbongPage() {
  const [gerbongs, setGerbongs] =
    useState<Gerbong[]>([])

  const [keretaList, setKeretaList] =
    useState<Kereta[]>([])

  const [loading, setLoading] =
    useState(true)

  const [namaGerbong, setNamaGerbong] =
    useState('')

  const [kuota, setKuota] =
    useState('')

  const [keretaId, setKeretaId] =
    useState<number | ''>('')

  const [expandedKereta, setExpandedKereta] =
    useState<number | null>(null)

  const [expandedGerbong, setExpandedGerbong] =
    useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [gerbongRes, keretaRes] =
        await Promise.all([
          api.get('/gerbong'),
          api.get('/kereta'),
        ])

      setGerbongs(
        Array.isArray(
          gerbongRes.data,
        )
          ? gerbongRes.data
          : [],
      )

      setKeretaList(
        Array.isArray(
          keretaRes.data,
        )
          ? keretaRes.data
          : [],
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const createGerbong = async () => {
    if (
      !namaGerbong ||
      !keretaId ||
      !kuota
    ) {
      alert(
        'Lengkapi seluruh form',
      )
      return
    }

    try {
      await api.post('/gerbong', {
        nama_gerbong: namaGerbong,
        kuota: Number(kuota),
        keretaId: Number(keretaId),
      })

      alert(
        'Gerbong dan kursi berhasil dibuat',
      )

      setNamaGerbong('')
      setKuota('')
      setKeretaId('')

      fetchData()
    } catch (error) {
      console.error(error)
      alert('Gagal tambah gerbong')
    }
  }

  const deleteGerbong = async (
    id: number,
  ) => {
    const confirmDelete =
      window.confirm(
        'Hapus gerbong ini?',
      )

    if (!confirmDelete) return

    try {
      await api.delete(
        `/gerbong/${id}`,
      )

      fetchData()
    } catch (error) {
      console.error(error)
      alert(
        'Gagal menghapus gerbong',
      )
    }
  }

  const groupedKereta: any[] = Object.values(
    gerbongs.reduce(
      (acc: any, gerbong) => {
        const kereta =
          keretaList.find(
            (k) =>
              k.id ===
              gerbong.keretaId,
          )

        if (!kereta) return acc

        if (!acc[kereta.id]) {
          acc[kereta.id] = {
            ...kereta,
            gerbongs: [],
          }
        }

        acc[
          kereta.id
        ].gerbongs.push(
          gerbong,
        )

        return acc
      },
      {},
    ),
  )

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
          Gerbong & Kursi
        </h1>

        <p className="mt-2 text-slate-400">
          Kelola seluruh gerbong dan
          kursi kereta.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="mb-6 text-xl font-bold text-white">
          Tambah Gerbong
        </h2>

        <div className="grid gap-5 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Nama Gerbong"
            value={namaGerbong}
            onChange={(e) =>
              setNamaGerbong(
                e.target.value,
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />

          <select
            value={keretaId}
            onChange={(e) =>
              setKeretaId(
                Number(
                  e.target.value,
                ),
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
          >
            <option value="">
              Pilih Kereta
            </option>

            {keretaList.map(
              (kereta) => (
                <option
                  key={kereta.id}
                  value={
                    kereta.id
                  }
                >
                  {
                    kereta.nama_kereta
                  }{' '}
                  (
                  {kereta.kelas}
                  )
                </option>
              ),
            )}
          </select>

          <input
            type="number"
            placeholder="Kuota"
            value={kuota}
            onChange={(e) =>
              setKuota(
                e.target.value,
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />

          <button
            onClick={
              createGerbong
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-500"
          >
            <Plus size={18} />
            Tambah
          </button>
        </div>
      </div>

      {groupedKereta.map(
        (kereta: any) => {
          const totalKursi =
            kereta.gerbongs.reduce(
              (
                total: number,
                g: any,
              ) =>
                total +
                (g.kursi?.length ||
                  g.kuota),
              0,
            )

          return (
            <div
              key={kereta.id}
              className="rounded-3xl border border-slate-800 bg-slate-900"
            >
              <button
                onClick={() =>
                  setExpandedKereta(
                    expandedKereta ===
                      kereta.id
                      ? null
                      : kereta.id,
                  )
                }
                className="w-full p-6 text-left"
              >
                <h2 className="text-2xl font-bold text-white">
                  {kereta.nama_kereta}
                </h2>

                <p className="text-cyan-400">
                  {kereta.kelas}
                </p>

                <p className="mt-3 text-slate-400">
                  {
                    kereta.gerbongs
                      .length
                  }{' '}
                  Gerbong •{' '}
                  {totalKursi} Kursi
                </p>
              </button>

              {expandedKereta ===
                kereta.id && (
                  <div className="border-t border-slate-800">
                    {kereta.gerbongs.map(
                      (g: any) => (
                        <div
                          key={g.id}
                          className="border-b border-slate-800 p-4 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-white">
                                {g.nama_gerbong}
                              </h3>

                              <p className="text-slate-400">
                                {g.kursi?.length || g.kuota}{' '}
                                Kursi
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setExpandedGerbong(
                                    expandedGerbong ===
                                      g.id
                                      ? null
                                      : g.id,
                                  )
                                }
                                className="rounded-xl bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950"
                              >
                                {expandedGerbong ===
                                  g.id
                                  ? 'Tutup'
                                  : 'Lihat Kursi'}
                              </button>

                              <button
                                onClick={() =>
                                  deleteGerbong(g.id)
                                }
                                className="rounded-xl bg-red-500 p-2 text-white hover:bg-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {expandedGerbong ===
                            g.id && (
                              <div className="mt-5 space-y-3">
                                {Array.from({
                                  length: Math.ceil(
                                    (g.kursi?.length ||
                                      0) / 4,
                                  ),
                                }).map(
                                  (_, rowIndex) => {
                                    const row =
                                      g.kursi?.slice(
                                        rowIndex * 4,
                                        rowIndex * 4 + 4,
                                      ) || []

                                    return (
                                      <div
                                        key={rowIndex}
                                        className="flex justify-center gap-8"
                                      >
                                        <div className="flex gap-2">
                                          {row
                                            .slice(0, 2)
                                            .map(
                                              (
                                                kursi: any,
                                              ) => (
                                                <div
                                                  key={
                                                    kursi.id
                                                  }
                                                  className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900"
                                                >
                                                  <Armchair
                                                    size={
                                                      16
                                                    }
                                                    className="text-cyan-400"
                                                  />

                                                  <span className="text-xs text-white">
                                                    {
                                                      kursi.no_kursi
                                                    }
                                                  </span>
                                                </div>
                                              ),
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                          {row
                                            .slice(2, 4)
                                            .map(
                                              (
                                                kursi: any,
                                              ) => (
                                                <div
                                                  key={
                                                    kursi.id
                                                  }
                                                  className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900"
                                                >
                                                  <Armchair
                                                    size={
                                                      16
                                                    }
                                                    className="text-cyan-400"
                                                  />

                                                  <span className="text-xs text-white">
                                                    {
                                                      kursi.no_kursi
                                                    }
                                                  </span>
                                                </div>
                                              ),
                                            )}
                                        </div>
                                      </div>
                                    )
                                  },
                                )}
                              </div>
                            )}
                        </div>
                      ),
                    )}
                  </div>
                )}
            </div>
          )
        },
      )}
    </div>
  )
}