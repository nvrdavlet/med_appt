import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { specialities } from '../../data/doctors';
import './FindDoctorSearch.css';

// Doctor search for the Appointment Booking component.
// Selecting a speciality navigates to the results route:
//   /booking-consultation?speciality=<value>   (or /instant-consultation?speciality=<value>)
export default function FindDoctorSearch({ title = 'Find a doctor at your own ease' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const current = new URLSearchParams(location.search).get('speciality') || '';
  const [searchDoctor, setSearchDoctor] = useState(current);
  const [doctorResultHidden, setDoctorResultHidden] = useState(true);

  const matches = specialities.filter((s) => s.toLowerCase().includes(searchDoctor.toLowerCase()));

  const handleDoctorSelect = (speciality) => {
    setSearchDoctor(speciality);
    setDoctorResultHidden(true);
    navigate(`${location.pathname}?speciality=${encodeURIComponent(speciality)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchDoctor.trim()) handleDoctorSelect(searchDoctor.trim());
  };

  return (
    <div className="finddoctor">
      <h1>{title}</h1>
      <div className="finddoctor-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="72" height="72">
          <circle cx="32" cy="32" r="30" fill="var(--brand-soft)" />
          <path d="M22 18v12a10 10 0 0 0 20 0V18" fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 40v4a8 8 0 0 0 16 0v-4" fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="48" cy="36" r="4" fill="var(--brand)" />
        </svg>
      </div>

      <div className="finddoctor-search">
        <input
          type="text"
          className="form-control"
          placeholder="Search doctors, clinics, hospitals, etc."
          value={searchDoctor}
          onChange={(e) => { setSearchDoctor(e.target.value); setDoctorResultHidden(false); }}
          onFocus={() => setDoctorResultHidden(false)}
          onBlur={() => setTimeout(() => setDoctorResultHidden(true), 150)}
          onKeyDown={handleKeyDown}
        />
        {!doctorResultHidden && matches.length > 0 && (
          <ul className="finddoctor-results">
            {matches.map((speciality) => (
              <li key={speciality} onMouseDown={() => handleDoctorSelect(speciality)}>
                <span>{speciality}</span>
                <small>SPECIALITY</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
