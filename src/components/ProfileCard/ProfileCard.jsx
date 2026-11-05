import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AUTH_EVENT, getCurrentUser, updateProfile } from '../../utils/auth';
import './ProfileCard.css';

export default function ProfileCard() {
  const [user, setUser] = useState(getCurrentUser());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const refresh = () => setUser(getCurrentUser());
    window.addEventListener(AUTH_EVENT, refresh);
    return () => window.removeEventListener(AUTH_EVENT, refresh);
  }, []);

  if (!user) {
    return (
      <div className="form-card" style={{ textAlign: 'center' }}>
        <h1>Your Profile</h1>
        <p className="subtitle">Please <Link to="/login">log in</Link> to view your profile.</p>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 4) found.name = 'Name must be at least 4 characters.';
    if (!/^\d{10}$/.test(form.phone)) found.phone = 'Phone number must be exactly 10 digits.';
    setErrors(found);
    if (Object.keys(found).length) return;
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="form-card profile-card">
      <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
      <h1>Your Profile</h1>
      {saved && <p className="profile-saved">Profile updated successfully!</p>}

      {editing ? (
        <form onSubmit={handleSave} noValidate>
          <div className="form-group">
            <label htmlFor="profile-email">Email</label>
            <input id="profile-email" className="form-control" value={user.email} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="profile-name">Name</label>
            <input id="profile-name" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="profile-phone">Phone</label>
            <input id="profile-phone" className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            {errors.phone && <div className="error-text">{errors.phone}</div>}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <dl className="profile-details">
            <dt>Name</dt><dd>{user.name}</dd>
            <dt>Email</dt><dd>{user.email}</dd>
            <dt>Phone</dt><dd>{user.phone}</dd>
            <dt>Role</dt><dd style={{ textTransform: 'capitalize' }}>{user.role}</dd>
          </dl>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setForm({ name: user.name, phone: user.phone }); setEditing(true); }}>
            Edit
          </button>
        </>
      )}
    </div>
  );
}
