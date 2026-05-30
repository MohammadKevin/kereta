'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Train, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api/api';

interface UserData {
  id: number;
  username: string;
  role: 'ADMIN' | 'PENUMPANG';
}

interface LoginResponse {
  token: string;
  user: UserData;
}

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ username?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const errors: { username?: string; password?: string } = {};
    let isValid = true;

    if (!username.trim()) {
      errors.username = 'Username wajib diisi';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password wajib diisi';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    setValidationErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        username: username.trim(),
        password,
      });

      const { token, user } =
        response.data;

      localStorage.setItem(
        'accessToken',
        token,
      );
      localStorage.setItem('user', JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username.trim());
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      switch (user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;

        case 'PENUMPANG':
          router.push('/dashboard/penumpang');
          break;

        default:
          router.push('/');
          break;
      }
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        setApiError('Username atau password salah');
      } else {
        setApiError('Terjadi kesalahan saat login. Silakan coba beberapa saat lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col lg:flex-row font-sans antialiased selection:bg-cyan-500/30">

      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden border-r border-blue-500/10">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(3, 7, 18, 0.85) 30%, rgba(2, 6, 23, 0.6) 100%), url('https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=1200&q=80')`
          }}
        />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />

        <div className="relative z-10 max-w-lg w-full flex flex-col justify-between h-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/60 border border-blue-500/20 backdrop-blur-md self-start shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            <Train className="w-5 h-5 text-cyan-400" />
            <span className="text-base font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent tracking-wide">
              RailTicket
            </span>
          </motion.div>

          <div className="my-auto space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white"
            >
              Selamat Datang <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Kembali
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="text-slate-400 text-base xl:text-lg leading-relaxed font-normal"
            >
              Masuk ke akun RailTicket untuk mengelola perjalanan dan pemesanan tiket kereta Anda.
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xs text-slate-500 font-medium tracking-wide"
          >
            &copy; 2026 RailTicket Core Engine. All rights reserved.
          </motion.p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative overflow-hidden">
        <div className="absolute lg:hidden top-[-10%] right-[-10%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute lg:hidden bottom-[-10%] left-[-10%] w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="group inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Kembali</span>
            </button>
            <div className="lg:hidden flex items-center gap-1.5">
              <Train className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold tracking-wide text-white">RailTicket</span>
            </div>
          </div>
          <div className="lg:hidden space-y-2">
            <h2 className="text-2xl font-bold text-white">Selamat Datang Kembali</h2>
            <p className="text-sm text-slate-400">Masuk ke akun RailTicket untuk mengelola perjalanan Anda.</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl relative"
          >
            {apiError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span className="font-medium">{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-xs font-semibold tracking-wider uppercase text-slate-400 block">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    placeholder="Masukkan username"
                    className={`w-full bg-slate-950/80 text-sm font-medium text-slate-100 placeholder-slate-500 pl-11 pr-4 py-3 rounded-xl border transition-all duration-200 outline-none ${validationErrors.username
                      ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                      : 'border-slate-800 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                      }`}
                  />
                </div>
                {validationErrors.username && (
                  <p className="text-xs font-medium text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {validationErrors.username}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-semibold tracking-wider uppercase text-slate-400 block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Masukkan password"
                    className={`w-full bg-slate-950/80 text-sm font-medium text-slate-100 placeholder-slate-500 pl-11 pr-11 py-3 rounded-xl border transition-all duration-200 outline-none ${validationErrors.password
                      ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                      : 'border-slate-800 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors duration-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-xs font-medium text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {validationErrors.password}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded bg-slate-950 border border-slate-800 peer-checked:border-cyan-500 peer-checked:bg-cyan-500/10 flex items-center justify-center transition-all duration-200 group-hover:border-slate-700">
                    <div className="w-1.5 h-1.5 rounded-sm bg-cyan-400 opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                    Ingat Saya
                  </span>
                </label>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 rounded-xl font-semibold text-sm tracking-wide shadow-[0_4px_25px_rgba(34,211,238,0.15)] hover:shadow-[0_4px_30px_rgba(34,211,238,0.25)] disabled:shadow-none hover:opacity-95 disabled:opacity-100 active:scale-[0.99] disabled:active:scale-100 transition-all duration-200 flex items-center justify-center overflow-hidden group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <span>Masuk</span>
                )}
              </button>

            </form>
          </motion.div>
          <p className="text-center text-sm text-slate-400">
            Belum memiliki akun?{' '}
            <button
              onClick={() => router.push('/register')}
              disabled={isLoading}
              className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer disabled:opacity-50 disabled:no-underline"
            >
              Daftar Sekarang
            </button>
          </p>

        </div>
      </div>

    </div>
  );
}