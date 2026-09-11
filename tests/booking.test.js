import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSlots, clinicDateKey, upcomingDates, validPatientDetails, isUpcomingAppointment } from '../src/lib/booking.js';

const now = new Date('2026-09-11T06:00:00Z'); // 09:30 Tehran, Friday
const hours = [{ day_of_week: 5, start_time: '09:00', end_time: '11:00', active: true }];

test('clinic dates use Tehran midnight and advance across month boundaries', () => {
  assert.equal(clinicDateKey(new Date('2026-09-30T21:00:00Z')), '2026-10-01');
  assert.deepEqual(upcomingDates(2, new Date('2026-09-30T19:00:00Z')), ['2026-09-30', '2026-10-01']);
});

test('slots honor hours, past times and any duration overlap', () => {
  const slots = buildSlots({ date: '2026-09-11', duration: 15, hours, appointments: [{ date: '2026-09-11', time: '09:50', duration_minutes: 40, status: 'confirmed' }], now });
  assert.equal(slots.find((slot) => slot.time === '09:30').taken, true);
  assert.equal(slots.find((slot) => slot.time === '09:45').taken, true);
  assert.equal(slots.find((slot) => slot.time === '10:15').taken, true);
  assert.equal(slots.find((slot) => slot.time === '10:30').taken, false);
  assert.deepEqual(buildSlots({ date: '2026-09-12', duration: 30, hours, appointments: [], now }), []);
  assert.deepEqual(buildSlots({ date: '2026-09-11', duration: 0, hours, appointments: [], now }), []);
});

test('cancelled visits release slots and duplicate work periods do not duplicate times', () => {
  const slots = buildSlots({ date: '2026-09-11', duration: 30, hours: [...hours, ...hours], appointments: [{ date: '2026-09-11', time: '10:00', status: 'cancelled' }], now });
  assert.equal(slots.length, 4);
  assert.equal(slots.find((slot) => slot.time === '10:00').taken, false);
});

test('patient validation accepts Iranian digit formats and rejects blank or invalid contact fields', () => {
  const patient = { first_name: 'فاضل', last_name: 'صداقت', mobile: '۰۹۱۲۳۴۵۶۷۸۹', email: '' };
  assert.equal(validPatientDetails(patient), true);
  assert.equal(validPatientDetails({ ...patient, first_name: ' ' }), false);
  assert.equal(validPatientDetails({ ...patient, mobile: '123' }), false);
  assert.equal(validPatientDetails({ ...patient, email: 'invalid' }), false);
});

test('same-day future appointment remains upcoming, terminal statuses do not', () => {
  const appointment = { date: '2026-09-11', time: '10:00', status: 'confirmed' };
  assert.equal(isUpcomingAppointment(appointment, now), true);
  assert.equal(isUpcomingAppointment({ ...appointment, time: '09:00' }, now), false);
  assert.equal(isUpcomingAppointment({ ...appointment, status: 'completed' }, now), false);
});
