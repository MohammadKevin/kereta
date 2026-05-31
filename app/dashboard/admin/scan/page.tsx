'use client'

import { useState } from 'react'

import { Scanner } from '@yudiel/react-qr-scanner'

import {
  CheckCircle2,
  QrCode,
  XCircle,
} from 'lucide-react'

export default function ScanPage() {
  const [result, setResult] =
    useState<string>('')

  const [status, setStatus] =
    useState<
      'idle' | 'valid' | 'used'
    >('idle')

  const handleScan = (
    value: string,
  ) => {
    if (!value) return

    const scannedTickets =
      JSON.parse(
        localStorage.getItem(
          'used-tickets',
        ) || '[]',
      )

    if (
      scannedTickets.includes(
        value,
      )
    ) {
      setResult(value)
      setStatus('used')
      return
    }

    scannedTickets.push(value)

    localStorage.setItem(
      'used-tickets',
      JSON.stringify(
        scannedTickets,
      ),
    )

    setResult(value)
    setStatus('valid')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Scan Tiket
        </h1>

        <p className="mt-2 text-slate-400">
          Scan QR Code tiket
          penumpang.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6">

        <Scanner
          onScan={(result) => {
            const code =
              result?.[0]
                ?.rawValue

            if (code) {
              handleScan(
                code,
              )
            }
          }}
          onError={(err) =>
            console.error(err)
          }
        />

      </div>

      {result && (
        <div
          className={`rounded-3xl border p-6 ${
            status === 'valid'
              ? 'border-green-500/30 bg-green-500/10'
              : 'border-red-500/30 bg-red-500/10'
          }`}
        >
          <div className="flex items-center gap-3">

            {status ===
            'valid' ? (
              <CheckCircle2 className="text-green-400" />
            ) : (
              <XCircle className="text-red-400" />
            )}

            <h2 className="text-xl font-bold text-white">
              {status ===
              'valid'
                ? 'Tiket Valid'
                : 'Tiket Sudah Digunakan'}
            </h2>

          </div>

          <div className="mt-5 rounded-2xl bg-slate-950 p-5">

            <div className="flex items-center gap-2 text-cyan-400">
              <QrCode size={18} />

              <span>
                Kode Booking
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-white">
              {result}
            </p>

          </div>

        </div>
      )}

    </div>
  )
}