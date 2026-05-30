'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import {
  Loader2,
  Train,
  Users,
  Armchair,
} from 'lucide-react'

import api from '@/lib/api/api'

interface Kursi {
  id: number
  no_kursi: string
  tersedia: boolean
}

interface Gerbong {
  id: number
  nama_gerbong: string
  kuota: number
  kursi: Kursi[]
}

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
    gerbong: Gerbong[]
  }
}

interface PenumpangForm {
  NIK: string
  nama_penumpang: string
  kursiId: number | null
}

export default function PesanTiketPage() {
  const router = useRouter()
  const params = useParams()

  const jadwalId = Number(params.jadwalId)

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  const [selectedPassenger, setSelectedPassenger] =
    useState(0)

  const [jadwal, setJadwal] =
    useState<Jadwal | null>(null)

  const [penumpang, setPenumpang] =
    useState<PenumpangForm[]>([
      {
        NIK: '',
        nama_penumpang: '',
        kursiId: null,
      },
    ])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res =
        await api.get(
          `/jadwal/${jadwalId}`,
        )

      setJadwal(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addPenumpang = () => {
    setPenumpang((prev) => [
      ...prev,
      {
        NIK: '',
        nama_penumpang: '',
        kursiId: null,
      },
    ])
  }

  const updatePenumpang = (
    index: number,
    field:
      | 'NIK'
      | 'nama_penumpang'
      | 'kursiId',
    value: string | number,
  ) => {
    const updated = [...penumpang]

    updated[index] = {
      ...updated[index],
      [field]: value,
    }

    setPenumpang(updated)
  }

  const handleSelectSeat = (
    kursiId: number,
  ) => {
    const updated = [...penumpang]

    updated[
      selectedPassenger
    ].kursiId = kursiId

    setPenumpang(updated)
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      await api.post('/ticket', {
        jadwalId,
        penumpang,
      })

      alert(
        'Tiket berhasil dipesan',
      )

      router.push(
        '/dashboard/penumpang/tiket',
      )
    } catch (err: any) {
      alert(
        err?.response?.data
          ?.message ||
          'Gagal memesan tiket',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (!jadwal) {
    return (
      <div className="text-center text-red-400">
        Jadwal tidak ditemukan
      </div>
    )
  }

  const totalHarga =
    jadwal.harga *
    penumpang.length

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* HEADER */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Train className="text-cyan-400" />

          <div>
            <h1 className="text-2xl font-bold text-white">
              {
                jadwal.kereta
                  .nama_kereta
              }
            </h1>

            <p className="text-slate-400">
              {
                jadwal.kereta
                  .kelas
              }
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-slate-400">
              Asal
            </p>

            <p className="font-bold text-white">
              {
                jadwal.asal_keberangkatan
              }
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Tujuan
            </p>

            <p className="font-bold text-white">
              {
                jadwal.tujuan_keberangkatan
              }
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Harga
            </p>

            <p className="font-bold text-green-400">
              Rp{' '}
              {jadwal.harga.toLocaleString(
                'id-ID',
              )}
            </p>
          </div>
        </div>
      </div>

      {/* PENUMPANG */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Users />
            Data Penumpang
          </h2>

          <button
            onClick={addPenumpang}
            className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950"
          >
            + Tambah
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {penumpang.map(
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setSelectedPassenger(
                    index,
                  )
                }
                className={`rounded-xl px-4 py-2 font-semibold ${
                  selectedPassenger ===
                  index
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-slate-800 text-white'
                }`}
              >
                Penumpang{' '}
                {index + 1}
              </button>
            ),
          )}
        </div>

        <div className="space-y-4">
          {penumpang.map(
            (
              item,
              index,
            ) => (
              <div
                key={index}
                className="grid gap-4 md:grid-cols-3"
              >
                <input
                  placeholder="NIK"
                  value={item.NIK}
                  onChange={(e) =>
                    updatePenumpang(
                      index,
                      'NIK',
                      e.target.value,
                    )
                  }
                  className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                />

                <input
                  placeholder="Nama Penumpang"
                  value={
                    item.nama_penumpang
                  }
                  onChange={(e) =>
                    updatePenumpang(
                      index,
                      'nama_penumpang',
                      e.target.value,
                    )
                  }
                  className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                />

                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                  <p className="text-sm text-slate-400">
                    Kursi Dipilih
                  </p>

                  <p className="font-bold text-cyan-400">
                    {item.kursiId
                      ? `ID ${item.kursiId}`
                      : 'Belum dipilih'}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* GERBONG */}
      {jadwal.kereta.gerbong.map(
        (gerbong) => (
          <div
            key={gerbong.id}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {
                    gerbong.nama_gerbong
                  }
                </h3>

                <p className="text-slate-400">
                  {
                    gerbong.kursi
                      .length
                  }{' '}
                  Kursi
                </p>
              </div>

              <div className="rounded-xl bg-cyan-500/10 px-4 py-2 text-cyan-400">
                Penumpang{' '}
                {selectedPassenger +
                  1}
              </div>
            </div>

            <div className="mb-6 flex justify-center">
              <div className="rounded-xl bg-slate-800 px-10 py-3 font-bold">
                DEPAN KERETA
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
              {gerbong.kursi.map(
                (kursi) => {
                  const dipilih =
                    penumpang.some(
                      (p) =>
                        p.kursiId ===
                        kursi.id,
                    )

                  const aktif =
                    penumpang[
                      selectedPassenger
                    ]?.kursiId ===
                    kursi.id

                  return (
                    <button
                      key={
                        kursi.id
                      }
                      disabled={
                        !kursi.tersedia
                      }
                      onClick={() =>
                        handleSelectSeat(
                          kursi.id,
                        )
                      }
                      className={`h-16 rounded-xl border transition ${
                        aktif
                          ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                          : dipilih
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : kursi.tersedia
                          ? 'bg-slate-950 border-slate-700 hover:border-cyan-400'
                          : 'bg-red-500 border-red-500'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <Armchair size={16} />
                        <span className="text-xs">
                          {
                            kursi.no_kursi
                          }
                        </span>
                      </div>
                    </button>
                  )
                },
              )}
            </div>
          </div>
        ),
      )}

      {/* TOTAL */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400">
              Total Penumpang
            </p>

            <p className="text-2xl font-bold">
              {penumpang.length}
            </p>
          </div>

          <div className="text-right">
            <p className="text-slate-400">
              Total Harga
            </p>

            <p className="text-3xl font-bold text-green-400">
              Rp{' '}
              {totalHarga.toLocaleString(
                'id-ID',
              )}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 w-full rounded-xl bg-cyan-400 py-4 font-bold text-slate-950"
        >
          {submitting
            ? 'Memproses...'
            : 'Pesan Tiket'}
        </button>
      </div>
    </div>
  )
}