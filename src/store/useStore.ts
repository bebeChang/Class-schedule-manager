import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student, ClassSession, Payment } from '../types';

interface StoreState {
    students: Student[];
    sessions: ClassSession[];
    payments: Payment[];

    // Student Actions
    addStudent: (student: Student) => void;
    updateStudent: (id: string, updates: Partial<Student>) => void;
    deleteStudent: (id: string) => void;

    // Session Actions
    addSession: (session: ClassSession) => void;
    updateSession: (id: string, updates: Partial<ClassSession>) => void;
    deleteSession: (id: string) => void;

    // Payment Actions
    addPayment: (payment: Payment) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            students: [],
            sessions: [],
            payments: [],

            addStudent: (student) => set((state) => ({
                students: [...state.students, student]
            })),

            updateStudent: (id, updates) => set((state) => ({
                students: state.students.map((s) => (s.id === id ? { ...s, ...updates } : s)),
            })),

            deleteStudent: (id) => set((state) => ({
                students: state.students.filter((s) => s.id !== id)
            })),

            addSession: (session) => set((state) => ({
                sessions: [...state.sessions, session]
            })),

            updateSession: (id, updates) => set((state) => ({
                sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
            })),

            deleteSession: (id) => set((state) => ({
                sessions: state.sessions.filter((s) => s.id !== id)
            })),

            addPayment: (payment) => set((state) => ({
                payments: [...state.payments, payment],
                // Automatically update student balance when payment is added
                students: state.students.map(s =>
                    s.id === payment.studentId
                        ? { ...s, balance: s.balance + payment.classesAdded }
                        : s
                )
            })),
        }),
        {
            name: 'calligraphy-storage',
        }
    )
);
