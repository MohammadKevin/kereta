'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
    CreditCard,
    Wallet,
    Landmark,
    Loader2,
} from 'lucide-react'

import api from '@/lib/api/api'

type PaymentMethod =
    | 'TRANSFER'
    | 'EWALLET'
    | 'CARD'

export default function PembayaranPage() {
    const router = useRouter()

    const [loading, setLoading] =
        useState(true)

    const [submitting, setSubmitting] =
        useState(false)

    const [checkout, setCheckout] =
        useState<any>(null)

    const [method, setMethod] =
        useState<PaymentMethod>(
            'TRANSFER',
        )

    useEffect(() => {
        const data =
            localStorage.getItem(
                'checkout-ticket',
            )

        if (!data) {
            router.push(
                '/dashboard/penumpang',
            )
            return
        }

        setCheckout(JSON.parse(data))
        setLoading(false)
    }, [router])

    const handleBayar = async () => {
        try {
            setSubmitting(true)

            const res = await api.post('/ticket', {
                jadwalId: checkout.jadwalId,
                penumpang: checkout.penumpang,
            })

            console.log(res.data)

            const ticketId =
                res.data?.id ||
                res.data?.ticket?.id ||
                res.data?.pembelianTiket?.id

            if (!ticketId) {
                alert('ID tiket tidak ditemukan')
                return
            }

            const bookingCode =
                `RIK-${String(ticketId).padStart(6, '0')}`

            localStorage.setItem(
                'booking-code',
                bookingCode,
            )

            router.push(
                '/dashboard/penumpang/payment-success',
            )
        } catch (err: any) {
            alert(
                err?.response?.data
                    ?.message ||
                'Gagal membuat tiket',
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (loading || !checkout) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">

            <div>
                <h1 className="text-3xl font-bold text-white">
                    Pembayaran
                </h1>

                <p className="mt-2 text-slate-400">
                    Selesaikan pembayaran
                    untuk menerbitkan tiket.
                </p>
            </div>

            {/* Ringkasan */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-5 text-xl font-bold text-white">
                    Ringkasan Pesanan
                </h2>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-slate-400">
                            Jumlah Penumpang
                        </span>

                        <span className="font-semibold text-white">
                            {
                                checkout.penumpang
                                    .length
                            }{' '}
                            Orang
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-400">
                            Jadwal
                        </span>

                        <span className="font-semibold text-white">
                            #
                            {
                                checkout.jadwalId
                            }
                        </span>
                    </div>

                    <div className="border-t border-slate-800 pt-4">
                        <div className="flex justify-between">
                            <span className="font-semibold text-white">
                                Total Bayar
                            </span>

                            <span className="text-2xl font-bold text-green-400">
                                Rp{' '}
                                {Number(
                                    checkout.totalHarga,
                                ).toLocaleString(
                                    'id-ID',
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metode */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-5 text-xl font-bold text-white">
                    Pilih Metode Pembayaran
                </h2>

                <div className="grid gap-4 md:grid-cols-3">

                    <button
                        onClick={() =>
                            setMethod(
                                'TRANSFER',
                            )
                        }
                        className={`rounded-2xl border p-5 transition ${method ===
                                'TRANSFER'
                                ? 'border-cyan-400 bg-cyan-500/10'
                                : 'border-slate-700'
                            }`}
                    >
                        <Landmark className="mb-3 text-cyan-400" />

                        <h3 className="font-bold text-white">
                            Transfer Bank
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                            BCA, BRI, BNI,
                            Mandiri
                        </p>
                    </button>

                    <button
                        onClick={() =>
                            setMethod(
                                'EWALLET',
                            )
                        }
                        className={`rounded-2xl border p-5 transition ${method ===
                                'EWALLET'
                                ? 'border-cyan-400 bg-cyan-500/10'
                                : 'border-slate-700'
                            }`}
                    >
                        <Wallet className="mb-3 text-cyan-400" />

                        <h3 className="font-bold text-white">
                            E-Wallet
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                            Dana, OVO,
                            GoPay
                        </p>
                    </button>

                    <button
                        onClick={() =>
                            setMethod('CARD')
                        }
                        className={`rounded-2xl border p-5 transition ${method ===
                                'CARD'
                                ? 'border-cyan-400 bg-cyan-500/10'
                                : 'border-slate-700'
                            }`}
                    >
                        <CreditCard className="mb-3 text-cyan-400" />

                        <h3 className="font-bold text-white">
                            Kartu Kredit
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                            Visa /
                            Mastercard
                        </p>
                    </button>

                </div>
            </div>

            {/* Detail Pembayaran */}
            <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-6">
                <h2 className="mb-3 text-lg font-bold text-white">
                    Informasi Pembayaran
                </h2>

                {method ===
                    'TRANSFER' && (
                        <div className="space-y-2">
                            <p className="text-slate-300">
                                Bank BCA
                            </p>

                            <p className="font-mono text-2xl font-bold text-cyan-400">
                                1234567890
                            </p>

                            <p className="text-slate-400">
                                a.n PT Kereta
                                Nusantara
                            </p>
                        </div>
                    )}

                {method ===
                    'EWALLET' && (
                        <div className="space-y-2">
                            <p className="text-slate-300">
                                Nomor E-Wallet
                            </p>

                            <p className="font-mono text-2xl font-bold text-cyan-400">
                                081234567890
                            </p>
                        </div>
                    )}

                {method ===
                    'CARD' && (
                        <div className="space-y-2">
                            <p className="text-slate-300">
                                Simulasi pembayaran
                                kartu kredit
                            </p>
                        </div>
                    )}
            </div>

            {/* Tombol */}
            <button
                onClick={handleBayar}
                disabled={submitting}
                className="w-full rounded-2xl bg-cyan-400 py-4 text-lg font-bold text-slate-950 transition hover:bg-cyan-500"
            >
                {submitting
                    ? 'Memproses Pembayaran...'
                    : 'Bayar Sekarang'}
            </button>
        </div>
    )
}