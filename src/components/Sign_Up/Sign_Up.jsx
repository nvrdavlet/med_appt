import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../utils/auth';

const empty = { role: '', name: '', phone: '', email: '', password: '' };

export function validateSignUp(values) {
  const errors = {};
  if (!values.role) errors.role = 'Please select a role.';
  if (!values.name.trim()) errors.name = 'Name is required.';
  else if (values.name.trim().length < 4) errors.name = 'Name must be at least 4 characters.';
  if (!/^\d{10}$/.test(values.phone)) errors.phone = 'Phone number must be exactly 10 digits.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Please enter a valid email address.';
  if (values.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

export default function SignUp() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  // Validates the form, then calls the registration API (POST /api/auth/register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateSignUp(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    const result = await registerUser(values);
    if (!result.ok) return setFormError(result.error);
    navigate('/');
  };

  const handleReset = () => {
    setValues(empty);
    setErrors({});
    setFormError('');
  };

  const field = (name, label, type, placeholder) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name} name={name} type={type} placeholder={placeholder}
        value={values[name]} onChange={handleChange}
        className={`form-control ${errors[name] ? 'invalid' : ''}`}
      />
      {errors[name] && <div className="error-text">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="form-card">
      <h1>Sign Up</h1>
      <p className="subtitle">
        Already a member? <Link to="/login">Login</Link>
      </p>

      <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role" name="role" value={values.role} onChange={handleChange}
            className={`form-control ${errors.role ? 'invalid' : ''}`}
          >
            <option value="">Select role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          {errors.role && <div className="error-text">{errors.role}</div>}
        </div>
        {field('name', 'Name', 'text', 'Enter your name')}
        {field('phone', 'Phone', 'tel', 'Enter your 10-digit phone number')}
        {field('email', 'Email', 'email', 'Enter your email')}
        {field('password', 'Password', 'password', 'Enter your password')}

        {formError && <div className="error-text">{formError}</div>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="reset" className="btn btn-danger">Reset</button>
        </div>
      </form>
    </div>
  );
}
