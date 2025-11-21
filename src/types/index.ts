export interface Student {
    id: string;
    name: string;
    balance: number; // Number of classes remaining
    totalClassesTaken: number;
    notes?: string;
    joinedDate: string;
}

export interface ClassSession {
    id: string;
    date: string; // ISO string
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    studentIds: string[];
    completed: boolean;
}

export interface Payment {
    id: string;
    studentId: string;
    amount: number;
    classesAdded: number;
    date: string;
    note?: string;
}
