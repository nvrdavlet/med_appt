import { doctors } from '../data/doctors';

// Reviews are stored per doctor under "reviewData_<doctorId>" (the same key GiveReviews saves).
const key = (doctorId) => `reviewData_${doctorId}`;

export function getReviews() {
  const all = {};
  doctors.forEach((d) => {
    try {
      const raw = localStorage.getItem(key(d.id));
      if (raw) all[d.id] = JSON.parse(raw);
    } catch {
      /* ignore */
    }
  });
  return all;
}

export function saveReview(doctorId, review) {
  try {
    localStorage.setItem(key(doctorId), JSON.stringify(review));
  } catch {
    /* storage unavailable */
  }
}
