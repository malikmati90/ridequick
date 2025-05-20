
// Combine date and time
export function combineDateAndTime(date: Date, time: Date): Date {
    const combined = new Date(date)
    combined.setHours(time.getHours(), time.getMinutes(), 0, 0)
    return combined
}

// Airport detection
export function detectIsAirport(pickup: string, destination: string): boolean {
    const airportKeywords = ["airport", "el prat", "aeropuerto", "aeroport"]
    const check = (text: string) =>
        airportKeywords.some((keyword) => text.toLowerCase().includes(keyword))
    return check(pickup) || check(destination)
}

// Holiday detection
const barcelonaHolidays: string[] = [
    "2025-01-01",
    "2025-01-06",
    "2025-04-18",
    "2025-04-21",
    "2025-05-01",
    "2025-06-24",
    "2025-08-15",
    "2025-09-11",
    "2025-09-24",
    "2025-10-12",
    "2025-11-01",
    "2025-12-06",
    "2025-12-08",
    "2025-12-25",
    "2025-12-26",
]

export function detectIsHoliday(date: Date): boolean {
    const formatted = date.toISOString().split("T")[0]
    return barcelonaHolidays.includes(formatted)
}
