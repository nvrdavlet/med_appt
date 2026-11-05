import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentForm from '../AppointmentForm/AppointmentForm';
import AppointmentFormIC from '../AppointmentFormIC/AppointmentFormIC';
import { addAppointment, cancelAppointment, getAppointments, APPOINTMENTS_EVENT } from '../../utils/appointments';
import { getCurrentUser } from '../../utils/auth';
import './DoctorCard.css';

const initials = (name) => name.replace('Dr. ', '').split(' ').map((p) => p[0]).join('');

export default function DoctorCard({ doctor, instant = false }) {
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState(() => mine(doctor));
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = () => setAppointments(mine(doctor));
    window.addEventListener(APPOINTMENTS_EVENT, refresh);
    return () => window.removeEventListener(APPOINTMENTS_EVENT, refresh);
  }, [doctor]);

  const openForm = () => {
    if (!getCurrentUser()) return navigate('/login');
    setShowForm(true);
  };

  // Cancel appointment: removes it from storage; the card shows "Book" again
  // and the Notification disappears automatically.
  const handleCancel = (appointmentId) => {
    cancelAppointment(appointmentId);
    setAppointments(mine(doctor));
  };

  const handleSubmit = (details) => {
    addAppointment(doctor, details);
    setShowForm(false);
  };

  return (
    <div className="doctor-card">
      <div className="doctor-avatar">{initials(doctor.name)}</div>
      <div className="doctor-info">
        <h3>{doctor.name}</h3>
        <p className="doctor-speciality">{doctor.speciality}</p>
        <p className="doctor-meta">{doctor.experience} years experience</p>
        <p className="doctor-rating" aria-label={`Rating ${doctor.ratings} of 5`}>
          {'★'.repeat(doctor.ratings)}<span>{'★'.repeat(5 - doctor.ratings)}</span>
        </p>
      </div>

      {appointments.length > 0 ? (
        <div className="doctor-booked">
          {appointments.map((a) => (
            <div key={a.id} className="doctor-booked-item">
              <p><strong>{a.name}</strong> · {a.phone}</p>
              <p>{a.date} · {a.time}</p>
              <button className="btn btn-danger" onClick={() => handleCancel(a.id)}>Cancel Appointment</button>
            </div>
          ))}
        </div>
      ) : (
        <button className="btn btn-primary doctor-book" onClick={openForm}>
          {instant ? 'Book Now' : 'Book Appointment'}
          <small>No booking fee</small>
        </button>
      )}

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{instant ? 'Instant Consultation' : 'Book an Appointment'}</h2>
            {instant ? (
              <AppointmentFormIC doctor={doctor} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
            ) : (
              <AppointmentForm doctor={doctor} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function mine(doctor) {
  return getAppointments().filter((a) => a.doctorName === doctor.name);
}
