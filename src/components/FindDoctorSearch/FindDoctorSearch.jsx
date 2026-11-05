import { useState } from 'react';
import { specialities } from '../../data/doctors';
import './FindDoctorSearch.css';

export default function FindDoctorSearch({ onSearch, title = 'Find a doctor at your own ease' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const matches = specialities.filter((s) => s.toLowerCase().includes(query.toLowerCase()));

  const choose = (speciality) => {
    setQuery(speciality);
    setOpen(false);
    onSearch(speciality);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') choose(query.trim());
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
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
        />
        {open && matches.length > 0 && (
          <ul className="finddoctor-results">
            {matches.map((s) => (
              <li key={s} onMouseDown={() => choose(s)}>
                <span>{s}</span>
                <small>SPECIALITY</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
