import BookingConsultation from '../BookingConsultation/BookingConsultation';

// Instant consultation reuses the search + doctor cards,
// but books "right now" (name + phone only, no date/time slot).
export default function InstantConsultation() {
  return <BookingConsultation instant />;
}
