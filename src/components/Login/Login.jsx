import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../utils/auth';

const empty = { email: '', password: '' };

export function validateLogin(values) {
  const errors = {};
  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Please enter a valid email address.';
  if (!values.password) errors.password = 'Password is required.';
  else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

export default function Login() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
    setFormError('');
  };

  // Validates the form, then calls the login API (POST /api/auth/login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateLogin(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    const result = await loginUser(values);
    if (!result.ok) return setFormError(result.error);
    navigate('/');
  };

  const handleReset = () => {
    setValues(empty);
    setErrors({});
    setFormError('');
  };

  return (
    <div className="form-card">
      <h1>Login</h1>
      <p className="subtitle">
        Are you a new member? <Link to="/signup">Sign Up Here</Link>
      </p>

      <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email" name="email" type="email" placeholder="Enter your email"
            value={values.email} onChange={handleChange}
            className={`form-control ${errors.email ? 'invalid' : ''}`}
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password" name="password" type="password" placeholder="Enter your password"
            value={values.password} onChange={handleChange}
            className={`form-control ${errors.password ? 'invalid' : ''}`}
          />
          {errors.password && <div className="error-text">{errors.password}</div>}
        </div>

        {formError && <div className="error-text">{formError}</div>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Login</button>
          <button type="reset" className="btn btn-danger">Reset</button>
        </div>
        <p className="form-footer"><a href="#/login">Forgot Password?</a></p>
      </form>
    </div>
  );
}
