import { useState } from 'react';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

// instant = true → Instant Consultation (only name + phone, no date/time)
export default function AppointmentForm({ doctor, instant = false, onSubmit, onCancel }) {
  const today = new Date().toISOString().split('T')[0];
  const [values, setValues] = useState({
    name: sessionStorage.getItem('name') || '',
    phone: sessionStorage.getItem('phone') || '',
    date: '',
    time: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = {};
    if (!values.name.trim()) found.name = 'Name is required.';
    if (!/^\d{10}$/.test(values.phone)) found.phone = 'Phone number must be exactly 10 digits.';
    if (!instant && !values.date) found.date = 'Please choose a date.';
    if (!instant && !values.time) found.time = 'Please choose a time slot.';
    setErrors(found);
    if (Object.keys(found).length) return;

    const details = instant
      ? { name: values.name, phone: values.phone, date: today, time: 'Now (instant)', instant: true }
      : values;
    onSubmit(details);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="appt-name">Name</label>
        <input id="appt-name" name="name" className="form-control" value={values.name} onChange={handleChange} />
        {errors.name && <div className="error-text">{errors.name}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="appt-phone">Phone Number</label>
        <input id="appt-phone" name="phone" type="tel" className="form-control" value={values.phone} onChange={handleChange} />
        {errors.phone && <div className="error-text">{errors.phone}</div>}
      </div>
      {!instant && (
        <>
          <div className="form-group">
            <label htmlFor="appt-date">Date of Appointment</label>
            <input id="appt-date" name="date" type="date" min={today} className="form-control" value={values.date} onChange={handleChange} />
            {errors.date && <div className="error-text">{errors.date}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="appt-time">Book Time Slot</label>
            <select id="appt-time" name="time" className="form-control" value={values.time} onChange={handleChange}>
              <option value="">Select a time slot</option>
              {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.time && <div className="error-text">{errors.time}</div>}
          </div>
        </>
      )}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{instant ? 'Book Now' : 'Book Appointment'}</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Close</button>
      </div>
      <p className="form-footer">with {doctor.name}</p>
    </form>
  );
}
