import { create } from 'zustand';
import { Schedule, Seat } from '@/types';

interface Passenger {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
}

interface BookingState {
  selectedSchedule: Schedule | null;
  selectedSeats: Seat[];
  passengers: Passenger[];
  selectedClass: string | null;
  setSchedule: (schedule: Schedule) => void;
  setSelectedSchedule: (schedule: Schedule) => void;
  setSeats: (seats: Seat[]) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  setPassengers: (passengers: Passenger[]) => void;
  addPassenger: (passenger: Passenger) => void;
  updatePassenger: (index: number, passenger: Passenger) => void;
  setSelectedClass: (classId: string) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedSchedule: null,
  selectedSeats: [],
  passengers: [],
  selectedClass: null,

  setSchedule: (schedule) => set({ selectedSchedule: schedule }),
  
  setSelectedSchedule: (schedule) => set({ selectedSchedule: schedule }),

  setSeats: (seats) => set({ selectedSeats: seats }),

  addSeat: (seat) =>
    set((state) => ({
      selectedSeats: [...state.selectedSeats, seat],
    })),

  removeSeat: (seatId) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.filter((s) => s.id !== seatId),
    })),

  setPassengers: (passengers) => set({ passengers }),

  addPassenger: (passenger) =>
    set((state) => ({
      passengers: [...state.passengers, passenger],
    })),

  updatePassenger: (index, passenger) =>
    set((state) => {
      const newPassengers = [...state.passengers];
      newPassengers[index] = passenger;
      return { passengers: newPassengers };
    }),

  setSelectedClass: (classId) => set({ selectedClass: classId }),

  reset: () =>
    set({
      selectedSchedule: null,
      selectedSeats: [],
      passengers: [],
      selectedClass: null,
    }),
}));
