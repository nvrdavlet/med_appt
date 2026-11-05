import { useEffect, useState } from 'react';
import { APPOINTMENTS_EVENT, getAppointments } from '../../utils/appointments';
import { AUTH_EVENT, getCurrentUser } from '../../utils/auth';
import './Notification.css';

// Wraps the app and shows a notification for the latest booked appointment.
// It disappears automatically when the appointment is cancelled.
export default function Notification({ children }) {
  const [user, setUser] = useState(getCurrentUser());
  const [appointment, setAppointment] = useState(latest());
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onAppointments = () => { setAppointment(latest()); setHidden(false); };
    const onAuth = () => setUser(getCurrentUser());
    window.addEventListener(APPOINTMENTS_EVENT, onAppointments);
    window.addEventListener(AUTH_EVENT, onAuth);
    return () => {
      window.removeEventListener(APPOINTMENTS_EVENT, onAppointments);
      window.removeEventListener(AUTH_EVENT, onAuth);
    };
  }, []);

  return (
    <>
      {children}
      {user && appointment && !hidden && (
        <div className="notification" role="status">
          <div className="notification-head">
            <h3>Appointment Details</h3>
            <button aria-label="Close notification" onClick={() => setHidden(true)}>×</button>
          </div>
          <p><strong>User:</strong> {user.email}</p>
          <p><strong>Doctor:</strong> {appointment.doctorName}</p>
          <p><strong>Speciality:</strong> {appointment.doctorSpeciality}</p>
          <p><strong>Name:</strong> {appointment.name}</p>
          <p><strong>Phone Number:</strong> {appointment.phone}</p>
          <p><strong>Date of Appointment:</strong> {appointment.date}</p>
          <p><strong>Time Slot:</strong> {appointment.time}</p>
        </div>
      )}
    </>
  );
}

function latest() {
  const all = getAppointments();
  return all.length ? all[all.length - 1] : null;
}
