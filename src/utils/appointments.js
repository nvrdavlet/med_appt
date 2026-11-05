import { readJSON, writeJSON } from './storage';

const KEY = 'appointments';
export const APPOINTMENTS_EVENT = 'appointments-changed';

const notify = () => window.dispatchEvent(new Event(APPOINTMENTS_EVENT));

export const getAppointments = () => readJSON(localStorage, KEY, []);

export function addAppointment(doctor, details) {
  const appointment = {
    id: Date.now(),
    doctorName: doctor.name,
    doctorSpeciality: doctor.speciality,
    ...details,
  };
  writeJSON(localStorage, KEY, [...getAppointments(), appointment]);
  notify();
  return appointment;
}

export function cancelAppointment(id) {
  writeJSON(localStorage, KEY, getAppointments().filter((a) => a.id !== id));
  notify();
}
