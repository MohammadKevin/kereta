export interface User {
  id: number
  nama: string
  email: string
  role: 'ADMIN' | 'USER'
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface Kereta {
  id: number
  nama_kereta: string
  deskripsi: string
  kelas: string
}

export interface Jadwal {
  id: number

  asal_keberangkatan: string
  tujuan_keberangkatan: string

  tanggal_berangkat: string
  tanggal_kedatangan: string

  harga: number

  total_kursi: number
  kursi_tersedia: number

  kereta: Kereta
}

export interface Kursi {
  id: number
  no_kursi: string
  tersedia: boolean
}

export interface Gerbong {
  id: number
  nama_gerbong: string
  kuota: number
  kursi: Kursi[]
}

export interface DetailJadwal {
  id: number

  asal_keberangkatan: string
  tujuan_keberangkatan: string

  tanggal_berangkat: string
  tanggal_kedatangan: string

  harga: number

  kereta: {
    id: number
    nama_kereta: string
    deskripsi: string
    kelas: string
    gerbong: Gerbong[]
  }
}