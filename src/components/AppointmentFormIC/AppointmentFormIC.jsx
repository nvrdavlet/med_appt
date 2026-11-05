import { useState } from 'react';

// Instant Consultation form: only Name and Phone Number.
export default function AppointmentFormIC({ doctor, onSubmit, onCancel }) {
  const [name, setName] = useState(sessionStorage.getItem('name') || '');
  const [phoneNumber, setPhoneNumber] = useState(sessionStorage.getItem('phone') || '');
  const [errors, setErrors] = useState({});

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const found = {};
    if (!name.trim()) found.name = 'Name is required.';
    if (!/^\d{10}$/.test(phoneNumber)) found.phone = 'Phone number must be exactly 10 digits.';
    setErrors(found);
    if (Object.keys(found).length) return;

    onSubmit({
      name,
      phone: phoneNumber,
      date: new Date().toISOString().split('T')[0],
      time: 'Now (instant)',
      instant: true,
    });
    setName('');
    setPhoneNumber('');
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="ic-name">Name</label>
        <input id="ic-name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <div className="error-text">{errors.name}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="ic-phone">Phone Number</label>
        <input id="ic-phone" type="tel" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        {errors.phone && <div className="error-text">{errors.phone}</div>}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Book Now</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Close</button>
      </div>
      <p className="form-footer">Instant consultation with {doctor.name}</p>
    </form>
  );
}
