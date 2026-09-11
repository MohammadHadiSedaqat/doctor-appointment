const CLINIC_TIME_ZONE = 'Asia/Tehran';

export function clinicDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: CLINIC_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function clinicMinutes(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: CLINIC_TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  return Number(parts.find((part) => part.type === 'hour')?.value) * 60 + Number(parts.find((part) => part.type === 'minute')?.value);
}

export function upcomingDates(count = 14, now = new Date()) {
  const start = new Date(`${clinicDateKey(now)}T12:00:00Z`);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
}

export function timeToMinutes(time) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time || '')) return null;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function buildSlots({ date, duration, hours, appointments, now = new Date() }) {
  const length = Number(duration);
  if (!date || !Number.isFinite(length) || length <= 0 || length > 1440) return [];
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  const today = clinicDateKey(now);
  if (date < today) return [];
  const slots = new Map();
  for (const period of hours.filter((item) => item.active !== false && item.day_of_week === day)) {
    const start = timeToMinutes(period.start_time);
    const end = timeToMinutes(period.end_time);
    if (start === null || end === null || end <= start) continue;
    for (let minute = start; minute + length <= end; minute += length) {
      const time = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
      const past = date === today && minute <= clinicMinutes(now);
      const taken = appointments.some((appointment) => {
        if (appointment.status === 'cancelled' || appointment.date !== date) return false;
        const occupiedStart = timeToMinutes(appointment.time);
        const occupiedLength = Number(appointment.duration_minutes) > 0 ? Number(appointment.duration_minutes) : 30;
        return occupiedStart !== null && minute < occupiedStart + occupiedLength && occupiedStart < minute + length;
      });
      slots.set(time, { time, taken: past || taken });
    }
  }
  return [...slots.values()].sort((a, b) => a.time.localeCompare(b.time));
}

export function normalizeDigits(value) {
  return String(value || '').replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
}

export function validPatientDetails(patient) {
  const mobile = normalizeDigits(patient.mobile).replace(/[\s()-]/g, '');
  return Boolean(patient.first_name?.trim() && patient.last_name?.trim() && /^(?:09\d{9}|(?:\+98|0098)9\d{9})$/.test(mobile) && (!patient.email?.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email.trim())));
}

export function isUpcomingAppointment(appointment, now = new Date()) {
  if (['cancelled', 'completed', 'no_show'].includes(appointment.status)) return false;
  const date = clinicDateKey(now);
  const minutes = timeToMinutes(appointment.time);
  return appointment.date > date || (appointment.date === date && minutes !== null && minutes >= clinicMinutes(now));
}
