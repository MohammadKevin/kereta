'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import api from '@/lib/api/api'

export default function LengkapiProfilPage() {
  const router = useRouter()

  const [loading, setLoading] =
    useState(false)

  const [form, setForm] = useState({
    NIK: '',
    nama_penumpang: '',
    alamat: '',
    telp: '',
  })

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()

    try {
      setLoading(true)

      await api.post(
        '/pelanggan/me',
        form,
      )

      alert(
        'Profil berhasil dilengkapi',
      )

      router.push(
        '/dashboard/penumpang',
      )
    } catch (error: any) {
      alert(
        error?.response?.data
          ?.message ||
          'Gagal menyimpan profil',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="mb-2 text-3xl font-bold text-white">
          Lengkapi Profil
        </h1>

        <p className="mb-8 text-slate-400">
          Lengkapi data diri sebelum
          melakukan pemesanan tiket.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="NIK"
            value={form.NIK}
            onChange={(e) =>
              setForm({
                ...form,
                NIK: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />

          <input
            type="text"
            placeholder="Nama Lengkap"
            value={
              form.nama_penumpang
            }
            onChange={(e) =>
              setForm({
                ...form,
                nama_penumpang:
                  e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />

          <textarea
            placeholder="Alamat"
            value={form.alamat}
            onChange={(e) =>
              setForm({
                ...form,
                alamat:
                  e.target.value,
              })
            }
            className="h-28 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />

          <input
            type="text"
            placeholder="No Telepon"
            value={form.telp}
            onChange={(e) =>
              setForm({
                ...form,
                telp: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950"
          >
            {loading
              ? 'Menyimpan...'
              : 'Simpan Profil'}
          </button>
        </form>
      </div>
    </div>
  )
}