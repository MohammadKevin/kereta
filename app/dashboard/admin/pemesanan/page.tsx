'use client'

import { useState } from 'react'

import {
  AlertCircle,
  CalendarDays,
  DollarSign,
  Loader2,
  Search,
  Ticket,
  Users,
} from 'lucide-react'

import api from '@/lib/api/api'

interface RevenueResponse {
  bulan: number
  tahun: number
  total_transaksi: number
  total_penumpang: number
  total_pemasukan: number
}

const monthNames = [
  '',
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

export default function AdminPemasukanPage() {
  const currentDate = new Date()

  const [bulan, setBulan] = useState(
    String(currentDate.getMonth() + 1),
  )

  const [tahun, setTahun] = useState(
    String(currentDate.getFullYear()),
  )

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [data, setData] =
    useState<RevenueResponse | null>(
      null,
    )

  const fetchRevenue = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await api.get<RevenueResponse>(
          '/ticket/rekap/pemasukan',
          {
            params: {
              bulan,
              tahun,
            },
          },
        )

      setData(response.data)
    } catch (err: any) {
      console.error(err)

      setError(
        err?.response?.data
          ?.message ||
          'Gagal mengambil data pemasukan',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-white">
          Rekap Pemasukan
        </h1>

        <p className="mt-2 text-slate-400">
          Monitoring transaksi dan
          pemasukan tiket kereta.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Bulan
            </label>

            <select
              value={bulan}
              onChange={(e) =>
                setBulan(
                  e.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            >
              {monthNames
                .slice(1)
                .map(
                  (
                    month,
                    index,
                  ) => (
                    <option
                      key={
                        index + 1
                      }
                      value={
                        index + 1
                      }
                    >
                      {month}
                    </option>
                  ),
                )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Tahun
            </label>

            <input
              type="number"
              value={tahun}
              onChange={(e) =>
                setTahun(
                  e.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={
                fetchRevenue
              }
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Cari Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 text-red-400" />

          <div>
            <h3 className="font-semibold text-red-300">
              Error
            </h3>

            <p className="text-sm text-red-200">
              {error}
            </p>
          </div>
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Total Pemasukan
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-green-400">
                    Rp{' '}
                    {data.total_pemasukan.toLocaleString(
                      'id-ID',
                    )}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <DollarSign />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Total Transaksi
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {
                      data.total_transaksi
                    }
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Ticket />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Total Penumpang
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {
                      data.total_penumpang
                    }
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Users />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Periode
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-white">
                    {
                      monthNames[
                        data.bulan
                      ]
                    }{' '}
                    {data.tahun}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <CalendarDays />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Ringkasan Pemasukan
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">
                  Bulan
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {
                    monthNames[
                      data.bulan
                    ]
                  }
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">
                  Tahun
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {data.tahun}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">
                  Jumlah Transaksi
                </p>

                <p className="mt-1 text-lg font-bold text-cyan-400">
                  {
                    data.total_transaksi
                  }
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">
                  Jumlah Penumpang
                </p>

                <p className="mt-1 text-lg font-bold text-blue-400">
                  {
                    data.total_penumpang
                  }
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}