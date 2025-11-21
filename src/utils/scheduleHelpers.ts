import { addDays, isSameDay, isBefore, parseISO, getDay } from 'date-fns';

export function generateRecurringDates(
    startDateStr: string,
    endDateStr: string,
    selectedDays: number[] // 0 = Sunday, 1 = Monday, ...
): string[] {
    const start = parseISO(startDateStr);
    const end = parseISO(endDateStr);
    const dates: string[] = [];

    let current = start;

    // Safety check to prevent infinite loops or massive generation
    const MAX_DAYS = 365;
    let count = 0;

    while ((isBefore(current, end) || isSameDay(current, end)) && count < MAX_DAYS) {
        const dayOfWeek = getDay(current);

        if (selectedDays.includes(dayOfWeek)) {
            dates.push(current.toISOString().split('T')[0]);
        }

        current = addDays(current, 1);
        count++;
    }

    return dates;
}
