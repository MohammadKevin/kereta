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

  const generateSeat = async (
    id: number,
  ) => {
    try {
      await api.post(
        `/gerbong/${id}/generate-seat`,
      )

      alert(
        'Kursi berhasil dibuat',
      )

      fetchData()
    } catch (error: any) {
      console.error(error)

      alert(
        error?.response?.data
          ?.message ||
          'Gagal generate kursi',
      )
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

      <div className="grid gap-6">
        {gerbongs.map(
          (gerbong) => (
            <div
              key={gerbong.id}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                    <Train size={20} />

                    {
                      gerbong.nama_gerbong
                    }
                  </h3>

                  <p className="mt-1 text-slate-400">
                    Kuota:{' '}
                    {gerbong.kuota}
                  </p>

                  <p className="text-cyan-400">
                    Total Kursi:{' '}
                    {gerbong.kursi
                      ?.length ||
                      0}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      generateSeat(
                        gerbong.id,
                      )
                    }
                    className="rounded-xl bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
                  >
                    Generate Kursi
                  </button>

                  <button
                    onClick={() =>
                      deleteGerbong(
                        gerbong.id,
                      )
                    }
                    className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    <Trash2
                      size={18}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-3 md:grid-cols-8 lg:grid-cols-10">
                {gerbong.kursi?.map(
                  (kursi) => (
                    <div
                      key={kursi.id}
                      className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-3"
                    >
                      <Armchair
                        size={18}
                        className="text-cyan-400"
                      />

                      <span className="mt-2 text-xs font-semibold text-white">
                        {
                          kursi.no_kursi
                        }
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}