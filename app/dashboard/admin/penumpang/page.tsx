'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  AlertCircle,
  Loader2,
  Search,
  Users,
} from 'lucide-react'

import api from '@/lib/api/api'

interface User {
  id: number
  username: string
  role: string
}

export default function AdminPenumpangPage() {
  const [users, setUsers] = useState<User[]>(
    [],
  )

  const [isLoading, setIsLoading] =
    useState(true)

  const [apiError, setApiError] =
    useState<string | null>(null)

  const [searchQuery, setSearchQuery] =
    useState('')

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setApiError(null)

      const response =
        await api.get<User[]>('/users/findall')

      const data = Array.isArray(
        response.data,
      )
        ? response.data
        : []

      const passengers = data.filter(
        (user) =>
          user.role === 'PENUMPANG',
      )

      setUsers(passengers)
    } catch (error: any) {
      console.error(error)

      setApiError(
        error?.response?.data?.message ||
          'Gagal memuat data penumpang.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.username
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase(),
        ),
    )
  }, [users, searchQuery])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-cyan-400" />

          <h1 className="text-2xl font-bold text-white">
            Kelola Penumpang
          </h1>
        </div>

        <p className="text-sm text-slate-400">
          Lihat seluruh data
          penumpang yang terdaftar.
        </p>
      </div>

      {!isLoading &&
        !apiError && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Penumpang
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {users.length}
              </h2>
            </div>
          </div>
        )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(
              e.target.value,
            )
          }
          placeholder="Cari username..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-cyan-500"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 py-24">
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-cyan-400" />

          <p className="text-sm text-slate-400">
            Memuat data penumpang...
          </p>
        </div>
      ) : apiError ? (
        <div className="flex gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

          <div>
            <h3 className="font-semibold text-red-300">
              Terjadi Kesalahan
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {apiError}
            </p>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 py-24 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-slate-700" />

          <p className="font-medium text-slate-400">
            Belum ada data
            penumpang.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">
                      ID
                    </th>

                    <th className="px-6 py-4">
                      Username
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map(
                    (user) => (
                      <tr
                        key={user.id}
                        className="border-b border-slate-800/50 hover:bg-slate-950/30"
                      >
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {user.id}
                        </td>

                        <td className="px-6 py-4 font-semibold text-white">
                          {
                            user.username
                          }
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 md:hidden">
            {filteredUsers.map(
              (user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      ID:{' '}
                      {user.id}
                    </span>

                    <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {user.role}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Username
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white">
                      {
                        user.username
                      }
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </>
      )}
    </div>
  )
}