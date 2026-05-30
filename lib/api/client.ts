import api from '../api'

export const apiClient = {
  searchJadwal: (
    asal?: string,
    tujuan?: string,
    kelas?: string,
    tanggal?: string,
  ) => {
    return api.get('/jadwal', {
      params: {
        asal,
        tujuan,
        kelas,
        tanggal,
      },
    })
  },

  getJadwalDetail: (id: number) => {
    return api.get(`/jadwal/${id}`)
  },
}