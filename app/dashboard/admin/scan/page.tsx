'use client'

import { useState } from 'react'
import { QrReader } from 'react-qr-reader'

import {
  CheckCircle2,
  Train,
  User,
  Armchair,
} from 'lucide-react'

import api from '@/lib/api/api'

export default function ScanPage() {
  const [ticket, setTicket] =
    useState<any>(null)

  const [loading, setLoading] =
    useState(false)

  const handleScan = async (
    text: string,
  ) => {
    try {
      setLoading(true)

      const ticketId = Number(
        text.replace(
          'RIK-',
          '',
        ),
      )

      const res =
        await api.get(
          `/ticket/${ticketId}`,
        )

      setTicket(res.data)
    } catch (error) {
      console.error(error)

      alert(
        'Tiket tidak ditemukan',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Scan Tiket
        </h1>

        <p className="mt-2 text-slate-400">
          Scan QR Code tiket penumpang
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <QrReader
          constraints={{
            facingMode:
              'environment',
          }}
          onResult={(result: { getText: () => string }) => {
            if (result) {
              handleScan(
                result.getText(),
              )
            }
          }}
        />
      </div>

      {loading && (
        <p className="text-cyan-400">
          Memeriksa tiket...
        </p>
      )}

      {ticket && (
        <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6">

          <div className="mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-green-400" />

            <h2 className="text-2xl font-bold text-white">
              Tiket Valid
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-slate-400">
                Booking Code
              </p>

              <p className="font-bold text-cyan-400">
                RIK-
                {String(
                  ticket.id,
                ).padStart(6, '0')}
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-slate-400">
                Total Penumpang
              </p>

              <p className="font-bold text-white">
                {
                  ticket.total_penumpang
                }
              </p>
            </div>

          </div>

          <div className="mt-6 rounded-xl bg-slate-900 p-4">
            <div className="flex items-center gap-2">
              <Train size={18} />

              <span className="font-bold text-white">
                {
                  ticket.jadwal
                    .kereta
                    .nama_kereta
                }
              </span>
            </div>

            <p className="mt-2 text-slate-300">
              {
                ticket.jadwal
                  .asal_keberangkatan
              }
              {' → '}
              {
                ticket.jadwal
                  .tujuan_keberangkatan
              }
            </p>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-bold text-white">
              Penumpang
            </h3>

            <div className="space-y-3">
              {ticket.detailPembelian.map(
                (
                  item: any,
                ) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-slate-900 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <User size={16} />

                      <span className="font-semibold text-white">
                        {
                          item.nama_penumpang
                        }
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-cyan-400">
                      <Armchair size={16} />

                      <span>
                        {
                          item.kursi
                            .no_kursi
                        }
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}