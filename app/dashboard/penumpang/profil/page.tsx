'use client'

import { useEffect, useState } from 'react'

import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Ticket,
  Loader2,
  Edit,
} from 'lucide-react'

import api from '@/lib/api/api'

interface Profile {
  id: number
  NIK: string
  nama_penumpang: string
  alamat: string
  telp: string

  user: {
    id: number
    username: string
    role: string
  }

  pembelianTiket: any[]
}

export default function ProfilPage() {
  const [loading, setLoading] =
    useState(true)

  const [profile, setProfile] =
    useState<Profile | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res =
        await api.get(
          '/pelanggan/profile',
        )

      setProfile(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
        Gagal mengambil data profil
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500 text-3xl font-bold text-slate-950">
              {profile.nama_penumpang
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">
                {
                  profile.nama_penumpang
                }
              </h1>

              <p className="text-slate-400">
                @{profile.user.username}
              </p>

              <span className="mt-2 inline-flex rounded-full bg-cyan-500/20 px-3 py-1 text-sm font-semibold text-cyan-400">
                {profile.user.role}
              </span>
            </div>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">
            <Edit size={18} />
            Edit Profil
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-xl font-bold text-white">
            Informasi Akun
          </h2>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <User className="text-cyan-400" />

              <div>
                <p className="text-sm text-slate-400">
                  Username
                </p>

                <p className="font-semibold text-white">
                  {
                    profile.user
                      .username
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="text-cyan-400" />

              <div>
                <p className="text-sm text-slate-400">
                  NIK
                </p>

                <p className="font-semibold text-white">
                  {profile.NIK}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-cyan-400" />

              <div>
                <p className="text-sm text-slate-400">
                  Telepon
                </p>

                <p className="font-semibold text-white">
                  {profile.telp}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-cyan-400" />

              <div>
                <p className="text-sm text-slate-400">
                  Alamat
                </p>

                <p className="font-semibold text-white">
                  {
                    profile.alamat
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-xl font-bold text-white">
            Statistik
          </h2>

          <div className="grid gap-4">
            <div className="rounded-2xl bg-slate-950 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400">
                    Total Tiket
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    {
                      profile
                        .pembelianTiket
                        .length
                    }
                  </h3>
                </div>

                <Ticket className="h-10 w-10 text-cyan-400" />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 p-5">
              <p className="text-slate-400">
                Status Akun
              </p>

              <h3 className="mt-2 text-xl font-bold text-green-400">
                Aktif
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-5 text-xl font-bold text-white">
          Riwayat Pembelian Tiket
        </h2>

        {profile.pembelianTiket
          .length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
            <Ticket className="mx-auto mb-3 text-slate-500" />

            <p className="text-slate-400">
              Belum ada tiket yang dibeli
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.pembelianTiket.map(
              (item: any) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-slate-950 p-5"
                >
                  Ticket #{item.id}
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}