export const CLPFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
});


export function validateRun(run: string): boolean {
    run = run.replace(/\./g, '').replace(/\s+/g, '');
    const rutRegex = /^\d{7,8}-[0-9kK]{1}$/;
    if (!rutRegex.test(run)) {
        return false;
    }
    const [body, dv] = run.split('-');
    let total = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
        total += parseInt(body[i]) * multiplier;
        multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }
    const expected = 11 - (total % 11);
    const expectedDv = expected === 11 ? '0' : expected === 10 ? 'k' : String(expected);
    return dv.toLowerCase() === expectedDv;
}

export function validateEarlierDate(startDate: Date | null, endDate: Date | null) {
    if (!startDate && !endDate) return true;
    if (startDate && !endDate) return true;
    if (startDate && endDate) return startDate < endDate;

    return false;
}

export function removeDateTime(date: Date): string {
    return date.toISOString().split("T")[0];
}

export function getTomorrowDate(): Date {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    today.setHours(0, 0, 0, 0);
    return today;
}

export function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
        return [];
    }

    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
}

export function getModifiedFields<T extends Record<string, any>>(
    original: T,
    updated: Partial<{ [K in keyof T]: T[K] | null }>
): Partial<T> {
    const changes: Partial<T> = {};

    for (const key in updated) {
        if (!Object.prototype.hasOwnProperty.call(updated, key)) continue;

        const originalValue = original[key];
        const updatedValue = updated[key];

        if (updatedValue !== undefined && updatedValue !== originalValue) {
            changes[key] = updatedValue as T[typeof key];
        }
    }

    return changes;
}

export function parseDateToLocal(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);

    return new Date(year, month - 1, day);
}

export function emptyStringToNull(value: string): string | null {
    return (value != "") ? value : null;
}