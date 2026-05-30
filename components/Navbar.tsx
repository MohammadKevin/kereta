'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Train,
  LogIn,
  UserPlus,
} from 'lucide-react'

const navLinks = [
  {
    name: 'Beranda',
    href: '#beranda',
  },
  {
    name: 'Kereta',
    href: '#kereta',
  },
  {
    name: 'Fitur',
    href: '#fitur',
  },
  {
    name: 'Cara Pemesanan',
    href: '#cara-pemesanan',
  },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] =
    useState(false)

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(
        window.scrollY > 20,
      )
    }

    window.addEventListener(
      'scroll',
      handleScroll,
    )

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll,
      )
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-cyan-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Train className="w-5 h-5 text-slate-950" />
            </div>

            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              RailTicket
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg transition-all duration-200"
            >
              <LogIn className="w-4 h-4" />
              Masuk
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg hover:opacity-90 transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
            >
              <UserPlus className="w-4 h-4" />
              Daftar
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() =>
              setIsMobileMenuOpen(
                !isMobileMenuOpen,
              )
            }
            className="md:hidden p-2 text-slate-300"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: 'auto',
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="md:hidden bg-[#030712]/95 backdrop-blur-xl border-t border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-6">
              {/* Menu */}
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() =>
                      setIsMobileMenuOpen(
                        false,
                      )
                    }
                    className="text-base font-medium text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-slate-800" />

              {/* Auth */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() =>
                    setIsMobileMenuOpen(
                      false,
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk
                </Link>

                <Link
                  href="/register"
                  onClick={() =>
                    setIsMobileMenuOpen(
                      false,
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:opacity-90 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Daftar
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}