import { useState } from 'react';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

// Appointment booking form: Name, Phone Number, Date and Time slot.
export default function AppointmentForm({ doctor, onSubmit, onCancel }) {
  const today = new Date().toISOString().split('T')[0];
  const [name, setName] = useState(sessionStorage.getItem('name') || '');
  const [phoneNumber, setPhoneNumber] = useState(sessionStorage.getItem('phone') || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState({});

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const found = {};
    if (!name.trim()) found.name = 'Name is required.';
    if (!/^\d{10}$/.test(phoneNumber)) found.phone = 'Phone number must be exactly 10 digits.';
    if (!date) found.date = 'Please choose a date.';
    if (!time) found.time = 'Please choose a time slot.';
    setErrors(found);
    if (Object.keys(found).length) return;

    onSubmit({ name, phone: phoneNumber, date, time });
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="appt-name">Name</label>
        <input id="appt-name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <div className="error-text">{errors.name}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="appt-phone">Phone Number</label>
        <input id="appt-phone" type="tel" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        {errors.phone && <div className="error-text">{errors.phone}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="appt-date">Date of Appointment</label>
        <input id="appt-date" type="date" min={today} className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
        {errors.date && <div className="error-text">{errors.date}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="appt-time">Book Time Slot</label>
        <select id="appt-time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)}>
          <option value="">Select a time slot</option>
          {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.time && <div className="error-text">{errors.time}</div>}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Book Appointment</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Close</button>
      </div>
      <p className="form-footer">with {doctor.name}</p>
    </form>
  );
}
