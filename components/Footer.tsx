import React from 'react';
import Link from 'next/link';
import { Train, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-blue-500/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(14,165,233,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Logo & Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="#beranda" className="flex items-center gap-2">
              <Train className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent tracking-wide">
                RailTicket
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform pemesanan tiket kereta berbasis web terintegrasi untuk kenyamanan perjalanan domestik Anda.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Navigasi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#beranda" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#kereta" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                  Kereta
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                  Fitur
                </Link>
              </li>
              <li>
                <Link href="#cara-pemesanan" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                  Cara Pemesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* System Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Sistem</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer">
                  Login
                </button>
              </li>
              <li>
                <button className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer">
                  Register
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Kontak</h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-cyan-400" />
              <a href="mailto:support@railticket.com" className="hover:text-cyan-400 transition-colors duration-200">
                support@railticket.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Area */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2026 RailTicket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}