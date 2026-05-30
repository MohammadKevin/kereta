'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Train, Plus, Pencil, Trash2, Search, Loader2, AlertCircle, X, ShieldAlert } from 'lucide-react';
import api from '@/lib/api/api';

interface Kereta {
    id: number;
    nama_kereta: string;
    deskripsi: string;
    kelas: string;
}

interface KeretaFormData {
    nama_kereta: string;
    deskripsi: string;
    kelas: string;
}

type ModalType = 'CREATE' | 'EDIT' | 'DELETE' | null;

export default function AdminKeretaPage() {
    // Core Operational States
    const [keretaList, setKeretaList] = useState<Kereta[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Modal Interactive Management States
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedKereta, setSelectedKereta] = useState<Kereta | null>(null);
    const [formData, setFormData] = useState<KeretaFormData>({ nama_kereta: '', deskripsi: '', kelas: 'EKSEKUTIF' });
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Fetch Core Inventory Lifecycle
    const fetchKereta = async () => {
        try {
            setIsLoading(true);
            setApiError(null);
            const response = await api.get<Kereta[]>('/kereta');
            setKeretaList(Array.isArray(response.data) ? response.data : []);
        } catch (err: any) {
            setApiError('Gagal memuat data armada kereta dari server.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKereta();
    }, []);

    // Structural Form Payload Processing Mutations
    const openCreateModal = () => {
        setFormData({ nama_kereta: '', deskripsi: '', kelas: 'EKSEKUTIF' });
        setFormError(null);
        setModalType('CREATE');
    };

    const openEditModal = (kereta: Kereta) => {
        setSelectedKereta(kereta);
        setFormData({ nama_kereta: kereta.nama_kereta, deskripsi: kereta.deskripsi, kelas: kereta.kelas });
        setFormError(null);
        setModalType('EDIT');
    };

    const openDeleteModal = (kereta: Kereta) => {
        setSelectedKereta(kereta);
        setModalType('DELETE');
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedKereta(null);
        setFormError(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateSubmit = async (
        e: React.FormEvent,
    ) => {
        e.preventDefault()

        if (
            !formData.nama_kereta.trim() ||
            !formData.deskripsi.trim()
        ) {
            setFormError(
                'Semua bidang wajib diisi.',
            )
            return
        }

        try {
            setIsSubmitting(true)
            setFormError(null)

            const payload = {
                nama_kereta:
                    formData.nama_kereta.trim(),
                deskripsi:
                    formData.deskripsi.trim(),
                kelas: formData.kelas,
            }

            console.log(
                'CREATE KERETA:',
                payload,
            )

            const response =
                await api.post(
                    '/kereta',
                    payload,
                )

            console.log(
                'SUCCESS:',
                response.data,
            )

            await fetchKereta()

            closeModal()
        } catch (err: any) {
            console.log(
                'STATUS:',
                err.response?.status,
            )

            console.log(
                'DATA:',
                err.response?.data,
            )

            console.log(err)

            setFormError(
                err.response?.data?.message ||
                'Gagal menambahkan data kereta baru.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditSubmit = async (
        e: React.FormEvent,
    ) => {
        e.preventDefault()

        if (!selectedKereta) return

        if (
            !formData.nama_kereta.trim() ||
            !formData.deskripsi.trim()
        ) {
            setFormError(
                'Semua bidang wajib diisi.',
            )
            return
        }

        try {
            setIsSubmitting(true)
            setFormError(null)

            const payload = {
                nama_kereta:
                    formData.nama_kereta.trim(),
                deskripsi:
                    formData.deskripsi.trim(),
                kelas: formData.kelas,
            }

            console.log(
                'UPDATE ID:',
                selectedKereta.id,
            )

            console.log(
                'UPDATE PAYLOAD:',
                payload,
            )

            const response =
                await api.patch(
                    `/kereta/${selectedKereta.id}`,
                    payload,
                )

            console.log(
                'UPDATE SUCCESS:',
                response.data,
            )

            await fetchKereta()

            closeModal()
        } catch (err: any) {
            console.log(
                'UPDATE STATUS:',
                err.response?.status,
            )

            console.log(
                'UPDATE DATA:',
                err.response?.data,
            )

            console.log(err)

            setFormError(
                Array.isArray(
                    err.response?.data?.message,
                )
                    ? err.response.data.message.join(
                        ', ',
                    )
                    : err.response?.data?.message ||
                    'Gagal memperbarui data kereta.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteSubmit = async () => {
        if (!selectedKereta) return

        try {
            setIsSubmitting(true)

            console.log(
                'DELETE ID:',
                selectedKereta.id,
            )

            const response =
                await api.delete(
                    `/kereta/${selectedKereta.id}`,
                )

            console.log(
                'DELETE SUCCESS:',
                response.data,
            )

            await fetchKereta()

            closeModal()
        } catch (err: any) {
            console.log(
                'DELETE STATUS:',
                err.response?.status,
            )

            console.log(
                'DELETE DATA:',
                err.response?.data,
            )

            console.log(err)

            setFormError(
                err.response?.data?.message ||
                'Gagal menghapus data armada kereta.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredKereta = useMemo(() => {
        return keretaList.filter((k) =>
            k.nama_kereta.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [keretaList, searchQuery]);

    return (
        <div className="space-y-8 min-h-screen bg-slate-950 text-slate-100">

            {/* ================= HEADER CONTROL REGION ================= */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                    <div className="flex items-center gap-2">
                        <Train className="w-6 h-6 text-cyan-400" />
                        <h1 className="text-2xl font-bold tracking-tight text-white">Kelola Kereta</h1>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">Kelola seluruh data kereta yang tersedia.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.15)] active:scale-[0.98] transition-all duration-200"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kereta</span>
                </button>
            </div>

            {/* ================= SEARCH REGION ================= */}
            <div className="w-full max-w-md relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kereta berdasarkan nama..."
                    className="w-full bg-slate-900 text-sm font-medium text-slate-200 placeholder-slate-500 pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200"
                />
            </div>

            {/* ================= INVENTORY CONTROL VISUAL GRID ================= */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 border border-slate-800 rounded-2xl">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                    <p className="text-sm text-slate-400">Sinkronisasi data armada dari server...</p>
                </div>
            ) : apiError ? (
                <div className="flex items-start gap-4 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-red-200">Koneksi Operasional Bermasalah</h4>
                        <p className="text-sm text-slate-400 mt-1">{apiError}</p>
                    </div>
                </div>
            ) : filteredKereta.length === 0 ? (
                <div className="text-center py-24 bg-slate-900/40 border border-slate-800 rounded-2xl">
                    <Train className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Tidak ada data armada kereta ditemukan.</p>
                </div>
            ) : (
                <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Nama Kereta</th>
                                    <th className="px-6 py-4">Kelas</th>
                                    <th className="px-6 py-4">Deskripsi</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-sm font-medium text-slate-300">
                                {filteredKereta.map((kereta) => (
                                    <tr key={kereta.id} className="hover:bg-slate-950/40 transition-colors duration-150">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{kereta.id}</td>
                                        <td className="px-6 py-4 font-semibold text-white">{kereta.nama_kereta}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase">
                                                {kereta.kelas}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 max-w-sm truncate">{kereta.deskripsi}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(kereta)}
                                                    className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-xl transition-all duration-200"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(kereta)}
                                                    className="p-2 text-slate-400 hover:text-red-400 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-xl transition-all duration-200"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ================= TRANSACTIONAL DIALOG MODALS ================= */}
            {modalType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div onClick={closeModal} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Header Dialog */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
                            <h3 className="text-base font-bold text-white">
                                {modalType === 'CREATE' && 'Tambah Kereta Baru'}
                                {modalType === 'EDIT' && 'Ubah Data Kereta'}
                                {modalType === 'DELETE' && 'Konfirmasi Hapus'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-500 hover:text-slate-300 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Mutation Form Core Container */}
                        {modalType === 'DELETE' ? (
                            <div className="p-6 space-y-6">
                                <div className="flex gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm">
                                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h5 className="font-bold text-red-200">Tindakan Destruktif</h5>
                                        <p className="text-slate-400 mt-1">
                                            Apakah Anda yakin ingin menghapus armada <span className="font-semibold text-white">"{selectedKereta?.nama_kereta}"</span>? Tindakan ini tidak dapat dibatalkan.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={closeModal}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-transparent text-slate-400 hover:text-white border border-slate-800 rounded-xl text-sm font-medium transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleDeleteSubmit}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-800 text-white disabled:text-slate-500 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                        <span>Hapus</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={modalType === 'CREATE' ? handleCreateSubmit : handleEditSubmit} className="p-6 space-y-5">
                                {formError && (
                                    <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label htmlFor="nama_kereta" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                                        Nama Kereta
                                    </label>
                                    <input
                                        id="nama_kereta"
                                        name="nama_kereta"
                                        type="text"
                                        value={formData.nama_kereta}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nama kereta"
                                        className="w-full bg-slate-950 text-sm font-medium text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="kelas" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                                        Kelas
                                    </label>
                                    <select
                                        id="kelas"
                                        name="kelas"
                                        value={formData.kelas}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 text-sm font-medium text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200 appearance-none"
                                        style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 12px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                                    >
                                        <option value="EKSEKUTIF" className="bg-slate-900">EKSEKUTIF</option>
                                        <option value="BISNIS" className="bg-slate-900">BISNIS</option>
                                        <option value="EKONOMI" className="bg-slate-900">EKONOMI</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="deskripsi" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                                        Deskripsi rute / armada
                                    </label>
                                    <textarea
                                        id="deskripsi"
                                        name="deskripsi"
                                        rows={3}
                                        value={formData.deskripsi}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan rute atau deskripsi kereta"
                                        className="w-full bg-slate-950 text-sm font-medium text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200 resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-transparent text-slate-400 hover:text-white border border-slate-800 rounded-xl text-sm font-medium transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-cyan-400 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                        <span>Simpan</span>
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
}