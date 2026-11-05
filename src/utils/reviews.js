import { readJSON, writeJSON } from './storage';

const KEY = 'reviews';

export const getReviews = () => readJSON(localStorage, KEY, {});

export function saveReview(doctorId, review) {
  writeJSON(localStorage, KEY, { ...getReviews(), [doctorId]: review });
}
