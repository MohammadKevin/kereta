'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Armchair,
  Ticket,
  FileText,
  UserPlus,
  LogIn,
  Layout,
  Zap,
  History,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronRight,
  Train
} from 'lucide-react';
import api from '@/lib/api/api'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link'

interface RailwayData {
  id: number;
  nama_kereta: string;
  deskripsi: string;
  kelas: string;
}

export default function LandingPage() {
  const [railways, setRailways] = useState<RailwayData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRailways = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get<RailwayData[]>('/kereta');
        setRailways(response.data);
      } catch (err: any) {
        setError(err?.message || 'Gagal memuat data armada kereta. Silakan coba beberapa saat lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRailways();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="bg-[#030712] text-slate-100 min-h-screen font-sans overflow-x-hidden antialiased">
      <Navbar />

      <section
        id="beranda"
        className="relative min-h-screen overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="/images/hero/hero-train.jpg"
            alt="Hero Train"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-slate-950/70" />

          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/50 to-slate-950" />
        </div>

        <div className="relative z-10 flex min-h-screen items-center">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">

              <span className="mb-5 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
                Sistem Pemesanan Tiket Kereta Indonesia
              </span>

              <h1 className="mt-5 text-5xl font-extrabold leading-tight text-white md:text-7xl">
                RailTrack
                <span className="block text-cyan-400">
                  Booking Platform
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg text-slate-300">
                Cari jadwal perjalanan, pilih kursi,
                pesan tiket, dan nikmati pengalaman
                perjalanan kereta yang modern,
                cepat, dan aman.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="rounded-xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Pesan Sekarang
                </Link>

                <button
                  onClick={() =>
                    document
                      .getElementById('kereta')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                      })
                  }
                  className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur"
                >
                  Lihat Kereta
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_70%)] pointer-events-none" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="bg-gradient-to-br from-slate-900/60 to-blue-950/20 border border-blue-500/10 backdrop-blur-xl rounded-3xl p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500" />

          <div className="max-w-3xl">
            <h2 className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Tentang Sistem</h2>
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-6">Apa Itu RailTicket?</h3>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              RailTicket adalah sistem pemesanan tiket kereta berbasis web yang memudahkan pengguna melihat jadwal perjalanan, memilih kursi, memesan tiket, mengelola pemesanan, dan mencetak nota perjalanan secara digital. Built with Enterprise Architecture untuk memberikan performa transaksi yang cepat, aman, dan real-time.
            </p>
          </div>
        </motion.div>
      </section>

      <section id="kereta" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-12">
          <h2 className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Armada Terintegrasi</h2>
          <h3 className="text-3xl font-bold text-white">Daftar Kereta</h3>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-slate-800/60 rounded-2xl">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <p className="text-sm text-slate-400">Sinkronisasi armada kereta dari server...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-start gap-4 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-2xl">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <h4 className="font-semibold text-red-200">Koneksi Gagal</h4>
              <p className="text-sm text-slate-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && railways.length === 0 && (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-800/60 rounded-2xl">
            <Train className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Tidak ada data operasional kereta aktif saat ini.</p>
          </div>
        )}

        {!isLoading && !error && railways.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {railways.map((kereta) => (
              <motion.div
                key={kereta.id}
                variants={fadeInUp}
                className="group relative bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] flex flex-col justify-between"
              >
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h4 className="text-lg font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors duration-200">
                      {kereta.nama_kereta}
                    </h4>
                    <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-cyan-400 uppercase">
                      {kereta.kelas}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {kereta.deskripsi}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <section id="fitur" className="py-24 bg-[#020617] border-y border-blue-500/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.02),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Arsitektur Fitur</h2>
            <h3 className="text-3xl font-bold text-white">Eksplorasi Fitur Utama</h3>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.div variants={fadeInUp} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-200 mb-2">Cari Jadwal</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Pencarian rute dan jadwal keberangkatan kereta di seluruh lintasan rel Indonesia secara real-time.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <Armchair className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-200 mb-2">Pilih Kursi</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Visualisasi denah gerbong interaktif untuk memilih letak kursi kosong sesuai kenyamanan Anda.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <Ticket className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-200 mb-2">Pesan Tiket</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Proses pemesanan instan dengan sistem validasi identitas otomatis yang aman dan andal.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-200 mb-2">Cetak Nota</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Unduh dan cetak invoice resmi atau nota perjalanan digital langsung setelah pembayaran sukses konfirmasi.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="cara-pemesanan" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Alur Kerja</h2>
          <h3 className="text-3xl font-bold text-white">Cara Pemesanan Tiket</h3>
        </div>

        <div className="relative border-l border-slate-800 max-w-3xl mx-auto pl-6 sm:pl-10 space-y-12">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -left-[43px] sm:-left-[59px] w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2">Registrasi Akun</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Buat akun baru menggunakan alamat email aktif dan lakukan verifikasi data profile pengguna.</p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute -left-[43px] sm:-left-[59px] w-8 h-8 rounded-full bg-slate-950 border-2 border-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <LogIn className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2">Login</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Masuk ke dalam sistem menggunakan kredensial akun yang telah didaftarkan dengan aman.</p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute -left-[43px] sm:-left-[59px] w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2">Cari Jadwal</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Tentukan stasiun asal, stasiun tujuan, dan tanggal keberangkatan untuk mencari ketersediaan rute.</p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute -left-[43px] sm:-left-[59px] w-8 h-8 rounded-full bg-slate-950 border-2 border-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <Armchair className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2">Pilih Kursi</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Pilih sub-kelas kereta dan atur posisi nomor kursi di dalam gerbong yang masih kosong sesuai keinginan.</p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute -left-[43px] sm:-left-[59px] w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Ticket className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2">Pesan Tiket</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Isi detail data manifes penumpang dan selesaikan pembayaran melalui kanal transaksi terintegrasi.</p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="absolute -left-[43px] sm:-left-[59px] w-8 h-8 rounded-full bg-slate-950 border-2 border-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2">Cetak Nota</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Nota digital resmi diterbitkan otomatis oleh sistem sebagai bukti sah reservasi perjalanan Anda.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#020617] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Nilai Tambah</h2>
            <h3 className="text-3xl font-bold text-white">Keunggulan Sistem RailTicket</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300">
              <Layout className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-slate-200 mb-2">Interface Modern</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Tampilan UI premium yang bersih, intuitif, dan responsif untuk kenyamanan visual di perangkat desktop maupun seluler.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300">
              <Zap className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-slate-200 mb-2">Pemesanan Cepat</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Alur verifikasi dan pemrosesan antrean tiket kilat untuk menjamin ketersediaan kuota tanpa delay lama.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300">
              <Armchair className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-slate-200 mb-2">Manajemen Kursi</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Sinkronisasi sistem peta gerbong dinamis mencegah terjadinya duplikasi atau tumpang tindih pemilihan kursi.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300">
              <History className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-slate-200 mb-2">Riwayat Pemesanan</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Penyimpanan rekaman data transaksi perjalanan masa lalu dan mendatang yang tersusun rapi dalam dasbor pengguna.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300">
              <FileText className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-slate-200 mb-2">Nota Digital</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Dokumen digital berformat standar industri yang aman dari risiko kehilangan fisik dan ramah lingkungan.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300">
              <ShieldCheck className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-slate-200 mb-2">Sistem Aman</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Enkripsi proteksi end-to-end pada API endpoint guna mengamankan data rahasia profil beserta transaksi finansial.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 border border-blue-500/20 rounded-3xl p-8 md:p-16 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.05),transparent_60%)] pointer-events-none" />

          <h3 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Mulai Perjalanan Anda Sekarang
          </h3>
          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Temukan perjalanan terbaik dan pesan tiket kereta secara online dengan mudah. Nikmati fleksibilitas kendali penuh reservasi armada dalam satu dasbor terpadu.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl font-medium text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:opacity-95 active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center"
            >
              Login
            </Link>
            <a
              href="#kereta"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl font-medium active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center"
            >
              Lihat Kereta
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}