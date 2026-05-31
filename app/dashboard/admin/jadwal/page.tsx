'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CalendarDays, Plus, Pencil, Trash2, Search, Loader2, AlertCircle, ShieldAlert, X, Train } from 'lucide-react';
import api from '@/lib/api/api';

interface Jadwal {
  id: number;
  asal_keberangkatan: string;
  tujuan_keberangkatan: string;
  tanggal_berangkat: string;
  tanggal_kedatangan: string;
  harga: number;
  keretaId: number;
}

interface Kereta {
  id: number;
  nama_kereta: string;
  deskripsi: string;
  kelas: string;
}

interface JadwalFormData {
  asal_keberangkatan: string;
  tujuan_keberangkatan: string;
  tanggal_berangkat: string;
  tanggal_kedatangan: string;
  harga: number;
  keretaId: number;
}

type ModalType = 'CREATE' | 'EDIT' | 'DELETE' | null;

export default function AdminJadwalPage() {
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [keretaList, setKeretaList] = useState<Kereta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedJadwal, setSelectedJadwal] = useState<Jadwal | null>(null);
  const [formData, setFormData] = useState<JadwalFormData>({
    asal_keberangkatan: '',
    tujuan_keberangkatan: '',
    tanggal_berangkat: '',
    tanggal_kedatangan: '',
    harga: 0,
    keretaId: 0,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const keretaMap = useMemo(() => {
    return new Map<number, Kereta>(keretaList.map((k) => [k.id, k]));
  }, [keretaList]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const [jadwalRes, keretaRes] = await Promise.all([
        api.get<Jadwal[]>('/jadwal'),
        api.get<Kereta[]>('/kereta'),
      ]);
      setJadwalList(Array.isArray(jadwalRes.data) ? jadwalRes.data : []);
      setKeretaList(Array.isArray(keretaRes.data) ? keretaRes.data : []);
    } catch (err: unknown) {
      setApiError('Gagal memuat sinkronisasi data jadwal operasional atau armada kereta.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatIsoToLocalDatetime = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const openCreateModal = () => {
    const primaryKeretaId = keretaList.length > 0 ? keretaList[0].id : 0;
    setFormData({
      asal_keberangkatan: '',
      tujuan_keberangkatan: '',
      tanggal_berangkat: '',
      tanggal_kedatangan: '',
      harga: 0,
      keretaId: primaryKeretaId,
    });
    setFormError(null);
    setModalType('CREATE');
  };

  const openEditModal = (jadwal: Jadwal) => {
    setSelectedJadwal(jadwal);
    setFormData({
      asal_keberangkatan: jadwal.asal_keberangkatan,
      tujuan_keberangkatan: jadwal.tujuan_keberangkatan,
      tanggal_berangkat: formatIsoToLocalDatetime(jadwal.tanggal_berangkat),
      tanggal_kedatangan: formatIsoToLocalDatetime(jadwal.tanggal_kedatangan),
      harga: jadwal.harga,
      keretaId: jadwal.keretaId,
    });
    setFormError(null);
    setModalType('EDIT');
  };

  const openDeleteModal = (jadwal: Jadwal) => {
    setSelectedJadwal(jadwal);
    setModalType('DELETE');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedJadwal(null);
    setFormError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'harga' || name === 'keretaId' ? Number(value) : value,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.asal_keberangkatan.trim() || !formData.tujuan_keberangkatan.trim() || !formData.tanggal_berangkat || !formData.tanggal_kedatangan || formData.harga <= 0 || formData.keretaId === 0) {
      setFormError('Semua bidang wajib diisi dengan data valid.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      await api.post('/jadwal', {
        asal_keberangkatan: formData.asal_keberangkatan.trim(),
        tujuan_keberangkatan: formData.tujuan_keberangkatan.trim(),
        tanggal_berangkat: new Date(formData.tanggal_berangkat).toISOString(),
        tanggal_kedatangan: new Date(formData.tanggal_kedatangan).toISOString(),
        harga: formData.harga,
        keretaId: formData.keretaId,
      });
      await fetchData();
      closeModal();
    } catch (err: unknown) {
      setFormError('Gagal menambahkan jadwal operasional baru ke database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJadwal) return;
    if (!formData.asal_keberangkatan.trim() || !formData.tujuan_keberangkatan.trim() || !formData.tanggal_berangkat || !formData.tanggal_kedatangan || formData.harga <= 0 || formData.keretaId === 0) {
      setFormError('Semua bidang wajib diisi dengan data valid.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      await api.patch(`/jadwal/${selectedJadwal.id}`, {
        asal_keberangkatan: formData.asal_keberangkatan.trim(),
        tujuan_keberangkatan: formData.tujuan_keberangkatan.trim(),
        tanggal_berangkat: new Date(formData.tanggal_berangkat).toISOString(),
        tanggal_kedatangan: new Date(formData.tanggal_kedatangan).toISOString(),
        harga: formData.harga,
        keretaId: formData.keretaId,
      });
      await fetchData();
      closeModal();
    } catch (err: unknown) {
      setFormError('Gagal memperbarui data perubahan jadwal operasional.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedJadwal) return;

    try {
      setIsSubmitting(true);
      await api.delete(`/jadwal/${selectedJadwal.id}`);
      await fetchData();
      closeModal();
    } catch (err: unknown) {
      alert('Gagal menghapus entri jadwal operasional terpilih.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredJadwal = useMemo(() => {
    return jadwalList.filter((j) =>
      j.asal_keberangkatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.tujuan_keberangkatan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jadwalList, searchQuery]);

  const formatDisplayDate = (isoString: string): string => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupedJadwal = useMemo(() => {
    const map = new Map()

    filteredJadwal.forEach((item) => {
      const key =
        `${item.asal_keberangkatan}-${item.tujuan_keberangkatan}-${item.keretaId}`

      if (!map.has(key)) {
        map.set(key, {
          ...item,
          total_jadwal: 0,
        })
      }

      map.get(key).total_jadwal++
    })

    return Array.from(map.values())
  }, [filteredJadwal])

  return (
    <div className="space-y-8 min-h-screen bg-slate-950 text-slate-100">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Kelola Jadwal</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">Kelola seluruh jadwal keberangkatan kereta.</p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={keretaList.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.15)] disabled:shadow-none active:scale-[0.98] disabled:active:scale-100 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal</span>
        </button>
      </div>

      <div className="w-full max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan stasiun asal atau tujuan..."
          className="w-full bg-slate-900 text-sm font-medium text-slate-200 placeholder-slate-500 pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
          <p className="text-sm text-slate-400">Sinkronisasi data manifest operasional dari server...</p>
        </div>
      ) : apiError ? (
        <div className="flex items-start gap-4 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-200">Koneksi Operasional Bermasalah</h4>
            <p className="text-sm text-slate-400 mt-1">{apiError}</p>
          </div>
        </div>
      ) : filteredJadwal.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <CalendarDays className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Tidak ada data jadwal keberangkatan terdaftar.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {groupedJadwal.map((jadwal: any) => {
            const kereta =
              keretaMap.get(
                jadwal.keretaId,
              )

            return (
              <div
                key={jadwal.id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <Train className="text-cyan-400" />

                  <div>
                    <h3 className="font-bold text-white">
                      {kereta?.nama_kereta}
                    </h3>

                    <p className="text-sm text-cyan-400">
                      {kereta?.kelas}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      Asal
                    </p>

                    <p className="font-semibold text-white">
                      {
                        jadwal.asal_keberangkatan
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Tujuan
                    </p>

                    <p className="font-semibold text-white">
                      {
                        jadwal.tujuan_keberangkatan
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Harga
                    </p>

                    <p className="font-bold text-green-400">
                      Rp{' '}
                      {Number(
                        jadwal.harga,
                      ).toLocaleString(
                        'id-ID',
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Total Jadwal
                    </p>

                    <p className="font-bold text-cyan-400">
                      {
                        jadwal.total_jadwal
                      }{' '}
                      Hari
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() =>
                      openEditModal(
                        jadwal,
                      )
                    }
                    className="flex-1 rounded-xl bg-cyan-400 py-2 font-semibold text-slate-950"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      openDeleteModal(
                        jadwal,
                      )
                    }
                    className="rounded-xl bg-red-500 px-4 py-2 text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={closeModal} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
              <h3 className="text-base font-bold text-white">
                {modalType === 'CREATE' && 'Tambah Jadwal Operasional'}
                {modalType === 'EDIT' && 'Ubah Konfigurasi Jadwal'}
                {modalType === 'DELETE' && 'Konfirmasi Penghapusan'}
              </h3>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {modalType === 'DELETE' ? (
              <div className="p-6 space-y-6">
                <div className="flex gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-red-200">Tindakan Destruktif Permanen</h5>
                    <p className="text-slate-400 mt-1">
                      Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.
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
              <form onSubmit={modalType === 'CREATE' ? handleCreateSubmit : handleEditSubmit} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="keretaId" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Pilih Armada Kereta
                  </label>
                  <select
                    id="keretaId"
                    name="keretaId"
                    value={formData.keretaId}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 text-sm font-medium text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200 appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 12px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                  >
                    {keretaList.map((k) => (
                      <option key={k.id} value={k.id} className="bg-slate-900">
                        {k.nama_kereta} ({k.kelas})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="asal_keberangkatan" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                      Stasiun Asal
                    </label>
                    <input
                      id="asal_keberangkatan"
                      name="asal_keberangkatan"
                      type="text"
                      value={formData.asal_keberangkatan}
                      onChange={handleInputChange}
                      placeholder="Contoh: Bandung"
                      className="w-full bg-slate-950 text-sm font-medium text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="tujuan_keberangkatan" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                      Stasiun Tujuan
                    </label>
                    <input
                      id="tujuan_keberangkatan"
                      name="tujuan_keberangkatan"
                      type="text"
                      value={formData.tujuan_keberangkatan}
                      onChange={handleInputChange}
                      placeholder="Contoh: Surabaya"
                      className="w-full bg-slate-950 text-sm font-medium text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="tanggal_berangkat" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                      Waktu Keberangkatan
                    </label>
                    <input
                      id="tanggal_berangkat"
                      name="tanggal_berangkat"
                      type="datetime-local"
                      value={formData.tanggal_berangkat}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 text-sm font-medium text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200 text-left"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="tanggal_kedatangan" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                      Waktu Kedatangan
                    </label>
                    <input
                      id="tanggal_kedatangan"
                      name="tanggal_kedatangan"
                      type="datetime-local"
                      value={formData.tanggal_kedatangan}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 text-sm font-medium text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200 text-left"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="harga" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Harga Tiket (IDR)
                  </label>
                  <input
                    id="harga"
                    name="harga"
                    type="number"
                    min="0"
                    value={formData.harga || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: 350000"
                    className="w-full bg-slate-950 text-sm font-medium text-slate-200 placeholder-slate-600 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none transition-all duration-200 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/60 mt-2">
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